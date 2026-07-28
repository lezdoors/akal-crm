---
okf: 0.1
type: reference
title: Auth & transactional email
status: current
owner: any-agent
updated: 2026-06-28
resource: "Supabase Auth config + Resend SMTP (crm@akalds.com)"
tags: [auth, email, resend, supabase]
links: [deployment-and-money]
---

## Auth

- Supabase Auth. The **first signup became admin** (Ryan). Invite-only afterward.

## Auth emails go through custom SMTP — Resend

- Sender: `crm@akalds.com`, display name **"Maison Tanneurs CRM"**
  (configured 2026-06-12).
- Branded **French** templates (invite / recovery / confirmation) live in the
  Supabase auth config.

### Two failure modes already hit (do not regress)

1. Supabase's **built-in mailer only delivers to project team members** — it
   silently ate the first invite. Custom Resend SMTP is mandatory.
2. The email **rate limit was 2/h by default**, which silently ate invites.
   Raised to **100/h**.
