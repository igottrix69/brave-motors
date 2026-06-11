# Brave Motors — Premium Vehicle Dealership Website

The official website for **Brave Motors**, the automotive division of **Brave Group (PNG) Ltd**, Papua New Guinea.

> Your trusted partner in Construction, Security & Automation.

## Pages

| Page | What it shows |
|---|---|
| Home | Auto-cycling hero image slider (6s, manual arrows), stats bar, featured vehicles, why-us, group banner, latest blog posts |
| Vehicles For Sale | Full stock list with category filters, detail pop-ups and enquiry buttons (prices POA) |
| Blog | News and buying guides with a built-in article reader |
| Brave Group Vision | Group vision statement and division pillars |
| About Us | Company story, value checklist, contact card |
| Contact Us | Enquiry form (name / email / message) that emails support@pngbravegroup.com |

## Admin backend (`/admin.html`)

Click **🔒 STAFF LOGIN** in the website footer. Default PIN: **0000** (changeable in Settings).

- **Dashboard** — stock, blog, message and visit stats at a glance
- **Hero Slider** — add / replace / reorder / delete the homepage hero images (recommended 1672 × 941 px)
- **Vehicles** — add / edit / delete listings, upload photos, set price, status & featured flag
- **Blog Posts** — write, edit and delete articles with cover images
- **Site Content** — edit the hero, stats bar, About page, Vision page and contact details
- **Messages** — contact-form enquiries received on this device, with reply-by-email
- **Settings** — change the PIN, export/import a full backup, factory reset

### How saving works

This is a static site: admin edits are stored in the **browser's localStorage** on the device where you make them. Visitors always see the built-in defaults unless they are viewing on the device/browser where edits were made. Use **Settings → Export Backup / Import Backup** to move edits between computers. (A future upgrade can move this to a real database.)

Contact-form messages are delivered to the support inbox by [FormSubmit](https://formsubmit.co) — the **first** submission triggers a one-time activation email to support@pngbravegroup.com that must be confirmed.

## Run locally

```bash
node serve.js
# → http://localhost:4321
```

## Contact

- 📧 support@pngbravegroup.com
- 📞 +675 7998 8842
