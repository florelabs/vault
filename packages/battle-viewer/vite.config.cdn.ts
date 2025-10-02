import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BattleViewer",
      fileName: (format) => `battle-viewer.${format}.js`,
      formats: ["iife", "umd", "es"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    outDir: "dist/cdn",
    sourcemap: true,
    minify: false, // Disable minification to avoid terser dependency
  },
});
