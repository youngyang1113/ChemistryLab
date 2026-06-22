import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
