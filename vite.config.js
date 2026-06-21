import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  resolve: {
    alias: {
      "hls.js": resolve(__dirname, "node_modules/hls.js/dist/hls.js"),
    },
  },
  optimizeDeps: {
    include: ["hls.js"],
    esbuildOptions: {
      resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
    },
  },
});
