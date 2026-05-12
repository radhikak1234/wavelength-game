import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(() => ({
  base: process.env.GITHUB_PAGES === "true" ? "/wavelength-game/" : "/",
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
}));
