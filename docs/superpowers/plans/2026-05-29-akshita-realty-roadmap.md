# Akshita Realty — Implementation Roadmap

Spec: [`../specs/2026-05-29-akshita-realty-design.md`](../specs/2026-05-29-akshita-realty-design.md)

The build is decomposed into five sequential plans. Each delivers working, testable software
on its own and builds on the previous. Plans 2–5 are authored when their predecessor completes,
so they reflect what was actually built.

| # | Plan | Outcome | Status |
|---|------|---------|--------|
| 1 | **Foundation** | Deployable themed Next.js app, Supabase wired, full DB schema + RLS, auth (Google + email/pw), roles, base layout/nav/footer, core utils | Plan written |
| 2 | **Catalog & Detail** | Property data layer, catalog (filters + 3 segments), property & premium-project detail, locality pages, map embeds, favorites, seed data | Pending |
| 3 | **Resell, Dashboard & Admin** | Sell wizard + moderation queue, user dashboard, full admin panel, leads + multi-channel delivery (email/WhatsApp/webhook) | Pending |
| 4 | **AI Suite** | Conversational search, concierge chatbot, auto listing writer, recommendations (pgvector), valuation, locality insights, EMI advisor | Pending |
| 5 | **Insights/Blog & SEO polish** | Blog (admin-managed, AI-assisted), sitemap, structured data, metadata, performance pass | Pending |

## Conventions applied across all plans
- **Docs first:** Next.js, Supabase, and Vercel AI SDK APIs change often. Every implementing
  agent MUST consult the current official docs before writing framework code; do not rely on
  memorized APIs. Volatile spots are flagged in each task.
- **TDD where it pays:** pure functions (formatting, parsing, EMI math, filter mapping) and
  authorization (RLS) get real tests first. UI/scaffolding is verified via type-check, build,
  lint, and explicit manual checks.
- **Frequent commits:** one commit per completed task (or per red→green→refactor cycle).
- **DRY / YAGNI:** v1 non-goals from the spec (phone OTP, map-pin search, payments) stay out.
