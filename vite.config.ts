import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  
  return {
    plugins: [react()],
    
    build: {
      minify: isDev ? false : 'esbuild',
      rollupOptions: {
        output: {
          format: 'es',
          manualChunks: undefined,
        },
      },
    },
    
    esbuild: {
      keepNames: isDev,
      minifyIdentifiers: !isDev,
      minifySyntax: !isDev,
    },
    
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      '__DEV__': JSON.stringify(isDev),
    },
    
    resolve: {
      alias: {
        '@': '/src',
      }
    },
    
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  }
})
