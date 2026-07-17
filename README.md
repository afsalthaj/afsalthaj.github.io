# afsalthaj.github.io

Personal site and blog, built with [Astro](https://astro.build).

## Develop with Nix

This repo is Nix-managed. If you have [Nix](https://nixos.org/download/) installed (with flakes enabled), clone and go:

```bash
git clone https://github.com/afsalthaj/afsalthaj.github.io.git
cd afsalthaj.github.io
nix develop          # or: nix develop -c zsh
npm install
npm run dev          # http://localhost:4321
```

`flake.nix` is the dependency list — Node/npm for this project. No separate “install Node 22, then npm, then hope versions match” dance.

Without Nix, install a recent Node (`>=22.12`) yourself, then run the same `npm` commands.

| Command | Action |
| --- | --- |
| `npm install` | Install JS dependencies |
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `./dist/` |
| `npm run preview` | Preview the production build |

More on why this setup: [Nix Is Simpler With AI — The Bare Minimum You Shouldn't Skip](https://afsalthaj.github.io/blog/ai-made-nix-simple-the-bare-minimum/).

## Credit

Theme based on the Astro blog starter / [Bear Blog](https://github.com/HermanMartinus/bearblog/).
