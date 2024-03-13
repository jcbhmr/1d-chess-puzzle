import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import node4web from "vite-plugin-node4web"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), node4web()],
})
