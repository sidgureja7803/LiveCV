import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Simplified config to avoid stack overflow issues

export default defineConfig({
  plugins: [react()],
  build: {
    // Disable minification to prevent stack issues during build
    minify: false,
    sourcemap: false,
    // Disable code splitting to prevent complex bundling that could lead to stack overflow
    rollupOptions: {
      output: {
        // Disable code splitting completely to avoid recursion
        manualChunks: undefined,
        // Prevent dynamic imports from being split into separate chunks
        inlineDynamicImports: true
      }
    },
    // Increase warning limit since we're not splitting chunks
    chunkSizeWarningLimit: 2000
  },
  optimizeDeps: {
    // Disable optimizations that might cause recursion
    force: true,
    entries: ['./src/main.tsx'],
    // Pre-bundle these problematic dependencies
    include: ['react', 'react-dom', 'react-router-dom', '@react-pdf/renderer', 'socket.io-client', 'pdfjs-dist']
  },
  worker: {
    format: 'es'
  }
})
