Master Prompt: Build “Jensy Jimenez” Personal Website (Next.js + Tailwind)

Role & POV
You are a senior front-end engineer and brand designer. Build a fast, accessible, modern personal website to market Jensy Jimenez for internships, roles, and consulting (data analytics, AI automation, product ops). Code quality, UX polish, and clear storytelling are top priorities.

Tech stack

Next.js 15 (App Router) + TypeScript

Tailwind CSS + CSS variables for theming

MDX for long-form content (Writing/Speaking pages)

Content layer: local JSON/MDX (no external CMS)

Vercel-ready (or Cloudflare Pages) with edge-friendly defaults

ESLint + Prettier; no TypeScript errors; zero console warnings

Information architecture (routes & sections)

/ Home (hero, value prop, core highlights, CTA)

/about Story, values, headshot, quick facts

/projects Cards for featured work (Bodega Project, BiteSites, OnScent dashboards—abstracted if needed)

/press Press & spotlights (Bergen Community College feature)

/speaking Talks, panels, advocacy; embed videos when available

/writing Articles/notes (MDX)

/resume Downloadable PDF(s) + HTML resume summary

/contact Simple form (POST to Formspree or static mailto), plus social links

Starter content (use verbatim titles/links; write tasteful 1–3 sentence summaries)

Press

Bergen Community College Spotlight (Feb 13, 2025): “Jensy Jimenez” – studying engineering; data analyst intern; Title V Peer Leader; advocacy and leadership highlights. URL: https://bergen.edu/posts/spotlight/jensy-jimenez/

Projects

Rutgers Newark Bodega Project – “Building a data-informed, hyperlocal supply chain linking farms to bodegas” (Program: June 30–July 24, 2025). URL: https://jjimenez723.github.io/Bodega-Project/

BiteSites – boutique web design studio (lead gen/contact). URL: https://bitesites.org/

OnScent (role highlight) – dashboards + automation that surfaced bottlenecks; Power Automate flows; live data insights (describe safely at a high level, no sensitive data).

Social

LinkedIn: https://www.linkedin.com/in/jensy-jimenez

Instagram: https://www.instagram.com/jensy_jimenez/

Docs

Resume PDF (link); Letter PDF (link). If private or sign-in gated, show a “Request Access” button with a short note.

https://drive.google.com/file/d/1bZcieLdSade3vL9hwJmCRbwznRNZDLza/view

https://drive.google.com/file/d/18VpCu_82mwLvJRqUC16T8irtDe5k-Wub/view

Brand voice & messaging

Clear, confident, service-oriented. Emphasize: data analytics, AI workflow automation, program leadership, and community impact.

Tagline ideas (pick one, keep it short):

“Data, design, and automation that move teams forward.”

“Where analytics meets impact.”

“Build systems. Ship insights. Empower people.”

Design system

Light/Dark themes; WCAG AA contrast; keyboard & screen-reader friendly.

Tailwind tokens via CSS variables: --bg, --fg, --muted, --brand, --brand-contrast with a subtle gradient for hero CTA.

Components: sticky header, responsive nav, hero with CTA, badge list for skills, card grid, timeline, testimonial block (optional), press list, MDX typography.

Provide 2 hero layout variants (split image/text and full-bleed headline) and 2 project card variants (image-top and icon-left).

SEO & sharing

Metadata: title, description, canonical, robots.

OpenGraph & Twitter images (auto-generated at build with a simple /api/og route).

Sitemap and RSS (for Writing).

JSON-LD for Person + Article/Project.

Performance & quality gates

Lighthouse (mobile) targets: Performance ≥ 95, Accessibility ≥ 100, Best Practices ≥ 100, SEO ≥ 100.

Image optimization with Next/Image; preload hero font; avoid layout shift.

No client libraries larger than necessary; tree-shake icons.

Add minimal unit tests for critical components (hero, project card, press list).

Content seeds (generate tasteful copy from these cues)

Summary: Jensy is a data-driven builder who ships dashboards, automation, and student programs; blends engineering study with community initiatives and real-world ops.

Highlights to weave in briefly (as appropriate):

Bergen Community College: engineering track; Title V Peer Leader; data analyst internship; advocacy work in Trenton; honors & clubs.

Bodega Project: student leadership; USDA/NIFA context; supply-chain KPIs; program timeline.

BiteSites: client-facing work; forms that convert; simple pricing CTA.

OnScent: analytics + Power Automate flows; bottleneck discovery; productivity impact (approximated safely).

Keep everything respectful and non-confidential.

Implement now

Scaffold project with Next.js 15 + TS + Tailwind.

Create /content with JSON/MDX seeds:

press.json (title, source, date, url, summary) – prefill with the Bergen spotlight.

projects.json (title, role, date, links[], summary, tags[]) – prefill Bodega Project and BiteSites; stub OnScent at a high level.

social.json (label, url) – LinkedIn, Instagram, Email.

about.mdx and writing/first-post.mdx – generate concise initial drafts.

Build components: Hero, StatBadges, ProjectCard, PressItem, ContactForm, Prose (MDX), ThemeToggle.

Add /api/og route for dynamic OG images.

Add /resume with an HTML digest, plus buttons to view/download PDFs (and a “request access” note if needed).

Add next-sitemap config, RSS generation, and JSON-LD.

Add a README.md with run/deploy steps (Vercel) and a quick content-editing guide.

Ship two hero variants and two card variants; wire a ?variant=2 URL param for quick preview.

Deliverables

Complete repository (all pages, components, and content seeds).

README.md with: pnpm i, pnpm dev, pnpm build, pnpm start and deploy notes.

A short “Brand Notes” file listing tokens, font stack, spacing scale, and how to add a new project/press item.

Lighthouse report notes and any tradeoffs.

Acceptance criteria (hard requirements)

Builds cleanly; no TS errors.

All routes render; no broken links.

Press page includes the Bergen spotlight entry with date and source.

Projects page includes Bodega Project and BiteSites cards with real links.

Contact has working approach (Formspree or mailto: fallback).

Meets or exceeds Lighthouse targets above.

Now generate the full codebase and content. Provide a single compressed output (repo tree), then print the repo structure and key files inline.