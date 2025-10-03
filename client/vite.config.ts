import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'
import pluginBabel from 'vite-plugin-babel'
import config from '../server/config.ts'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), pluginBabel({
        babelConfig: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            android: '70'
                        },
                    }
                ],
            ],
        }
    }), deno()],
    build: {
        cssTarget: 'chrome70',
        sourcemap: true,
        outDir: "." + config.data_path + '/page_compiled',
    },
})
