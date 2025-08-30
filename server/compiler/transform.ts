import babel from '@babel/core'
import fs from 'node:fs/promises'
import io from './io.js'

async function compileJs(path: string) {
    const result = await babel.transformFileAsync(path, {
        presets: [
            [
                "@babel/preset-env", {
                    modules: false,
                },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
        ],
        targets: {
            chrome: "53",
            android: "40",
        },
        sourceMaps: true,
    })
    await fs.writeFile(path, result.code + '\n' + `//@ sourceMappingURL=${io.getName(path)}.map`)
    await fs.writeFile(path + '.map', JSON.stringify(result.map))
    console.log(`编译: ${path}`)
}

export default function(source: string, output: string) {
    io.copyDir(source, output)
    io.listFiles(output, {
        recursive: true,
        fullPath: true,
    }).forEach(function (v) {
        if (/\.(t|j)sx?$/.test(v))
            compileJs(v)
    })
}
