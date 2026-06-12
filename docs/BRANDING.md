# Branding + Theming Guide

This repo is set up so a designer/dev can rebrand it quickly without hunting
through dozens of files.

## Colors (palette tokens)

All core colors are CSS variables defined in:

- `src/app/globals.css`

The palette mirrors the main Tiesverse website (`tiesversewebsite.vercel.app`),
a light editorial system. Key tokens:

- `--paper` (#fffaf2) / `--cream` (#fff3e3): warm cream page surfaces
- `--ink` (#1d160d) / `--ink-muted`: warm near-black text colors
- `--accent` (#fe7a00) / `--accent-d` (#e56d00): Tiesverse orange and hover state
- `--rule` (#ecdfcd) / `--stroke-mid` / `--stroke-strong`: warm hairline borders
- `--radius` (4px): editorial button/card corner radius
- `--dark` / `--on-dark`: near-black bands with cream text (contrast sections)

Rule of thumb:

- Update variables, not individual components.
- Components should reference tokens (e.g. `var(--brand)`), not hard-coded hex.

## Typography (fonts)

Fonts are configured in:

- `src/app/layout.tsx`

This app uses (matching the main Tiesverse website):

- Body font: `Manrope` (variable `--font-body`)
- Display font: `Fraunces` serif, weight 400, letter-spacing -0.03em (variable `--font-display`)

To change typography:

1. Swap the `next/font/google` imports in `src/app/layout.tsx`
2. Keep the CSS variables (`--font-body`, `--font-display`) the same
3. Confirm headings (`.tv-display`) still look balanced after the change

## Logo / Wordmark

Header logo is a small React component:

- `src/components/TiesverseMark.tsx`

If you need the real brand logo:

- Replace `TiesverseMark` with an SVG (preferred) or `next/image`
- Keep it a single component so the rest of the layout stays unchanged

The header wrapper lives in:

- `src/components/SiteHeader.tsx`

## Layout + Component style

Most pages use the same set of building blocks:

- `tv-shell`, `tv-outer` (page framing)
- `tv-card`, `tv-card-muted` (surfaces)
- `tv-divider` (section separators)
- `tv-kicker`, `tv-display` (type rhythm)

Those utilities are defined in:

- `src/app/globals.css`

If you want to match a new design system:

- Start by adjusting the CSS tokens and these utility classes.
- Only then tweak individual components (cards, buttons, forms).

## Quick checklist (rebrand in ~15 minutes)

1. Update CSS variables in `src/app/globals.css`
2. Swap fonts in `src/app/layout.tsx` (optional)
3. Replace `src/components/TiesverseMark.tsx` with the official logo/wordmark
4. Verify:
   - Home (`/`)
   - Listing (`/discover`)
   - Event details (`/events/[slug]`)
   - Admin (`/admin`)

