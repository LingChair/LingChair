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
            [
                "@babel/preset-typescript", {
                    allowDeclareFields: true,
                },
            ],
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

export default async function(source: string, output: string) {
    const t = Date.now()
    io.remove(output)
    io.copyDir(source, output)
    for (const v of io.listFiles(output, {
        recursive: true,
        fullPath: true,
    })) 
        if (/\.(t|j)sx?$/.test(v) && !/\.(min|static)\.(t|j)sx?$/.test(v))
            await compileJs(v)
    return (Date.now() - t) / 1000
}
