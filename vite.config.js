import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Set VITE_BASE_PATH to /your-repository-name/ when deploying a GitHub Pages project site.
export default defineConfig({ base: process.env.VITE_BASE_PATH || '/', plugins: [react()] })
