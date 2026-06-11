#!/usr/bin/env bash
# Production deploy for crm.akalds.com — run ONLY on Ryan's "ship it".
# Bakes live Supabase env into the static build, restores the Vercel
# project link that `vite build` wipes from dist/, deploys to akal-crm.
set -euo pipefail
cd "$(dirname "$0")/.."

REF=xbtabpurfavngwmwtawc
TOKEN=$(head -1 ~/.clawdbot/supabase-access-token | tr -d '[:space:]')
ANON=$(curl -s "https://api.supabase.com/v1/projects/$REF/api-keys" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import json,sys;ks=json.load(sys.stdin);print(next(k['api_key'] for k in ks if k['name']=='anon'))")

NODE_ENV=production \
VITE_SUPABASE_URL="https://$REF.supabase.co" \
VITE_SB_PUBLISHABLE_KEY="$ANON" \
VITE_ATTACHMENTS_BUCKET=attachments \
VITE_IS_DEMO=false \
npm run build

rm -rf dist/.vercel && cp -R .vercel dist/.vercel
cd dist && npx vercel deploy --prod --yes
