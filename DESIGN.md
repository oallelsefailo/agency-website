# Vysible Site Design Direction

## Design North Star

Vysible should feel like a focused command center for ecommerce operators: dark, precise, quietly premium, and grounded in the real dashboard. The site should borrow the polish and pacing of Linear, Vercel, Raycast, and Clerk, but avoid their generic startup gloss. Every visual choice should reinforce three ideas:

- Vysible connects GA4, Search Console, and Magento order data into one operating view.
- Agencies can show it instantly in demo mode, then brand and configure it for clients.
- The product does not just report numbers; it identifies executive briefs and priority review targets.

The visual system should be screenshot-led, with abstract geometry used only as atmospheric support. No stock people, no mascot illustrations, no generic "growth" imagery.

## Color Palette

Use CSS custom properties so dark and light mode share one token system. Dark mode is the default.

### Dark Mode Tokens

```css
:root {
  color-scheme: dark;
  --bg: #05070c;
  --bg-elevated: #090d16;
  --bg-panel: #0d1320;
  --bg-glass: rgba(13, 19, 32, 0.68);
  --border: rgba(148, 163, 184, 0.18);
  --border-strong: rgba(203, 213, 225, 0.28);
  --text: #f8fafc;
  --text-muted: #a8b3c7;
  --text-soft: #737f93;
  --brand: #73e6c4;
  --brand-strong: #26d7a2;
  --brand-ink: #03251d;
  --violet: #8b7cf6;
  --blue: #5aa7ff;
  --amber: #f6bd4f;
  --danger: #ff6b7a;
  --success: #5ee0a0;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.48);
  --glow-brand: 0 0 44px rgba(115, 230, 196, 0.26);
  --glow-violet: 0 0 54px rgba(139, 124, 246, 0.2);
}
```

### Light Mode Tokens

```css
[data-theme="light"] {
  color-scheme: light;
  --bg: #f7f9fc;
  --bg-elevated: #ffffff;
  --bg-panel: #eef3f8;
  --bg-glass: rgba(255, 255, 255, 0.76);
  --border: rgba(15, 23, 42, 0.12);
  --border-strong: rgba(15, 23, 42, 0.2);
  --text: #07111f;
  --text-muted: #465367;
  --text-soft: #6b7586;
  --brand: #0d9f7a;
  --brand-strong: #087b60;
  --brand-ink: #e7fff8;
  --violet: #6254d9;
  --blue: #246dd9;
  --amber: #b57208;
  --danger: #c9344a;
  --success: #0b8f5f;
  --shadow: 0 22px 64px rgba(15, 23, 42, 0.14);
  --glow-brand: 0 0 34px rgba(13, 159, 122, 0.18);
  --glow-violet: 0 0 34px rgba(98, 84, 217, 0.12);
}
```

### Usage Rules

- Primary CTA: brand gradient from `#73e6c4` to `#5aa7ff` in dark mode; solid `#07111f` text on the gradient.
- Secondary CTA: translucent panel with border and subtle hover lift.
- Recommended tier: use brand border, thin glow, and a small "Recommended for retained service" label.
- Warning/attention UI motifs: amber for review targets, not red. Red should be reserved for errors only.
- Avoid a one-note teal or purple page. Teal is the conversion and source-connection color; violet/blue support AI and Search Console moments; amber marks review priority.

## Typography

Use system fonts for performance and crisp SaaS rendering:

```css
--font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

If Agent 3 chooses to load a font, use `Inter` via a self-hosted or privacy-respecting source. Do not add a heavy font stack.

### Type Scale

- Display: `clamp(3.2rem, 8vw, 7.4rem)`, line-height `0.92`, weight `720`, letter-spacing `0`.
- H1 legal/simple pages: `clamp(2.5rem, 6vw, 5rem)`, line-height `1`.
- H2: `clamp(2rem, 4vw, 3.8rem)`, line-height `1.04`, weight `680`.
- H3/card title: `1.125rem` to `1.35rem`, line-height `1.2`, weight `650`.
- Body large: `1.125rem`, line-height `1.7`.
- Body: `1rem`, line-height `1.65`.
- Small/meta: `0.82rem`, line-height `1.4`, uppercase optional for source labels only, letter-spacing `0.08em`.
- Code/data chips: mono, `0.78rem` to `0.9rem`.

Do not scale type with viewport width except via clamp for major headings. Letter spacing should be `0` for normal text.

## Spacing And Layout

Use an 8px spacing system:

```css
--space-1: 0.25rem;  /* 4 */
--space-2: 0.5rem;   /* 8 */
--space-3: 0.75rem;  /* 12 */
--space-4: 1rem;     /* 16 */
--space-5: 1.5rem;   /* 24 */
--space-6: 2rem;     /* 32 */
--space-7: 3rem;     /* 48 */
--space-8: 4rem;     /* 64 */
--space-9: 6rem;     /* 96 */
--space-10: 8rem;    /* 128 */
```

Layout tokens:

- Page max width: `1180px`.
- Wide visual max width: `1320px`.
- Section padding desktop: `96px 24px`; compact sections: `72px 24px`.
- Section padding mobile: `64px 20px`.
- Grid gap: `24px` desktop, `16px` mobile.
- Card radius: `8px` for cards; `14px` only for browser mockup shells and modals.
- Button height: `44px` normal, `52px` hero.
- Sticky nav height: `72px` desktop, `64px` mobile.

Prefer full-width bands with constrained inner content. Do not place page sections inside large floating cards. Cards are for repeated features, testimonials, pricing tiers, and contact form panels.

## Visual System

### Background

Use a layered dark canvas:

- Base `--bg`.
- Subtle radial glow behind hero screenshot: teal from upper right, violet from lower left, both low opacity.
- Thin grid overlay using CSS linear gradients at 48px intervals, opacity below `0.08`.
- Optional slow-moving particle field built with CSS pseudo-elements or a lightweight canvas only if it stays under 2KB JS. Static gradient mesh is acceptable.

### Product Screenshot Treatment

Screenshots must sit in CSS browser chrome:

- Outer `.browser-frame`: background `#070a12`, border `1px solid var(--border)`, radius `14px`, box shadow `var(--shadow)`.
- Top bar height `34px`, three dots: red `#ff5f57`, amber `#febc2e`, green `#28c840`.
- Address pill copy examples: `demo.vysible.io/client/overview`, `review-targets`, `executive-brief`.
- Image fills width, `display: block`, `loading="lazy"` except hero image.
- Hero uses `screenshots/Executive-Overview-Dark.png` in dark mode and `screenshots/Exec-Overview-Light.png` in light mode.
- Use `Executive-Brief-AI-light.png`, `Priority-Targets-AI-light.png`, `SEO-Performance-Scatter-Graph-light.png`, and the Merchandising Graph screenshots as the primary feature proof screenshots.
- Keep secondary screenshots available for later product-detail pages, but do not crowd the landing page with small unreadable image collages.

### Abstract Motifs

Use small source/status motifs instead of decorative blobs:

- Source nodes: GA4, Search Console, Magento, AI Brief as connected capsules.
- Thin connector lines using gradients and dashed borders.
- Review target chips: `Low CTR`, `Revenue movement`, `Category drift`, `Source fresh`.
- Metric sparks: tiny bars and trend lines in CSS, not complex SVG illustrations.

## Component Inventory

### Global

- Sticky header with blur backdrop, logo left, nav links right, theme toggle, and persistent "See Demo" CTA.
- Mobile hamburger opens a full-height dark glass menu with large tap targets and the same persistent demo CTA.
- Footer with logo, one-line tagline, page links, legal links, contact email, and copyright.
- Theme toggle with accessible label, persisted in `localStorage`.
- Skip link for accessibility.

### Conversion

- Primary gradient CTA: "See Demo".
- Secondary CTA: "Contact Us" or "Talk through a rollout".
- CTA band with product screenshot fragment or source-node rail.
- Contact form with Netlify Forms support and accessible labels.

### Content

- Eyebrow/source badge.
- Section header pair: concise headline plus operational subcopy.
- Feature card with small icon/source chip, headline, description, optional metric chip.
- Product proof split: copy column plus browser frame.
- Three-step process cards: numbered `01`, `02`, `03` with connector line.
- Pricing card with price, audience statement, feature list, CTA.
- Comparison table with sticky first column on mobile if practical; otherwise stacked feature rows.
- Testimonial card with role-specific quote and metadata.
- Legal content layout with side index on desktop and readable max width.

### Icon Direction

No icon dependency is required. Use compact inline SVG or CSS icons with a consistent 20px stroke aesthetic:

- Unified data: three connected nodes.
- AI brief: document with sparkle/star.
- Review targets: target ring or queue marker.
- Search Console: magnifier over line chart.
- Magento revenue: stacked boxes or cart/order line.
- White-label: layered badge or storefront panel.

## Page Architecture And Wireframes

## `/` Landing Page

### 1. Header

Sticky, transparent at top, solid glass after scroll. Logo text "Vysible" with a small signal-mark made of three connected points. Links: Product, How it works, Pricing, Contact. Right side: theme toggle, "See Demo" CTA.

### 2. Hero

Full viewport minus nav, with next section peeking at bottom on desktop and mobile. Left/center content max width around `920px`.

Suggested copy:

- Eyebrow: "White-label analytics for Magento 2 operators"
- H1: "The retained-service dashboard your Magento clients can actually use."
- Subheadline: "Vysible turns GA4 traffic, Search Console visibility, and Magento order data into one branded executive view, with AI briefs and priority review targets built in."
- CTAs: "See Demo" and "Contact Us"
- Supporting proof row: "Demo mode available now", "GA4 + GSC + Magento", "White-label hosted delivery"

Hero visual: centered browser mockup with `Executive-Overview-Dark.png` in dark mode and `Exec-Overview-Light.png` in light mode. On desktop, screenshot can overlap lower hero edge. On mobile, keep it straight and below copy with no overflow clipping.

Animation: headline words reveal in staggered opacity/translate; screenshot fades and rises after CTAs; source nodes gently pulse.

### 3. Source Signal Strip

Four connected capsules: GA4 traffic, Search Console SEO, Magento orders, AI executive brief. This should look like a live data route, not a logo wall.

### 4. Product Proof

Three scroll-reveal rows:

- Executive overview: `Executive-Overview-Dark.png` / `Exec-Overview-Light.png`; copy about source freshness, revenue, acquisition, and review cadence.
- AI executive brief: `Executive-Brief-AI-light.png`; copy about evidence-backed notes and next review prompts.
- Priority review targets: `Priority-Targets-AI-light.png`; copy about turning data into an action queue.

Alternate row alignment desktop; stacked mobile. Each row includes one or two concrete metric chips.

### 5. Feature Grid

Six cards:

- Unified executive view: "GA4, Search Console, and Magento order movement in one executive workspace."
- AI operating briefs: "Source-grounded summaries for weekly readouts and leadership updates."
- Priority review targets: "Pages, products, and categories surfaced because they deserve a decision."
- Search visibility intelligence: "Low-CTR pages, query movement, and SEO opportunity next to revenue context."
- Merchandising movement: "Order-line revenue, category performance, and product movement without BI sprawl."
- Demo-to-live white label: "Show a real walkthrough first; configure client branding and live sources when ready."

### 6. How It Works

Three steps in a horizontal rail:

1. Connect sources: GA4, Search Console, Magento.
2. Configure the workspace: client name, brand, dashboard mode, review preferences.
3. Go live: hosted dashboard, executive briefs, recurring review targets.

Use a connector line with subtle animated progress on reveal.

### 7. SEO Performance Band

Use one large, readable browser-frame screenshot:

- Main: `SEO-Performance-Scatter-Graph-light.png`

This section should focus on Search Console performance and low-CTR page review. Keep the image large enough to read.

### 8. Social Proof

Three placeholder quotes, written as real operator feedback:

- Agency owner: "The demo gives us a concrete analytics product to sell before onboarding gets messy."
- Ecommerce lead: "The weekly review starts with the targets now, not twenty tabs of reports."
- SEO consultant: "Search Console data finally sits next to revenue, so low CTR pages get prioritized correctly."

Label clearly as "Example use cases" or omit company names to avoid fake logos.

### 9. Pricing Preview

Three tier cards: Starter, Growth, Agency. Highlight Growth.

- Starter: `$499/mo`, one dashboard, demo + one live client, monthly executive brief.
- Growth: `$899/mo`, recommended, live source configuration, weekly briefs, priority targets, white-label branding.
- Agency: `Custom`, multiple dashboards, rollout support, custom packaging, priority support.

CTA: "View Pricing" and persistent "See Demo".

### 10. Final CTA

Headline: "Give your team a dashboard before the next reporting cycle."
Subcopy: "Open the demo now, then talk through the live-data path when the fit is clear."
CTAs: "See Demo", "Contact Us".

## `/demo`

Purpose: route to the live demo subdomain while reinforcing zero-credential demo mode.

Wireframe:

- Header.
- Centered hero panel, not overly large.
- Eyebrow: "Demo mode"
- H1: "Open the Vysible walkthrough with no credentials."
- Body: explain the demo uses sample ecommerce data and the same dashboard shell used for client workspaces.
- Primary CTA: "Launch Demo" linking to the live demo subdomain. Use `https://demo.vysible.io` as the implementation placeholder unless the final URL is known.
- Secondary CTA: "Talk through a client rollout".
- Optional auto-redirect after 3 seconds only if accessible and easy to cancel. If used, include visible fallback link.
- Small browser frame with the refreshed executive overview screenshot.

Meta description should mention "demo mode with sample Magento ecommerce analytics data."

## `/pricing`

Purpose: clarify monthly retainer packaging and implementation expectations.

Wireframe:

- Header.
- Pricing hero: "Pricing for agency-led Magento analytics delivery."
- Subcopy: "Start with a demo-ready operating view. Move to branded live dashboards when the client is ready."
- Pricing cards: Starter, Growth, Agency.
- Feature comparison table:
  - Demo mode
  - Hosted dashboard
  - GA4 connection
  - Search Console connection
  - Magento order data
  - AI executive briefs
  - Priority review targets
  - White-label branding
  - Dashboard count
  - Support level
- Retainer note band: "Pricing assumes standard Magento 2 access and source availability. Complex data cleanup or custom reporting can be scoped separately."
- FAQ accordion:
  - "Can agencies resell this under their own brand?"
  - "Can we show the demo before credentials?"
  - "Who owns the data?"
  - "Do you replace GA4 or Magento reports?"
- Final CTA.

Use Growth as the visual anchor, but keep Agency credible rather than vague.

## `/contact`

Purpose: qualify agency and merchant leads.

Wireframe:

- Header.
- Split layout: left copy, right form.
- H1: "Talk through a Vysible rollout."
- Subcopy: "Tell us whether this is for your own Magento store or an agency package. We will respond with the fastest path to a demo or live workspace."
- Ideal-fit bullets:
  - Magento 2 merchant or agency portfolio.
  - Needs executive reporting across GA4, Search Console, and revenue.
  - Wants a hosted white-label dashboard instead of a custom reporting build.
- Form fields:
  - Name
  - Email
  - Company
  - Website
  - Role: Agency, Merchant, Consultant, Other
  - Monthly order volume: Under 500, 500-2,500, 2,500-10,000, 10,000+
  - Interested tier: Starter, Growth, Agency, Not sure
  - Message
- Use Netlify Forms by default because static hosting on Cloudflare Pages may still post to third-party form handlers. If Formspree is used, keep action configurable.
- Success state: inline confirmation section.

Include visible email fallback: `vysiblesales@gmail.com`.

## `/privacy`

Purpose: readable trust page, not legal theater.

Wireframe:

- Header.
- Legal hero with H1 "Privacy Policy" and updated date.
- Content max width `760px`, side table of contents desktop.
- Sections:
  - Overview
  - Data we collect
  - How we use data
  - Google, OpenAI, and service providers
  - Data retention and deletion
  - Security
  - Client data ownership
  - Contact
- Use the required placeholder details: Vysible and `vysiblesales@gmail.com`.

## `/terms`

Purpose: set expectations for service, payment, data ownership, liability.

Wireframe:

- Header.
- Legal hero with H1 "Terms of Service" and updated date.
- Content max width `760px`, side table of contents desktop.
- Sections:
  - Service description
  - Accounts and access
  - Payment terms
  - Cancellation
  - Client data ownership
  - Acceptable use
  - Third-party services
  - Limitation of liability
  - Governing law: Southern California
  - Contact
- Use the required placeholder details: Vysible and `vysiblesales@gmail.com`.

## Motion And Interaction

Use only CSS transitions/animations and Intersection Observer.

### Scroll Reveals

- Add `.reveal` elements with initial `opacity: 0; transform: translateY(22px); filter: blur(8px);`.
- When `.is-visible`, transition to opacity 1, transform 0, blur 0 over `700ms` with `cubic-bezier(.2,.8,.2,1)`.
- Use small stagger delays for feature cards: `60ms` increments, max `240ms`.
- Respect `prefers-reduced-motion: reduce` by disabling transforms, blur, and animated backgrounds.

### Header

- Add `.is-scrolled` after 12px scroll. Increase background opacity and border visibility.
- Mobile menu should animate opacity/translate only.

### Hero

- Headline line reveal on load with CSS keyframes.
- Background grid can drift slightly with `transform` over 18s, but disable for reduced motion.
- CTA hover: translateY(-1px), brighter border/glow. Active state returns to neutral.

### Browser Frames

- On reveal, frame rises and image subtly scales from `1.015` to `1`.
- Hover on desktop: frame translateY(-4px), border stronger, glow slightly larger.
- Do not animate screenshot internals.

### Pricing And Forms

- Pricing cards: hover border and tiny lift. Recommended tier has a static glow, not constant pulsing.
- Form inputs: border color and soft outer ring on focus. Focus states must be visible in both themes.

## Accessibility Requirements

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`.
- One H1 per page.
- Alt text must describe screenshot context, e.g. "Vysible executive overview dashboard showing GA4, Search Console, and Magento revenue metrics."
- Links and buttons need visible focus states using `outline: 2px solid var(--brand)`.
- Mobile nav button needs `aria-expanded`.
- Theme toggle needs an accessible label and state.
- Contact form labels must be visible or at least programmatically associated; visible labels are preferred.
- Do not rely on color alone for pricing/feature status. Use text labels or icons with `aria-hidden`.
- Minimum tap target: 44px.
- Ensure legal pages retain high contrast and comfortable line length.

## Copy Tone Guidance

Write like a technical founder talking to operators who run Magento businesses and client retainers.

Use:

- "review targets"
- "source-grounded"
- "order-line revenue"
- "low-CTR collection pages"
- "demo mode before credentials"
- "hosted white-label workspace"
- "weekly executive readout"
- "retained analytics service"

Avoid:

- "boost your growth"
- "unlock insights"
- "supercharge your analytics"
- "data-driven decisions" without context
- "all-in-one platform" unless followed by the actual sources
- Fake enterprise logos or unverifiable customer claims

Preferred sentence shape: short, specific, operational.

Examples:

- "Show the dashboard before the client has created a single credential."
- "Put Search Console opportunity next to revenue movement, not in a separate meeting."
- "Use AI briefs to start the weekly review with evidence and next targets."
- "Package analytics as a monthly service instead of a one-off reporting project."

## Implementation Handoff Notes

- Static HTML/CSS/vanilla JS is enough. No React, Tailwind, Bootstrap, or heavy animation library.
- Suggested file structure: `index.html`, `pricing/index.html`, `contact/index.html`, `privacy/index.html`, `terms/index.html`, `demo/index.html`, `assets/css/styles.css`, `assets/js/main.js`.
- Use screenshots directly from `screenshots/`. If creating social share artwork, use `Executive-Overview-Dark.png` as the visual basis.
- Every page needs title, description, canonical path if domain is known, and `og:image`. Use one shared OG asset or `screenshots/Executive-Overview-Dark.png` as the temporary image.
- Keep JS responsible only for theme persistence, mobile nav, scroll reveals, header scroll state, FAQ accordion, and optional demo redirect.
- Optimize image markup: explicit width/height from inventory, `loading="lazy"` below hero, and `decoding="async"`.
