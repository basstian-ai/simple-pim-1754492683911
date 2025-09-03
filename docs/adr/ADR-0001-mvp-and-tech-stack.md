# ADR 0001 — MVP scope and tech-stack for Recipe Finder

Status: accepted

Date: 2025-09-03

Authors: Project team

Context

The project goal is to deliver a small, polished Recipe Finder web app (MVP) that: lets users search recipes from a public API, view details (ingredients, instructions, images), and save favorites locally. The app should load quickly, work well on mobile and desktop, and be straightforward to build and deploy (preferably to Vercel).

Constraints and considerations:

- Minimal engineering effort for v1 while producing a usable, pleasant product.
- Use a public recipes API with no mandatory authentication to avoid backend complexity.
- Favor managed hosting and frameworks that speed up developer iteration (routing, image optimization, deployments).
- Keep stateful persistence simple for MVP (no server-side DB required).

Decision

We choose the following stack and approach for the MVP:

1) Framework: Next.js (React)

- Rationale: Next.js provides file-based routing, hybrid rendering (SSG/SSR), good defaults for performance, built-in image optimization (next/image), and first-class deployment to Vercel. This accelerates development and keeps deployment simple.

2) Data source: TheMealDB (https://www.themealdb.com)

- Rationale: Public, free API that returns full recipe details (ingredients, instructions, images, optional YouTube links) and supports searching by name/ingredient/category. No authentication required for the MVP.

3) Rendering strategy: hybrid with on-demand static generation

- Homepage / Search: render client-side for interactive search; optionally pre-render popular/trending recipes for fast first paint using getStaticProps.
- Recipe detail pages: generate on-demand (getStaticPaths with fallback: 'blocking' or on-demand ISR) so pages are cached after first request without pre-building the entire dataset.

Rationale: This hybrid approach balances fast initial loads for common pages with practical build times (we cannot pre-build all recipes). It also leverages Next.js caching and image optimizations.

4) Favorites / Persistence: localStorage on the client

- Rationale: Keeps MVP simple (no backend or auth). Users can save favorites locally to the browser; later we can add cloud sync or optional auth.

5) Styling: simple, maintainable CSS using component-scoped CSS Modules (with an option to adopt Tailwind later)

- Rationale: CSS Modules keep dependencies minimal and provide scoping to avoid global style conflicts. If the project grows, Tailwind can be introduced with minimal disruption.

6) Images and media

- Use next/image for recipes to get optimized loading and automatic responsive images.
- Lazy-load non-critical media and YouTube embeds.

7) Deployment: Vercel for hosting

- Rationale: Direct integration with Next.js, simple CI/CD, and global edge network for fast delivery.

8) Accessibility and performance

- Use semantic HTML, keyboard-accessible components, and sensible color contrast.
- Prioritize fast first contentful paint (FCP) and Lighthouse score by following Next.js performance best practices.

Consequences

Positive:

- Fast development and deployment using Next.js and Vercel.
- No backend required for MVP, reducing scope and complexity.
- On-demand SSG reduces build time while still providing cached, performant recipe pages.
- Local favorites give immediate value with minimal engineering overhead.

Negative / Trade-offs:

- Favorites are tied to a single browser/device (no cross-device sync) until a backend or auth is added.
- Relying on a public third-party API means availability and rate-limits are out of our control; we should handle errors gracefully and consider caching or a small proxy only if necessary.
- Deciding on CSS Modules now may require migration effort if/design system switches to a different styling approach later.

Operational notes / follow-ups:

- Implement client-side caching for search results to improve UX and reduce redundant API calls.
- Add error and rate-limit handling for TheMealDB responses, with friendly UI messaging.
- Consider an ADR for "When to introduce a backend / user accounts" if we add sync or server-side features.
- When traffic or API limitations become an issue, evaluate a lightweight serverless proxy/cache layer.

References

- TheMealDB API: https://www.themealdb.com
- Next.js documentation: https://nextjs.org/docs

Related ADRs

- (none yet)
