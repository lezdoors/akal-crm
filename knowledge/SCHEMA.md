# OKF schema — Akal fleet convention

This repo's `knowledge/` tree uses the **Open Knowledge Format**: plain markdown
files with YAML frontmatter, linked into a graph. No tool, SDK, MCP, or skill is
required to read or write it — every agent (Claude, Codex, Hermes/Mouha) reads
markdown natively. [Graphify](https://) can index this tree for graph queries but
is optional.

## Frontmatter contract

Every file under `knowledge/` (except `README.md`) starts with:

```yaml
---
okf: 0.1                 # format version
type: reference          # concept | reference | decision | runbook | index
title: Short human title
status: current          # current | superseded | draft
owner: any-agent         # who may update this node (default: any-agent on its own project)
updated: 2026-06-28      # YYYY-MM-DD, bump on every edit
resource: ...            # optional: the canonical external source this node mirrors
                         #   (a DB project ref, URL, or a file like DESIGN.md)
tags: [crm, supabase]    # optional
links: [other-node-id]   # related nodes, by filename without .md
---
```

### type
- **concept** — a domain idea explained (what/why).
- **reference** — a node that *mirrors* an authoritative external `resource`
  (a live config, a DB, another file). Keep it a faithful summary; the
  `resource` wins on conflict.
- **decision** — a recorded choice + rationale (an ADR).
- **runbook** — a procedure to execute.
- **index** — a navigation node listing children.

### status
`current` is the default. When a node is replaced, set `status: superseded` and
add a `links` entry to the node that replaces it — never delete history silently.

### links
The graph lives in `links` and in inline `[text](../path.md)` references. Link
liberally; a link to a node that doesn't exist yet marks future work.

## Update protocol (this is the part that ends "ask me every time")

**As you work on this project, keep `knowledge/` current in the same change.**
- Touched architecture, auth, deployment, money handling, or a guardrail? Update
  the matching node and bump `updated`.
- Made a real decision (chose X over Y)? Add a `decision` node.
- Don't ask permission to update knowledge — it's reversible and version-controlled.
- One fact per node. If a node grows past a screen, split it and link.
- Faithfulness over completeness: a `reference` node must not drift from its
  `resource`. If you change the resource, change the node.
