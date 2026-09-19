# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Next.js 16 app (App Router, React 19, React Compiler) styled with Tailwind CSS v4.
- Strict TypeScript config, ESLint with type-checked rules, and Prettier with Tailwind class sorting.
- Vitest and Testing Library setup for unit tests.
- Pre-commit hook (Husky + lint-staged) and a GitHub Actions CI pipeline.
- English and Arabic versions of the site with right-to-left layout for Arabic and a language switcher.
- Light "parchment" and dark "iron" themes with a gold accent, following the system preference, and a theme toggle.
- Typography: JetBrains Mono and EB Garamond for English, Noto Kufi Arabic and Amiri for Arabic.
- Site header with the imperial eagle logo, a link to the source code, language switcher and theme toggle; footer with copyright.
- Home page: typed greeting, profile header with photo, About, I ♥ and On the web sections.

### Removed

- Legacy Vite + React Router + MUI client.
