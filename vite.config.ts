import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build:   { commonjsOptions: { include: ["*"] }, outDir: ".bundle/dist" },
  plugins: [commonjs(), react()],
  server:  { hmr: { overlay: false }, proxy: { "/api": { target: "http://localhost:3001/" } } }
});
