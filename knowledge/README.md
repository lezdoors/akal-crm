# knowledge/ — Akal CRM knowledge tree (OKF)

Canonical, vendor-neutral project knowledge in **[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md)**:
plain markdown + YAML frontmatter, linked into a graph. **Every agent reads this
first** — Claude, Codex, and Hermes/Mouha alike. No skill, MCP, or install needed
to read or write it (markdown is the lowest common denominator). Graphify can
index it for graph queries, but that's optional.

## ⚠️ Update protocol — read this

**As you work this project, keep these nodes current in the same change.** This
is what removes the need for Ryan to ask each agent to update docs by hand.

- Changed architecture / auth / deployment / money / a guardrail → update the
  matching node, bump `updated:`.
- Made a real decision (chose X over Y) → add a `decision` node.
- Don't ask permission to update `knowledge/` — it's reversible and in git.

Full contract: **[SCHEMA.md](./SCHEMA.md)**.

## Map

| Node | What |
|------|------|
| [architecture/backend-and-storefront-boundary](./architecture/backend-and-storefront-boundary.md) | Shared Supabase backend; storefront is read-only; what it owns |
| [architecture/fulfillment-ownership](./architecture/fulfillment-ownership.md) | What the CRM owns; order immutability; private attachments |
| [architecture/auth-and-email](./architecture/auth-and-email.md) | Supabase Auth + Resend SMTP; the two invite-eating gotchas |
| [architecture/deployment-and-money](./architecture/deployment-and-money.md) | `ship.sh`, hash routing, currency handling |
| [design/le-registre](./design/le-registre.md) | Design invariants (mirrors `DESIGN.md`) |
| [operations/guardrails](./operations/guardrails.md) | The hard "do not" list |

## Relationship to the old docs

- **`CLAUDE.md` / `AGENTS.md`** are now thin entry pointers into this tree.
- **`DESIGN.md`** stays the canonical design source; `design/le-registre.md`
  mirrors its invariants for quick reference.
- **`CHANGELOG.md`** stays the user-facing French release log — unchanged.
