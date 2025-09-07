import path from 'node:path'
import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'

import config from '../server/config.ts'

// https://vite.dev/config/
export default defineConfig({
    plugins: [deno(), react()],
    build: {
        sourcemap: "inline",
        outDir: "." + config.data_path + '/page_compiled',
    },
})
