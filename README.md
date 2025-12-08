# typst-renderer

A small Vite + React TypeScript app that demonstrates rendering Typst documents in the browser using WebAssembly and accompanying helper libraries. The project bundles a Typst web compiler and assets under `public/wasm` and `public/fonts` so rendering works client-side.

**Features**
- **In-browser Typst rendering:** Uses a WebAssembly-based Typst compiler to render in the browser.
- **Vite + React + TypeScript:** Fast dev server and modern frontend toolchain.
- **Bundled assets:** Fonts and WASM are included in `public/` for offline/local use.

**Quick Start**

Prerequisites:
- Node.js 18+ and `npm` (or a compatible package manager).

Clone and install:

```bash
git clone <repo-url>
cd typst-renderer
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the codebase:

```bash
npm run lint
```

**NPM Scripts**
- `dev`: Starts the Vite development server.
- `build`: Runs TypeScript build (`tsc -b`) and then `vite build` to produce a production bundle.
- `preview`: Serves the production build locally using `vite preview`.
- `lint`: Runs `eslint` on the repository.

**Project Structure (important paths)**
- `src/` : Application source code (`App.tsx`, `main.tsx`, styles).
- `public/wasm/` : WebAssembly binaries used by the Typst web compiler.
- `public/fonts/` : Font files used by the renderer.
- `index.html` : Vite entry HTML.
- `package.json` : Scripts and dependencies.

**Dependencies & Tooling**
- The project depends on packages from the `@myriaddreamin` org (e.g. `@myriaddreamin/typst-ts-web-compiler`) to provide Typst compilation in the browser.
- Uses `vite` (overridden to `rolldown-vite`), React 19, TypeScript, and Tailwind-related packages.

**Deployment**
Build the app (`npm run build`) and deploy the resulting `dist/` folder to any static hosting provider (GitHub Pages, Netlify, Vercel, S3, etc.). Ensure that the contents of `public/wasm` and `public/fonts` are preserved by your hosting configuration.

**Notes & Troubleshooting**
- If you change or add fonts, place them under `public/fonts/` and reference them in your CSS.
- If there are issues loading WASM assets in production, confirm the assets are present in `dist/wasm` after `npm run build` and that the server serves them with correct MIME types.
- The `package.json` currently overrides `vite` to `rolldown-vite@7.2.5` via `overrides`.

**Credits / Attribution**
- The WebAssembly binaries and related tooling used to render Typst documents in-browser are provided by the `typst.ts` project (Myriad-Dreamin). These WASM assets were not created in this repository. See: https://github.com/Myriad-Dreamin/typst.ts
- If you reuse or redistribute the WASM binaries, please follow the licensing and attribution terms of the upstream `typst.ts` project.

**Contributing**
- Open issues or pull requests if you find bugs or want to add features. Keep changes focused and include minimal reproducible examples for rendering problems.

**License**
- No license is specified in `package.json`. Check repository owner or add a `LICENSE` file if you intend to publish with an open-source license.
