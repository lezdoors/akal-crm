import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, OptionsMiddleware } from "../_shared/cors.ts";
import { createErrorResponse } from "../_shared/utils.ts";
import { AuthMiddleware } from "../_shared/authentication.ts";

// Read-only window onto the storefront-owned `abandoned_checkouts` table.
//
// That table is RLS-locked to service-role by design — customer PII is kept
// off the public/authenticated client — so the CRM cannot read it through
// PostgREST. This function, gated to authenticated CRM staff, reads via the
// service role and returns only the operational columns the CRM needs. The
// one-click `recovery_token` (an auth secret) and `stripe_payment_intent_id`
// are never returned. The CRM only reads; the storefront owns the write path.

const SELECT_COLUMNS =
  "id, email, customer_name, items, amount_minor, currency, promo_code, status, first_email_sent_at, second_email_sent_at, unsubscribed, created_at, updated_at";

async function handleGet(): Promise<Response> {
  // Carts in progress: started checkout, not yet paid. Newest first.
  const { data: inProgress, error: inProgressError } = await supabaseAdmin
    .from("abandoned_checkouts")
    .select(SELECT_COLUMNS)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(200);

  if (inProgressError) {
    console.error("abandoned-carts in-progress query failed:", inProgressError);
    return createErrorResponse(500, "Failed to load carts in progress");
  }

  // Recovery-attributed sales: converted AFTER at least one recovery email —
  // the dollar proof the recovery flow is working.
  const { data: recovered, error: recoveredError } = await supabaseAdmin
    .from("abandoned_checkouts")
    .select(SELECT_COLUMNS)
    .eq("status", "converted")
    .not("first_email_sent_at", "is", null)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (recoveredError) {
    console.error("abandoned-carts recovered query failed:", recoveredError);
    return createErrorResponse(500, "Failed to load recovered carts");
  }

  return new Response(
    JSON.stringify({
      inProgress: inProgress ?? [],
      recovered: recovered ?? [],
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
}

Deno.serve(async (req: Request) =>
  OptionsMiddleware(req, async (req) =>
    AuthMiddleware(req, async (req) => {
      // supabase.functions.invoke issues POST by default; accept GET too.
      if (req.method === "POST" || req.method === "GET") {
        return handleGet();
      }
      return createErrorResponse(405, "Method Not Allowed");
    }),
  ),
);
