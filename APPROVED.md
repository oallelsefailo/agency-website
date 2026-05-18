# Vysible Final Approval

## Status: Approved

The Vysible marketing site is approved for launch preparation. The build matches the product brief and design direction: dark-mode-first SaaS presentation, screenshot-led product proof, Magento/operator-specific copy, persistent demo conversion paths, accessible static HTML, custom CSS, and lightweight vanilla JavaScript. Agent 4 found no Critical or Major issues, and final inspection confirms the remaining items are deployment and content-finalization tasks rather than implementation blockers.

## Launch Checklist

### Domain Setup

- Confirm the production domain, expected here as `vysible.io`.
- Confirm whether `www.vysible.io` should redirect to the apex domain or remain canonical.
- Update canonical URLs and Open Graph URLs if the final domain differs from `https://vysible.io`.
- Confirm the live demo destination for `https://demo.vysible.io`.

### Cloudflare Pages Deployment

- Connect the GitHub repository to Cloudflare Pages.
- Use the static site defaults:
  - Build command: leave blank unless a later build step is added.
  - Build output directory: repository root.
- Confirm these routes render after deployment:
  - `/`
  - `/demo/`
  - `/pricing/`
  - `/contact/`
  - `/privacy/`
  - `/terms/`
- Confirm static assets resolve:
  - `/assets/css/styles.css`
  - `/assets/js/main.js`
  - `/screenshots/vysible-favicon.png`
  - `/screenshots/Executive-Overview-Dark.png`
  - `/screenshots/vysible.png`
  - `/screenshots/vysible-favicon.png`

### Contact Form Setup

- If deploying on Netlify, enable Netlify Forms and verify the `contact` form submission is captured.
- If deploying on Cloudflare Pages, configure one of:
  - Formspree endpoint and update the contact form `action`.
  - Cloudflare Workers / Pages Functions form handler.
  - Another static-compatible form processor.
- Submit a live test lead and confirm delivery to the operating inbox.
- Keep `vysiblesales@gmail.com` visible as the fallback contact address unless a new support/sales inbox replaces it.

### DNS And SSL

- Add Cloudflare DNS records for `vysible.io` and `www.vysible.io`.
- Add DNS for `demo.vysible.io` and point it at the live demo host.
- Enable Cloudflare-managed SSL/TLS.
- Verify HTTPS works for apex, `www`, and demo subdomain.
- Confirm any redirects preserve the intended canonical URL structure.

### Demo Subdomain Verification

- Confirm `https://demo.vysible.io` is live before public launch.
- Confirm the `/demo/` page CTA and fallback link open the correct demo experience.
- Verify the demo uses safe sample data if credentials are not configured.
- Confirm the demo has matching Vysible branding and does not expose admin-only configuration.

### Meta And Open Graph

- Verify each page title and description in production:
  - Home
  - Demo
  - Pricing
  - Contact
  - Privacy
  - Terms
- Confirm `og:image` resolves publicly at the production domain.
- Preview social cards in Slack, LinkedIn, and X/Twitter card tools.
- Replace the screenshot-based OG image with a dedicated social-share image if brand polish requires it.

### Analytics

- Add production analytics only after consent/privacy expectations are confirmed.
- Recommended minimum:
  - Page views.
  - Demo CTA clicks.
  - Contact CTA clicks.
  - Contact form submissions.
- Confirm analytics does not conflict with the Privacy Policy.
- Filter internal traffic where practical.

### Accessibility And Performance Smoke Checks

- Run a Lighthouse pass on the deployed site for Performance, Accessibility, Best Practices, and SEO.
- Confirm keyboard navigation reaches header links, theme toggle, CTA buttons, FAQ controls, and contact form fields.
- Confirm visible focus states in dark and light modes.
- Confirm mobile navigation opens, closes, and updates `aria-expanded`.
- Confirm reduced-motion settings do not depend on scroll animations to reveal content.
- Test at minimum widths around 390px, 768px, 1440px, and a wide desktop viewport.
- Confirm screenshot images load without layout shifts or broken paths.

## Remaining Placeholder Content Before Public Launch

- Replace visible legal placeholder language on `/privacy/` and `/terms/` with counsel-approved final copy.
- Confirm `vysiblesales@gmail.com` is the correct public sales and legal contact.
- Confirm `Southern California` is the correct governing-law language for the Terms of Service.
- Confirm AI model names, insight counts, review target counts, and package inclusions are commercially final.
- Confirm the demo endpoint `https://demo.vysible.io` is final.
- Configure the contact form endpoint for the chosen host; current markup is Netlify-compatible but Cloudflare Pages needs a handler or external form service.
- Replace example-use-case quotes with real testimonials or keep the current non-claim framing as example use cases.
