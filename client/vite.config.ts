import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'
import config from '../server/config.ts'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), deno()],
    build: {
        sourcemap: true,
        outDir: "." + config.data_path + '/page_compiled',
    },
})
