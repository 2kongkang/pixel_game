import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 需要正確的 Base URL
  base: process.env.BASE_PATH || '/',
})
