# SPOG Trailers website

Homepage built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Preview it

Double-click **Preview Site.command** (Mac) or **Preview Site.bat** (Windows). The first run installs dependencies, then your browser opens at http://localhost:4321. Edits show up live. Close the terminal window to stop.

On a Mac, if it says the file is from an unidentified developer, right-click it, choose Open, then Open again. You only have to do that once.

## Run it from a terminal

Requires Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the build
```

## Edit it

- Copy, specs and lists: `src/data/content.ts`
- Section layout and styling: `src/components/sections/`
- Colors, font and effects: `src/styles/global.css`
- Photos and logos: `public/images/`

See `CLAUDE.md` for brand rules, layout rules, known gotchas and the list of placeholder content to replace before launch.
