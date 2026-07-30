# Quadra Audio Website

Next.js site for Quadra / Hydra — deployed on **Cloudflare Pages** (`quadra-audio`).

## Live

- Site: https://quadraaudio.com/ (data-driven Puck home)
- Editor: https://quadraaudio.com/editor/ (Google + Supabase allowlist)
- Preview host: https://quadra-audio.pages.dev/

## Visual Editor

Self-hosted [Puck](https://puckeditor.com). Sanity is not used.

### Access

1. Open `/editor/`
2. **Continuar com Google** (Google Identity Services — only method)
3. Email must exist in Supabase `editor_allowlist`

```sql
INSERT INTO editor_allowlist (email, note)
VALUES ('pessoa@empresa.com', 'Editor')
ON CONFLICT (email) DO UPDATE SET active = true;
```

### Subdomain `edit.quadraaudio.com`

1. Cloudflare Pages → project **quadra-audio** → Custom domains → add `edit.quadraaudio.com`
2. DNS CNAME: `edit` → `quadra-audio.pages.dev` (proxied)
3. Visiting `https://edit.quadraaudio.com/` redirects to `/editor/`

Optional Auth0 (not required for production Google login):

```bash
NEXT_PUBLIC_AUTH0_DOMAIN=
NEXT_PUBLIC_AUTH0_CLIENT_ID=
NEXT_PUBLIC_EDITOR_PUBLISH_SECRET=quadra-editor-change-me
```

### Getting Started

```bash
npm install
npm run dev
```
