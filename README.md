# Swal Sone Service website

A responsive static website for GitHub Pages, with individual event registration profiles for:
- Road Run Marathon
- Fun Run
- Trail Running (includes ITRA-ID)
- Triathlon
- Duathlon
- Music Events

Also includes service marketing pages for race timing software services and finance/accounting software.

## Publish on GitHub Pages

1. Create a new GitHub repository (for example `swal-sone-service`).
2. Upload **all files in this folder** to the repository root. Keep the filenames and folder structure unchanged.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Add your custom domain `swal-sone-service.com` in the Pages custom domain field.
7. Configure DNS at your domain provider as GitHub Pages instructs. Add the `CNAME` file below if desired.

## Important: registration and payment limitations

This is a **front-end demo**, not a production ticketing platform:
- Registration records are stored in `localStorage` in the current browser only.
- The records do **not** synchronize between participants, organizers, computers, or phones.
- CSV export exports the current browser's locally saved demo records.
- Registration IDs are convenient lookup keys, **not secure authentication**. Anyone using the same browser profile can access its local entries.
- Payment is **not connected**. The confirmation step saves a demo record only and does not charge a card, accept a transfer, or issue a paid ticket.
- Do not collect real NRC/passport numbers, medical details, or other sensitive participant information using this demo.

## Before using for real events

Connect a backend/database and authenticated organizer dashboard (for example Supabase/Firebase plus server-side access rules), add server-side validation and backups, and integrate a supported payment provider/manual payment-verification workflow. Add privacy notice, retention policy, organizer permissions, and audit logs. Never put secret API keys in client-side GitHub Pages code.

## Customize

- Edit event fields in each HTML profile.
- Edit design tokens and responsive styling in `styles.css`.
- `app.js` controls the mobile menu and footer year.
- `register.js` contains demo localStorage, editing, and CSV export logic.
- Replace `hello@swal-sone-service.com` with your real contact address.
- Google Fonts is used for typography; the site still renders with fallback fonts if unavailable.
