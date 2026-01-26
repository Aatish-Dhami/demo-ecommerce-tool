import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@flowtel/tracker': path.resolve(__dirname, '../tracker/src/index.ts'),
    },
  },
})
