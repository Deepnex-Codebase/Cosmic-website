PRD — Full-Page “Scroll-Snap” Experience
(for existing MERN + Tailwind website)

1. Purpose & Vision
Give visitors an immersive, distraction-free way to consume key content blocks—each section fills the entire viewport and “snaps” cleanly while scrolling, recreating the smooth storytelling feel of the Webflow demo. The effect must be native-CSS, lightweight (≤ 5 KB extra), and accessible on all modern devices.

2. Goals & Success Metrics
Goal	KPI / Target
Reduce bounce on landing flow	-20 % within 30 days after launch
Increase average time-on-page	+15 %
Maintain Lighthouse performance	Performance ≥ 90, CLS ≤ 0.05
Zero accessibility regressions	AXE Core score 100%

3. Stakeholders
Product: Deepnex (owner)

Frontend dev: React/Tailwind squad

Design: UI / Motion designer

QA: Test engineer

Ops: DevOps for CI/CD checks

4. User Stories
Visitor / Desktop

When I scroll with my mouse/trackpad

Then the page locks to the next full-screen section smoothly.

Visitor / Mobile

When I swipe up/down

Then each panel snaps; overscroll bounce does not reveal half panels.

Visitor / Keyboard

When I press Page Down / Arrow keys / Space

Then focus jumps exactly one section and keeps visible heading in viewport.

Visitor / Reduced-motion

When my OS has “reduce motion” enabled

Then snapping is instant (no smooth behavior).

SEO Bot

When crawling HTML

Then all content is present in DOM (no JS-render requirement).

5. Functional Requirements
#	Requirement	Priority
F-1	Root wrapper exposes scroll-snap-type: y mandatory.	Must
F-2	Each content panel (section) is height: 100vh & scroll-snap-align: start.	Must
F-3	Global html or wrapper has scroll-behavior: smooth (except prefers-reduced-motion).	Must
F-4	Tailwind utilities added via tailwind-scroll-snap plugin OR custom plugin extension.	Must
F-5	JS helper throttles wheel events to prevent rubber-band multi-scroll (configurable delay).	Should
F-6	Scroll indicator dots (optional) with active state binding to IntersectionObserver.	Could
F-7	Graceful degradation → if CSS Snap unsupported, site behaves like normal vertical scroll.	Must
F-8	Sections accept dynamic height ≥ 100 vh content; internal overflow auto-scroll allowed.	Should
F-9	Fixed navbar (if present) compensates first panel with scroll-margin-top.	Must
F-10	Unit & E2E tests cover keyboard navigation, mobile swipe, and focus order.	Must

6. Non-Functional Requirements
Performance: Bundle increase ≤ 5 KB gzip.

Compatibility: Chrome 90+, Safari 14+, Firefox 88+, iOS 14+, Android 10+.

Accessibility: WCAG 2.2 AA; ARIA landmarks per section; reduced-motion compliance.

Security: No new third-party remote scripts; plugin is build-time only.

Internationalisation: No hard-coded text inside component.

