# Vysible Project Decisions

## Agent 1 - Project Analyst

### Decision: Position Vysible As An Agency-Ready Operating View

Vysible should lead with the agency/white-label business model, not only the analytics feature set. The strongest buyer pain is repeatable delivery: agencies need something they can demo instantly, brand for clients, and sell as a monthly retained service. This makes "hosted white-label operating dashboard" more commercially useful than a generic "analytics dashboard" label.

### Decision: Make The Executive Overview The Primary Visual Anchor

`screenshots/Executive-Overview-Dark.png` should be the main dark-mode hero screenshot because it communicates the full product in one frame: source availability, revenue and acquisition metrics, merchandising signal, attention queue, and charts. `screenshots/Exec-Overview-Light.png` is used as the light-mode counterpart.

### Decision: Treat AI Briefs And Priority Targets As The Core Differentiator

The dashboard's highest-leverage story is not that it displays data, but that it turns source-grounded data into review prompts. The Executive Brief and Priority Review Targets screenshots should be elevated early on the landing page because they show why Vysible is more useful than GA4, Search Console, or Magento reports viewed separately.

### Decision: Use Operator-Specific Copy

Marketing copy should avoid generic growth language. The target audience knows ecommerce operations, so copy should mention low-CTR collection pages, order-line revenue, category movement, demo mode, source freshness, client walkthroughs, and retained-service packaging. This will make the site feel written by someone who has actually run ecommerce reviews.

### Decision: Use Screenshot-Led Credibility Instead Of Stock Imagery

The site should rely on product screenshots, browser mockups, abstract geometric accents, and source/status UI motifs. No stock people imagery is needed, and it would weaken the technical/operator tone.

### Decision: Recommend A Compact Multi-Page Static Site

The required pages should remain focused: landing page for conversion, demo page for routing, pricing page for package clarity, contact page for qualified leads, and legal pages for baseline trust. This keeps the site lightweight while still giving agencies and merchants enough information to take the next step.

### Decision: Make Demo Mode A Persistent Conversion Hook

The "See Demo" CTA should be prominent on every page because demo mode is a major adoption advantage. It answers the practical objection that analytics products usually require credentials and setup before they can be evaluated.

## Agent 2 - UI/UX Designer

### Decision: Use A Dark Command-Center Visual System

The site should default to a deep dark interface with glass panels, thin borders, source-node motifs, and restrained teal/blue/violet accents. This fits the product screenshots, signals technical quality, and makes Vysible feel like an operating layer rather than a generic agency landing page.

### Decision: Make Screenshots The Primary Brand Asset

The actual dashboard screenshots should carry the site. `Executive-Overview-Dark.png` and `Exec-Overview-Light.png` anchor the hero, while the refreshed Executive Brief, Priority Targets, SEO Performance, and Merchandising screenshots create the primary proof grid. Abstract geometry should support the product proof, not replace it.

### Decision: Treat Demo Mode As A Product Feature, Not A Utility Link

The demo CTA should stay visible in the header and recur in hero, pricing, demo, and final CTA sections. The demo page should explicitly explain that no credentials are required, because this is a major agency sales advantage.

### Decision: Design Around Operator Workflows

The page architecture prioritizes weekly executive readouts, source freshness, low-CTR pages, category movement, and retained-service packaging. This keeps the tone specific to Magento ecommerce operators and avoids generic SaaS claims.

### Decision: Keep The System Practical For Static Custom CSS

The design spec uses CSS custom properties, a small 8px spacing system, browser-frame screenshot components, Intersection Observer reveals, and vanilla JS interactions. No Tailwind, Bootstrap, React, or heavy animation dependency is needed to achieve the intended polish.

### Decision: Support Light Mode Without Making It The Brand Default

Dark mode remains the primary commercial expression because it matches the strongest product screenshot and premium SaaS references. Light mode receives complete tokens for accessibility and preference support, but the hero and visual hierarchy should still be designed dark-first.

## Agent 3 - Frontend Engineer

### Decision: Build As Dependency-Free Static HTML, CSS, And Vanilla JS

The marketing site is implemented without React, Bootstrap, Tailwind, or animation libraries. The required interaction layer is small enough for vanilla JavaScript: theme persistence, mobile navigation, sticky header state, scroll reveals, and FAQ disclosure behavior.

### Decision: Keep Screenshots As The Primary Product Proof

The landing page uses the refreshed product screenshots throughout browser-frame components: `Executive-Overview-Dark.png` / `Exec-Overview-Light.png` in the hero, `Executive-Brief-AI-light.png`, `Priority-Targets-AI-light.png`, `SEO-Performance-Scatter-Graph-light.png`, and `Merchandising-Graph-Dark.png` / `Merchandising-Graph-light.png` in a compact proof grid. Abstract styling is limited to grid, glow, source rails, and small status chips.

### Decision: Use Root-Relative Site Links And Page-Relative Assets

Navigation uses root-relative URLs such as `/demo/` and `/pricing/` to match production static hosting. CSS and JavaScript are loaded page-relative so nested pages can resolve shared assets correctly during local and deployed testing.

### Decision: Make Demo Access Prominent Without Auto-Redirecting

The demo CTA appears in the global navigation, hero, pricing, footer, and final CTA areas. The `/demo` page links clearly to `https://demo.vysible.io` with fallback copy instead of forcing an automatic redirect, preserving user control and accessibility.

### Decision: Use Netlify-Compatible Contact Markup

The contact page uses `data-netlify="true"`, a hidden `form-name`, and a honeypot field so the static site can support Netlify Forms without backend code. A visible `vysiblesales@gmail.com` fallback remains available for non-Netlify deployments such as Cloudflare Pages.

### Decision: Tighten The Hero Around Immediate Product Visibility

The first visual QA pass showed the original landing headline pushed the product screenshot below the first viewport. The hero copy and responsive type scale were tightened so the dashboard frame is visible on desktop and mobile without diluting the operator-focused message.

### Decision: Add A Lightweight SVG Favicon

A small inline SVG favicon based on the Vysible source-node mark was added to avoid default missing-icon requests and give deployed browser tabs a finished brand detail without introducing image dependencies.

## Agent 4 - UI/UX Reviewer

### Decision: Approve The Build For Final Review With Only Minor Launch Notes

The completed static site matches the brief and design direction closely enough to move to Agent 5. The review found no Critical or Major issues across visual consistency, responsive behavior, screenshot usage, copy quality, accessibility basics, metadata, and demo CTA prominence. Remaining notes are launch-readiness items: replace visible placeholder legal wording before public use if desired, and configure the contact form processor for the chosen host.

## Agent 5 - Final Approver

### Decision: Approve For Launch Preparation

The site is approved. Final review of `BRIEF.md`, `DESIGN.md`, `REVIEW.md`, `DECISIONS.md`, and the built static pages confirms that the implementation satisfies the required Vysible positioning, page set, screenshot-led visual direction, dark-mode-first design, demo CTA prominence, metadata coverage, contact form baseline, legal placeholder coverage, and lightweight static implementation constraints. Remaining work is launch operations: configure deployment, DNS, SSL, demo subdomain, form handling, analytics, and replace legal/contact placeholders with final business-approved details.

## Post-Approval Edits

### Decision: Improve Readability And Buyer-Facing Copy

After review feedback, the site was adjusted to use a compact screenshot proof grid instead of sequential large-image/text blocks, strengthen feature icon visibility, improve the dark-mode Review Queue chip contrast, remove "BI project" jargon, and rewrite the How It Works section so Vysible performs the setup as the sold service.

### Decision: Change Pricing To AI Model And Output Volume

Pricing cards and the pricing comparison table now use the requested service structure: Starter at `$149/mo` or `$1,490/yr` with `gpt-4.1-mini`, 6 insights, and 6 targets; Growth at `$299/mo` or `$2,990/yr` with `gpt-4.1-mini`, 9 insights, and 9 targets; Agency at `$499/mo` or `$4,990/yr` with `gpt-4.1`, 12 insights, and 12 targets. The breakdown also includes AI calls/hour per IP, cache TTL, sources, white-label availability, and support level.
