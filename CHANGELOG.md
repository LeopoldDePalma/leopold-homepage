# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Next.js 16 app (App Router, React 19, React Compiler) styled with Tailwind CSS v4.
- Strict TypeScript config, ESLint with type-checked rules, and Prettier with Tailwind class
  sorting.
- Vitest and Testing Library setup for unit tests.
- Pre-commit hook (Husky + lint-staged) and a GitHub Actions CI pipeline.
- English and Arabic versions of the site with right-to-left layout for Arabic and a language
  switcher; the locale stays out of the URL and is remembered in a cookie.
- Light "parchment" and dark "iron" themes with a gold accent: the system preference applies by
  default, an explicit choice is remembered in a cookie and rendered by the server.
- Typography: JetBrains Mono and EB Garamond for English, Noto Kufi Arabic and Amiri for Arabic.
- Site header with the imperial eagle logo, a link to the source code, language switcher and
  theme toggle; footer with copyright.
- Home page: typed greeting, profile header with photo, About, Passions and Get in touch
  sections.
- Links to GitHub, Telegram and Instagram profiles.
- Bio section on the home page: a timeline from 1998 to the current job.
- Mail button in the Get in touch section: leans towards the pointer and opens the visitor's
  mail client.
- Now playing section on the home page: the current Spotify track, or the last one played.
- Error and "page not found" screens in the site's own layout, with translations in both
  locales; the 404 carries the arms of Swabia borne by the Hohenstaufen.
- Interactive 3D helmet with a grotesque visor (The Royal Armoury scan) on the home page: loads
  after the page, shows a spinner meanwhile, rotates and zooms; model credit in the footer.

### Removed

- Legacy Vite + React Router + MUI client.
