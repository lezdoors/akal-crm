import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, OptionsMiddleware } from "../_shared/cors.ts";
import { createErrorResponse } from "../_shared/utils.ts";
import { AuthMiddleware } from "../_shared/authentication.ts";

const FROM_EMAIL = "Maison Tanneurs <orders@maisontanneurs.com>";
const REPLY_TO = "hello@maisontanneurs.com";

interface OrderRow {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  tracking_number: string | null;
  shipping_email_sent_at: string | null;
}

function shippingEmailHtml(order: OrderRow, carrier?: string): string {
  return `
    <div style="max-width:600px;margin:0 auto;background:#f5efe3;padding:48px 32px;font-family:'Inter Tight',Helvetica,Arial,sans-serif;color:#1f1b16;">
      <div style="text-align:center;margin-bottom:40px;">
        <div style="font-family:Georgia,serif;font-size:36px;letter-spacing:-0.01em;">MAISON TANNEURS</div>
      </div>
      <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#3a332a;">Dear ${order.customer_name},</p>
      <p style="font-size:15px;line-height:1.7;color:#3a332a;">Your order ${order.order_number} has been shipped from Marrakech.</p>
      <div style="background:#ebe3d1;padding:24px;margin:24px 0;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;margin-bottom:8px;">Tracking</div>
        <p style="font-family:monospace;font-size:16px;margin:0;">${order.tracking_number}</p>
        ${carrier ? `<p style="font-family:monospace;font-size:12px;color:#7a6f5c;margin:4px 0 0;">via ${carrier}</p>` : ""}
      </div>
      <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #d9cfbb;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;">Maison Tanneurs · Marrakech</div>
      </div>
    </div>
  `;
}

async function sendViaResend(order: OrderRow, carrier?: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      reply_to: REPLY_TO,
      to: order.customer_email,
      subject: `Your Maison Tanneurs Order Has Shipped · ${order.order_number}`,
      html: shippingEmailHtml(order, carrier),
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend ${response.status}: ${body}`);
  }
}

/**
 * Sends the shipping-notification email for an order, exactly once.
 *
 * Exactly-once is enforced in the database, not the UI: the function first
 * CLAIMS the send by setting shipping_email_sent_at where it is still null
 * (atomic compare-and-set). Only the request that wins the claim sends the
 * email; on Resend failure the claim is released so the send can be retried.
 */
async function handleSend(req: Request): Promise<Response> {
  let body: { order_id?: string; carrier?: string };
  try {
    body = await req.json();
  } catch {
    return createErrorResponse(400, "Invalid JSON body");
  }
  if (!body.order_id) {
    return createErrorResponse(400, "order_id is required");
  }

  const { data: claimed, error: claimError } = await supabaseAdmin
    .from("orders")
    .update({ shipping_email_sent_at: new Date().toISOString() })
    .eq("id", body.order_id)
    .is("shipping_email_sent_at", null)
    .not("tracking_number", "is", null)
    .neq("tracking_number", "")
    .select(
      "id, order_number, customer_email, customer_name, tracking_number, shipping_email_sent_at",
    );

  if (claimError) {
    console.error("Claim failed:", claimError);
    return createErrorResponse(500, "Failed to claim shipping email send");
  }

  if (!claimed?.length) {
    // Either already sent, no tracking number, or unknown order id.
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, tracking_number, shipping_email_sent_at")
      .eq("id", body.order_id)
      .maybeSingle();
    if (!order) return createErrorResponse(404, "Order not found");
    if (order.shipping_email_sent_at) {
      return new Response(
        JSON.stringify({ sent: false, reason: "already_sent" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }
    return createErrorResponse(409, "Order has no tracking number");
  }

  const order = claimed[0] as OrderRow;
  try {
    await sendViaResend(order, body.carrier);
  } catch (error) {
    console.error("Resend send failed, releasing claim:", error);
    await supabaseAdmin
      .from("orders")
      .update({ shipping_email_sent_at: null })
      .eq("id", order.id);
    return createErrorResponse(502, "Email send failed; claim released");
  }

  return new Response(JSON.stringify({ sent: true }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req: Request) =>
  OptionsMiddleware(req, async (req) =>
    AuthMiddleware(req, async (req) => {
      if (req.method === "POST") {
        return handleSend(req);
      }
      return createErrorResponse(405, "Method Not Allowed");
    }),
  ),
);
