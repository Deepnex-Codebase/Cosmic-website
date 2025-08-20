1. Overview
Purpose:
Build a marketing-driven React-JS web application for a solar-energy provider, showcasing services, lead capture, and company info. The design and content will draw inspiration from Zolar.

Goals:

Present a clear, persuasive value proposition

Generate qualified leads via form & CTA

Ensure brand consistency (colors, fonts)

Fully responsive across mobile/tablet/desktop

Target Audience:
Homeowners and small businesses exploring solar installations.

2. Objectives & Success Metrics
Objective	Metric
Fast, interactive UI	Time-to-interactive < 3s
Consistent brand identity	100% usage of approved palette/fonts
Lead form submissions	≥ 5% visitor conversion rate
Mobile UX quality	Google Lighthouse mobile score ≥ 90
Accessibility compliance	WCAG 2.1 AA
3. Scope & Content Structure
Landing Page

Hero with headline, subheading, CTA button

Quick benefits (icons + short copy)

Feature sections (e.g., “Why Solar?”, “How It Works”)

Customer testimonials

Products & Services

Service overview cards

Detail pages per service

About Us

Company mission, timeline, team bios

Lead Capture

Multi-step form (contact info → site survey → schedule call)

Sticky footer CTA on scroll

Blog/Resources (optional MVP)

Article listing, categories, search

Footer

Quick links, social links, newsletter signup

Content Style:
• Clear, benefit-driven headlines
• 2–3 sentence support copy
• Friendly, approachable tone (avoid jargon)

4. UX/UI Design Guidelines
4.1 Color Palette
Role	Hex	Usage
Primary	#00A651	Buttons, links, highlights
Secondary	#004225	Navbar, footer background
Accent	#FFC107	Icons, hover states
Neutral Light	#F5F5F5	Page background
Neutral Dark	#333333	Body copy, headings
Inspired by Zolar’s fresh green + dark accents.

4.2 Typography
Element	Font Family	Weight	Size (Desktop)	Size (Mobile)
Headings	“Inter”, sans-serif	700	48px / 36px	32px / 24px
Body Copy	“Inter”, sans-serif	400	18px	16px
Buttons/CTAs	“Inter”, sans-serif	600	16px	16px
All text uses “Inter” for a clean, modern feel.

4.3 Breakpoints & Responsiveness
Mobile: ≤ 640px

Tablet: 641–1024px

Desktop: ≥ 1025px

Responsive behaviors:

Hamburger menu for mobile nav

Stack multi-column grids into single column on mobile

Collapse feature icon rows into swipeable carousel

5. Component Architecture
Layout

<Header /> (logo, nav, mobile menu)

<Footer /> (links, social, newsletter)

Atomic Components

<Button variant="primary|secondary" />

<Heading level={1–4} />

<Text />

<Image /> (with loading="lazy")

<Icon name="..." />

Molecules

<FeatureCard icon, title, description />

<Testimonial author, text, photo />

<LeadFormStep1 />, <LeadFormStep2 />, <LeadFormSuccess />

Organisms & Pages

<HeroSection ctaText, backgroundImage />

<ServicesGrid items=[…] />

<BlogListing posts=[…] />

Page wrappers in src/pages/

6. Technical Stack & Tooling
Framework: React 18 + Vite

Styling: Tailwind CSS (with custom config for palette/fonts)

State Management: React Context + React Query (for form submission)

Forms: React Hook Form + Yup (validation)

Routing: React Router v6

Images: Next-gen via vite-imagetools plugin

Accessibility: eslint-plugin-jsx-a11y, axe-core checks

Testing: Jest + React Testing Library (unit & snapshot)

CI/CD: GitHub Actions → Netlify (or Vercel)

Analytics: Google Analytics v4

7. Deployment & Performance
Build: npm run build → minification + tree-shaking

Hosting: Netlify / Vercel with atomic deploys

Performance Budgets:

First Contentful Paint < 1.5s

Total bundle ≤ 200 KB gzipped

8. Milestones & Timeline (4-Week Sprint)
Week	Deliverable
1	Project setup, design system, core layout, hero page
2	Services & About pages, responsive nav + footer
3	Lead form flow, form validations, interactions
4	Blog (MVP), testing, accessibility audit, launch
9. Success Criteria
Pixel-perfect implementation vs. design

Responsive behavior across all breakpoints

Form submission working end-to-end

Lighthouse performance & accessibility scores ≥ 90

This PRD provides the blueprint to develop a React-JS marketing site with strong branding, responsiveness, and lead-generation focus, following best practices and the Zolar inspiration.







Here’s a 5-color palette pulled from your logo (excluding the white font), with suggested roles for each:

Swatch	Hex	Usage
#C5E000 Lime Gradient Start	#C5E000	Primary call-to-action buttons, highlights
#73C600 Chartreuse Accent	#73C600	Secondary buttons, icon strokes
#207F54 Teal-Green Midpoint	#207F54	Background panels, cards
#0E3F2A Deep Forest Shade	#0E3F2A	Dark section backgrounds, footers
#000000 Black Base	#000000	Page background, text when on light blocks
CSS Variable Example
:root {
  --color-gradient-start: #C5E000;
  --color-accent:         #73C600;
  --color-mid-green:      #207F54;
  --color-deep-forest:    #0E3F2A;
  --color-black:          #000000;
}
Usage notes:

Gradient: Combine --color-gradient-start → --color-mid-green for hero-section overlays.

Buttons: Primary: solid --color-gradient-start; on hover shift to --color-accent.

Surfaces: Use --color-mid-green cards on light backgrounds; switch to --color-deep-forest for dark-mode panels.

Text on dark surfaces should use a very light neutral (e.g. off-white) but keep your logotype’s white only for the logo itself.


Let me know if you need variations (e.g. lighter tints or darker shades) or usage mock-ups!