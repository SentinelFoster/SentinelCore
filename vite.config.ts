
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './client/src/components'),
      '@/lib': path.resolve(__dirname, './client/src/lib'),
      '@/hooks': path.resolve(__dirname, './client/src/hooks'),
      '@/pages': path.resolve(__dirname, './client/src/pages'),
      '@/core': path.resolve(__dirname, './'),
      '@/server': path.resolve(__dirname, './server'),
    },
  },
})
