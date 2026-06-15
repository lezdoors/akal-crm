import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, OptionsMiddleware } from "../_shared/cors.ts";
import { createErrorResponse } from "../_shared/utils.ts";
import { AuthMiddleware, UserMiddleware } from "../_shared/authentication.ts";
import { getUserSale } from "../_shared/getUserSale.ts";

async function updateSaleDisabled(user_id: string, disabled: boolean) {
  return await supabaseAdmin
    .from("sales")
    .update({ disabled: disabled ?? false })
    .eq("user_id", user_id);
}

async function updateSaleAdministrator(
  user_id: string,
  administrator: boolean,
) {
  const { data: sales, error: salesError } = await supabaseAdmin
    .from("sales")
    .update({ administrator })
    .eq("user_id", user_id)
    .select("*");

  if (!sales?.length || salesError) {
    console.error("Error updating user:", salesError);
    throw salesError ?? new Error("Failed to update sale");
  }
  return sales.at(0);
}

async function createSale(
  user_id: string,
  data: {
    email: string;
    first_name: string;
    last_name: string;
    disabled: boolean;
    administrator: boolean;
  },
) {
  const { data: sales, error: salesError } = await supabaseAdmin
    .from("sales")
    .insert({ ...data, user_id })
    .select("*");

  if (!sales?.length || salesError) {
    console.error("Error creating user:", salesError);
    throw salesError ?? new Error("Failed to create sale");
  }
  return sales.at(0);
}

async function updateSaleAvatar(user_id: string, avatar: string) {
  const { data: sales, error: salesError } = await supabaseAdmin
    .from("sales")
    .update({ avatar })
    .eq("user_id", user_id)
    .select("*");

  if (!sales?.length || salesError) {
    console.error("Error updating user:", salesError);
    throw salesError ?? new Error("Failed to update sale");
  }
  return sales.at(0);
}

async function inviteUser(req: Request, currentUserSale: any) {
  const { email, password, first_name, last_name, disabled, administrator } =
    await req.json();

  if (!currentUserSale.administrator) {
    return createErrorResponse(401, "Not Authorized");
  }

  const { data, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { first_name, last_name },
  });

  let user = data?.user;

  if (!user && userError?.code === "email_exists") {
    // This may happen if users cleared their database but not the users
    // We have to create the sale directly
    const { data, error } = await supabaseAdmin.rpc("get_user_id_by_email", {
      email,
    });

    if (!data || error) {
      console.error(
        `Error inviting user: error=${error ?? "could not fetch users for email"}`,
      );
      return createErrorResponse(500, "Internal Server Error");
    }

    user = data[0];
    try {
      const { data: existingSale, error: salesError } = await supabaseAdmin
        .from("sales")
        .select("*")
        .eq("user_id", user.id);
      if (salesError) {
        return createErrorResponse(salesError.status, salesError.message, {
          code: salesError.code,
        });
      }
      if (existingSale.length > 0) {
        // The user and their profile both exist — a previous invite attempt
        // failed at the email step. Re-adding them re-sends the invitation.
        const { error: emailError } =
          await supabaseAdmin.auth.admin.inviteUserByEmail(email);
        if (emailError) {
          console.error(`Error re-inviting existing user: ${emailError}`);
          return createErrorResponse(
            500,
            "User already exists but the invitation email failed again",
          );
        }
        return new Response(JSON.stringify({ data: existingSale[0] }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const sale = await createSale(user.id, {
        email,
        first_name,
        last_name,
        disabled,
        administrator,
      });

      // The auth user was created on a previous (failed) attempt and never
      // received its invitation — send it now so the flow can complete.
      const { error: emailError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(email);
      if (emailError) {
        console.error(`Error re-inviting existing user: ${emailError}`);
      }

      return new Response(
        JSON.stringify({
          data: sale,
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    } catch (error) {
      return createErrorResponse(
        (error as any).status ?? 500,
        (error as Error).message,
        {
          code: (error as any).code,
        },
      );
    }
  } else {
    if (userError) {
      console.error(`Error inviting user: user_error=${userError}`);
      return createErrorResponse(userError.status, userError.message, {
        code: userError.code,
      });
    }
    if (!data?.user) {
      console.error("Error inviting user: undefined user");
      return createErrorResponse(500, "Internal Server Error");
    }
    const { error: emailError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (emailError) {
      console.error(`Error inviting user, email_error=${emailError}`);
      return createErrorResponse(
        500,
        "User created but the invitation email failed — add them again with the same email to resend it",
      );
    }
  }

  try {
    await updateSaleDisabled(user.id, disabled);
    const sale = await updateSaleAdministrator(user.id, administrator);

    return new Response(
      JSON.stringify({
        data: sale,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (e) {
    console.error("Error patching sale:", e);
    return createErrorResponse(500, "Internal Server Error");
  }
}

/** Tables owning records via sales_id; reassigned to the requesting admin on delete. */
const SALES_OWNED_TABLES = [
  "contacts",
  "contact_notes",
  "companies",
  "deals",
  "deal_notes",
  "tasks",
];

async function deleteUser(req: Request, currentUserSale: any) {
  const { sales_id } = await req.json();

  if (!currentUserSale.administrator) {
    return createErrorResponse(401, "Not Authorized");
  }
  if (currentUserSale.id === sales_id) {
    return createErrorResponse(400, "You cannot delete your own account");
  }

  const { data: sale } = await supabaseAdmin
    .from("sales")
    .select("*")
    .eq("id", sales_id)
    .single();

  if (!sale) {
    return createErrorResponse(404, "Not Found");
  }

  if (sale.administrator) {
    const { count } = await supabaseAdmin
      .from("sales")
      .select("*", { count: "exact", head: true })
      .eq("administrator", true);
    if ((count ?? 0) <= 1) {
      return createErrorResponse(400, "Cannot delete the last administrator");
    }
  }

  for (const table of SALES_OWNED_TABLES) {
    const { error } = await supabaseAdmin
      .from(table)
      .update({ sales_id: currentUserSale.id })
      .eq("sales_id", sales_id);
    if (error) {
      console.error(`Error reassigning ${table}:`, error);
      return createErrorResponse(500, `Failed to reassign ${table}`);
    }
  }

  const { error: salesError } = await supabaseAdmin
    .from("sales")
    .delete()
    .eq("id", sales_id);
  if (salesError) {
    console.error("Error deleting sale:", salesError);
    return createErrorResponse(500, "Failed to delete the user");
  }

  if (sale.user_id) {
    const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(
      sale.user_id,
    );
    if (userError) {
      console.error("Error deleting auth user:", userError);
      return createErrorResponse(
        500,
        "User removed from CRM but the auth account could not be deleted",
      );
    }
  }

  return new Response(JSON.stringify({ data: { id: sales_id } }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function patchUser(req: Request, currentUserSale: any) {
  const {
    sales_id,
    email,
    first_name,
    last_name,
    avatar,
    administrator,
    disabled,
  } = await req.json();
  const { data: sale } = await supabaseAdmin
    .from("sales")
    .select("*")
    .eq("id", sales_id)
    .single();

  if (!sale) {
    return createErrorResponse(404, "Not Found");
  }

  // Users can only update their own profile unless they are an administrator
  if (!currentUserSale.administrator && currentUserSale.id !== sale.id) {
    return createErrorResponse(401, "Not Authorized");
  }

  // Never demote the last administrator — that would lock the CRM with no
  // recovery path short of a direct database edit.
  if (
    currentUserSale.administrator &&
    sale.administrator &&
    administrator === false
  ) {
    const { count } = await supabaseAdmin
      .from("sales")
      .select("*", { count: "exact", head: true })
      .eq("administrator", true);
    if ((count ?? 0) <= 1) {
      return createErrorResponse(400, "Cannot demote the last administrator");
    }
  }

  const { data, error: userError } =
    await supabaseAdmin.auth.admin.updateUserById(sale.user_id, {
      email,
      ban_duration: disabled ? "87600h" : "none",
      user_metadata: { first_name, last_name },
    });

  if (!data?.user || userError) {
    console.error("Error patching user:", userError);
    return createErrorResponse(500, "Internal Server Error");
  }

  if (avatar) {
    await updateSaleAvatar(data.user.id, avatar);
  }

  // Only administrators can update the administrator and disabled status
  if (!currentUserSale.administrator) {
    const { data: new_sale } = await supabaseAdmin
      .from("sales")
      .select("*")
      .eq("id", sales_id)
      .single();
    return new Response(
      JSON.stringify({
        data: new_sale,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }

  try {
    await updateSaleDisabled(data.user.id, disabled);
    const sale = await updateSaleAdministrator(data.user.id, administrator);
    return new Response(
      JSON.stringify({
        data: sale,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (e) {
    console.error("Error patching sale:", e);
    return createErrorResponse(500, "Internal Server Error");
  }
}

/**
 * Generates a one-click join link for a team member so an admin can deliver
 * it directly (WhatsApp/SMS) — independent of email deliverability. The link
 * lets the recipient set a password and land in the CRM. Admin-only.
 */
async function generateInviteLink(req: Request, currentUserSale: any) {
  if (!currentUserSale.administrator) {
    return createErrorResponse(401, "Not Authorized");
  }
  const { sales_id } = await req.json();
  const { data: sale } = await supabaseAdmin
    .from("sales")
    .select("*")
    .eq("id", sales_id)
    .single();
  if (!sale) {
    return createErrorResponse(404, "Not Found");
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://crm.akalds.com";
  // A recovery link works whether or not the account is already confirmed:
  // the recipient sets a password and is signed in. Redirect to the bare
  // origin — the app's index.html self-heal routes the recovery tokens to
  // the set-password page (a fragment in redirect_to would be stripped).
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: sale.email,
    options: { redirectTo: siteUrl },
  });

  if (error || !data?.properties?.action_link) {
    console.error("Error generating invite link:", error);
    return createErrorResponse(500, "Failed to generate the invite link");
  }

  return new Response(
    JSON.stringify({ data: { link: data.properties.action_link } }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
}

Deno.serve(async (req: Request) =>
  OptionsMiddleware(req, async (req) =>
    AuthMiddleware(req, async (req) =>
      UserMiddleware(req, async (req, user) => {
        const currentUserSale = await getUserSale(user);
        if (!currentUserSale) {
          return createErrorResponse(401, "Unauthorized");
        }

        if (req.method === "POST") {
          return inviteUser(req, currentUserSale);
        }

        if (req.method === "PATCH") {
          return patchUser(req, currentUserSale);
        }

        if (req.method === "PUT") {
          return generateInviteLink(req, currentUserSale);
        }

        if (req.method === "DELETE") {
          return deleteUser(req, currentUserSale);
        }

        return createErrorResponse(405, "Method Not Allowed");
      }),
    ),
  ),
);
