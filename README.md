# Craft of Pink City

Static React/Vite/Tailwind one-page website for a Jaipur block-print textile brand.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Images and brand details

- The official logo is at `src/assets/logo.jpeg`; use it as-is.
- Replace product placeholders by adding images to `src/assets/products/` and updating `src/data/products.js`.
- Update Instagram in `src/data/products.js`.
- Update the phone number in `src/components/InstagramCTA.jsx` and `src/components/Footer.jsx`.

## GitHub Pages

The deployment workflow is at `.github/workflows/deploy.yml`. In GitHub, enable **Settings → Pages → Source: GitHub Actions**, then push to `main`. The workflow builds with `VITE_BASE_PATH=/<repository-name>/`, so assets work on a project page.

For a personal/organization site or a custom preview, build with `VITE_BASE_PATH=/ npm run build`.
