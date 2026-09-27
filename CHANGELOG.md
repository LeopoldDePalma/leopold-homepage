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
- English, Arabic and French versions of the site with right-to-left layout for Arabic and a
  language switcher. The locale stays out of the URL and is remembered in a cookie.
- Light "parchment" and dark "iron" themes with a gold accent: the system preference applies by
  default, an explicit choice is remembered in a cookie and rendered by the server.
- Typography: JetBrains Mono and EB Garamond for English, Noto Kufi Arabic and Amiri for Arabic.
- Site header with the imperial eagle logo, a link to the source code, language switcher and
  theme toggle; footer with copyright.
- Home page: typed greeting, profile header with photo, About, Passions and Get in touch
  sections.
- Links to GitHub, Telegram and Instagram profiles.
- Heraldry among the passions, linking out to WappenWiki.
- Bio section on the home page: a timeline from 1998 to the current job.
- Mail button in the Get in touch section: leans towards the pointer and opens the visitor's
  mail client.
- Now playing panel behind a header button: cover, track and artist for what is on Spotify,
  or the last thing played; the word "Music" in Passions opens the same panel.
- Error and "page not found" screens in the site's own layout, translated into every language.
  The 404 carries the arms of Swabia borne by the Hohenstaufen.
- Interactive 3D helmet with a grotesque visor (The Royal Armoury scan) on the home page. It
  loads after the page, shows a spinner meanwhile, turns and zooms, rests while it is off screen,
  and leaves vertical swipes to the page. Model credit in the footer.

### Changed

- Rebuilt the interface on Chakra UI in place of Tailwind CSS. The pages look the same; the music
  panel is now a Chakra popover that the header button and the word "Music" both open.
- Presented Konstantin as a software engineer and full-stack developer rather than a frontend
  developer, in the role, the greeting, the about text and the page description.

### Removed

- Legacy Vite + React Router + MUI client.

### Security

- Added a Content Security Policy with a fresh nonce on every request, so only the site's own
  scripts run and the page cannot be framed, and stopped browsers from sniffing file types.
