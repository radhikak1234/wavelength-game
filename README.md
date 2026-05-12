# Wavelength Game

This project keeps the original Wavelength game React code, but now runs on a fresh Vite + React + TypeScript setup so it works cleanly on modern Node without any `openssl-legacy-provider` workaround.

## Available Scripts

In the project directory, you can run:

### `npm start`

Starts the Vite dev server. Open the local URL shown in the terminal to play the game.

### `npm run build`

Builds the production app into `dist/`.

### `npm test`

Runs the Vitest test suite once.

### `npm run preview`

Serves the production build locally for a final check.

## Node Version

The repo includes an [.nvmrc](/Users/radhikakshirsagar/Projects/wavelength-game/.nvmrc) pinned to Node `24.15.0`, and [package.json](/Users/radhikakshirsagar/Projects/wavelength-game/package.json) expects Node `24.x`.

## Notes

- The React game components and assets were preserved.
- The old Create React App entrypoints and `react-scripts` setup were removed.
- GitHub Pages deploys now publish the Vite `dist/` output.
