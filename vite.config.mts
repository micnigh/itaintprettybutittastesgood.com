import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ViteImageOptimizer({
    /* pass your config */
    png: {
      // https://sharp.pixelplumbing.com/api-output#png
      quality: 100,
    },
    jpeg: {
      // https://sharp.pixelplumbing.com/api-output#jpeg
      quality: 100,
    },
    jpg: {
      // https://sharp.pixelplumbing.com/api-output#jpeg
      quality: 100,
    },
    tiff: {
      // https://sharp.pixelplumbing.com/api-output#tiff
      quality: 100,
    },
    gif: {},
    webp: {
      // https://sharp.pixelplumbing.com/api-output#webp
      lossless: true,
    },
    avif: {
      // https://sharp.pixelplumbing.com/api-output#avif
      lossless: true,
    },
    cache: true,
    cacheLocation: '.tmp/cache/vite-image-optimizer',
    includePublic: true,
  })],
})
