# Woof & Wag

A production dog-care content platform for dog owners, built with Next.js, TypeScript, and Sanity CMS.

## Overview

Woof & Wag is a live content website publishing articles on dog health, training, and nutrition. Content is authored and managed in Sanity CMS, served through Next.js, and organized into categories with dedicated editorial, affiliate-disclosure, and contact pages.

## Features

- **Next.js 16** — App Router, React Server Components, and modern image handling
- **TypeScript** — type-safe application code end to end
- **Sanity CMS** — structured content model (`post`, `author`) with a Studio-based editing workflow
- **Articles & blog** — CMS-driven articles with slugs, read times, authors, and published dates
- **Categories** — Nutrition, Training & Behavior, and Health & Wellness
- **Static pages** — About, Contact, Editorial Policy, Affiliate Disclosure, Privacy, and Terms
- **Admin & import API** — an admin page plus an import route that ingests article HTML and assets from local folders into `public/images/`
- **SEO** — server-rendered metadata, Open Graph and Twitter cards, JSON-LD, `robots.txt`, and dynamic `sitemap.xml`
- **Affiliate disclosure** — impact.com site verification with a public affiliate-disclosure page

## Tech stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Framework | Next.js 16 (App Router)                 |
| Language  | TypeScript 5                            |
| CMS       | Sanity (`sanity`, `next-sanity`)        |
| Styling   | Tailwind CSS 4                          |
| 3D        | React Three Fiber / drei (mascot)       |
| Platform  | Deployed on Vercel at woofnwagg.com     |

## Quick start

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

To build and serve a production bundle:

```bash
npm run build
npm run start
```

Lint with:

```bash
npm run lint
```

Sanity is configured via environment variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

Copy these into a local `.env` file. The app also ships with a fallback dataset of posts so it renders without a configured CMS.

## Project structure

```
src/
  app/                 # App Router pages and API routes
    about/             # About page
    admin/             # CMS admin and article import UI
    affiliate-disclosure/
    api/
      import/          # POST route: import article HTML + images
      posts/           # GET route: JSON posts from Sanity
    articles/[slug]/   # Article detail pages
    contact/
    editorial-policy/
    privacy/
    terms/
    layout.tsx         # Root layout, metadata, JSON-LD
    robots.ts          # robots.txt
    sitemap.ts         # sitemap.xml
  components/          # Shared components (e.g. DogMascot)
  lib/                 # Sanity client, queries, fallback content
  sanity/
    schemas/           # Sanity content schemas (post, author)
    sanity.config.ts   # Sanity Studio configuration
public/
  assets/              # Brand images, hero video, fallbacks
  images/              # Imported article images
```

## Deployment

The site is built as a static-leaning Next.js application with runtime CMS fetching and is deployed on Vercel. Any Vercel-compatible host works:

1. Push the repository to your Git host and import it into Vercel.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in the project environment variables.
3. Deploy. `next build` runs automatically on the configured framework preset.

Images are served from the Sanity CDN (allowlisted in `next.config.ts`) plus local assets under `public/`.

## License

[MIT](./LICENSE)
