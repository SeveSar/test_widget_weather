import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('widget-weather')
        }
      }
    })
  ],
  base: '/test_widget_weather/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    lib: {
      entry: './src/main.ce.ts',
      // formats: ['es', 'cjs'],
      name: 'widget-weather',
      // the proper extensions will be added
      fileName: 'widget-weather'
    }
    // target: 'esnext'
  },
  define: {
    'process.env': process.env
  }
})
