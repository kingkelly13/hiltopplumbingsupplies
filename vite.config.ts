import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Every page is static, so the build writes plain HTML that any host can serve.
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, failOnError: true },
    }),
    viteReact(),
  ],
})
