import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure Vite to properly handle video files
  assetsInclude: ["**/*.mp4"],
  // Serve static files from the project root
  publicDir: "./",
})
