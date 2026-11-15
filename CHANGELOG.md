# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The music panel's status reads in sentence case instead of spaced capitals, and the greeting's
  caret goes away once the line is typed instead of blinking for ever.

## [1.1.0] - 2026-11-15

### Added

- A jousting mini-game on the 404 page: a knight on horseback leaps over barrels, stakes and
  caltrops. It follows the theme, mirrors in Arabic and keeps the best score in the browser.
- The sword on the 404 page's home button tilts on hover, like the eagle in the logo.
- A GitHub section on the home page shows the year's contributions as a grid of gold lozenges;
  phones show the last six months.
- Links to the site unfurl with a preview card: the name and role in EB Garamond beside the
  Swabian arms, in the dark theme's colours.

### Changed

- “Get in touch” opens with a line of invitation and shows LinkedIn and GitHub buttons that follow
  the pointer like the email button, now labelled “Email Me”, instead of the list of profiles; the
  Telegram and Instagram links are gone.
- The credit for the Swabian arms moved from the 404 page to the footer, since the preview card
  shows the arms too.

### Fixed

- Switching the language no longer pushes the page to one side or leaves new styles blocked by the
  Content-Security-Policy.
- The chosen language is remembered after the browser is closed, as the theme already was.
- The eagle in the logo tilts smoothly on hover instead of jumping.
- The 404 page is rendered on the server, so it no longer stays blank until JavaScript loads.
- The credits name the helmet's scanner and link each author of the Swabian arms, and the README
  marks the CC-licensed files, the logo and the photo as exceptions to MIT.
- The music panel says when it could not refresh the track, instead of showing an old one as
  current.
- The emblem on the 404 page keeps its real proportions, so the page no longer shifts as it loads.
- Paragraphs get the roomier line spacing they were meant to have; the value never reached the page.
- The Heraldry and Music links stay legible in the dark theme, the GitHub button keeps a visible
  edge there, the 404's credits are no longer faded below a readable contrast, and a heading that
  wraps no longer sets its lines on top of each other.

## [1.0.0] - 2026-09-28

### Added

- Next.js 16 app (App Router, React 19, React Compiler) with Chakra UI v3, deployed on Vercel.
- Strict TypeScript config, ESLint with type-checked rules, and Prettier.
- Vitest and Testing Library setup for unit tests.
- Pre-commit hook (Husky + lint-staged) and a GitHub Actions CI pipeline.
- English, Arabic and French versions of the site with right-to-left layout for Arabic and a
  language switcher. The locale stays out of the URL and is remembered in a cookie.
- Light "parchment" and dark "iron" themes with a gold accent: the system preference applies by
  default, an explicit choice is remembered in a cookie and rendered by the server.
- Typography: JetBrains Mono and EB Garamond for English, Noto Kufi Arabic and Amiri for Arabic.
- Site header with the imperial eagle logo, a link to the source code, language switcher and
  theme toggle; footer with copyright.
- Home page: typed greeting, a profile header with the role "Software Engineer & Full Stack
  Developer" and a portrait in a gilt bezel, About, Passions and Get in touch sections.
- Links to GitHub, Telegram and Instagram profiles.
- Heraldry among the passions, linking out to WappenWiki.
- Bio section on the home page: a timeline from 1998 to the current job.
- Mail button in the Get in touch section: leans towards the pointer and opens the visitor's
  mail client.
- Now playing popover behind a header button: cover, track and artist for what is on Spotify,
  or the last thing played; the word "Music" in Passions opens the same panel.
- Error and "page not found" screens in the site's own layout, translated into every language.
  The 404 carries the arms of Swabia borne by the Hohenstaufen.
- Interactive 3D helmet with a grotesque visor (The Royal Armoury scan) on the home page. It
  loads after the page, shows a spinner meanwhile, turns and zooms, rests while it is off screen,
  and leaves vertical swipes to the page. Model credit in the footer.

### Removed

- Legacy Vite + React Router + MUI client.

### Security

- Added a Content Security Policy with a fresh nonce on every request, so only the site's own
  scripts run and the page cannot be framed, and stopped browsers from sniffing file types.

[Unreleased]: https://github.com/LeopoldDePalma/leopold-homepage/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/LeopoldDePalma/leopold-homepage/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/LeopoldDePalma/leopold-homepage/releases/tag/v1.0.0
