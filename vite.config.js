import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Relative asset URLs work both on the GitHub project URL and on the custom domain.
export default defineConfig({ base: process.env.VITE_BASE_PATH || './', plugins: [react()] })
