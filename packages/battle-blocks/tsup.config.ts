import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  dts: true,
  clean: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022",
  treeshake: true,
  minify: false,
  splitting: false,
  bundle: true,
  external: ["blockly"],
});
