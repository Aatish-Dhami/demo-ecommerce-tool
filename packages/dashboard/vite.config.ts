import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  build: {
    commonjsOptions: {
      include: [/@flowtel\/shared/, /node_modules/]
    }
  },
  optimizeDeps: {
    include: ['@flowtel/shared']
  }
})
