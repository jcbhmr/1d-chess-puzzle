import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url"
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH,
  plugins: [react(), VitePWA({ registerType: 'autoUpdate' })],
  // https://ui.shadcn.com/docs/installation/vite#update-viteconfigts
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
