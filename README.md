# Quadra Audio Website

Next.js site for Quadra / Hydra.

## Visual Editor (Wix-like)

Self-hosted open-source editor powered by [Puck](https://puckeditor.com) (`@puckeditor/core`).

### Use it

1. Sign in at `/login/` with an **admin** account (e.g. `samuel@quadraaudio.com` or any email containing `admin`).
2. Open `/editor/` — fullscreen visual canvas.
3. **Click text on the page** to edit inline (not only sidebar forms).
4. Drag blocks (Product Hero, Story Chapter, Feature Strip) from the left.
5. Hit **Publish** — saves to Supabase `site_pages` and updates the live home page.

Drafts also auto-save to `localStorage` on this device.

### Subdomain (recommended)

Point `edit.quadraaudio.com` → same static host, path `/editor/`, and put **Cloudflare Access** (or similar) in front of that hostname for an extra lock.

Optional env:

```bash
NEXT_PUBLIC_EDITOR_PUBLISH_SECRET=your-long-secret
```

Must match `site_editor_settings.publish_secret` in Supabase (default seed: `quadra-editor-change-me` — change it).

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
