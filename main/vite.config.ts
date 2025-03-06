import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/jhulett18/InsuranceLeadGenerator-Demo.git', // Replace with your actual repository name
})