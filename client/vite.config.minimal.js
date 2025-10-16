// Minimal Vite configuration to bypass stack overflow issues
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Super minimal config with all optimizations disabled
export default defineConfig({
  plugins: [react()],
  build: {
    // Completely disable minification
    minify: false,
    // Disable source maps
    sourcemap: false,
    // Disable tree-shaking
    treeshake: false,
    // Use simpler output format
    target: 'es2015',
    // Basic rollup options with minimal processing
    rollupOptions: {
      output: {
        // Disable code splitting completely
        inlineDynamicImports: true,
        // Disable manualChunks
        manualChunks: undefined,
        // Disable hashing
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      },
      // Reduce plugin usage
      plugins: []
    },
    // Set high warning limits
    chunkSizeWarningLimit: 5000
  },
  // Disable dependency pre-bundling
  optimizeDeps: {
    disabled: true
  },
  // Increase esbuild limits
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  }
})
