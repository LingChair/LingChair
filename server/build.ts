// @ts-types="npm:@types/babel__core"
import babel from '@babel/core'
import io from './lib/io.js'

function compileJs(path: string) {
    babel.transformFileAsync(path, {
        presets: [
            [
                "@babel/preset-env", {
                    modules: false,
                },
            ],
            "@babel/preset-react",
            [
                "minify", {

                }
            ],
        ],
        targets: {
            chrome: "53",
            android: "40",
        },
        sourceMaps: true,
    }).then(function (result) {
        if (result == null) throw new Error('result == null')
        io.open(path, 'w').writeAll(result.code + '\n' + `//@ sourceMappingURL=${io.getName(path)}.map`).close()
        io.open(path + '.map', 'w').writeAll(JSON.stringify(result.map)).close()
        console.log(`Compile js: ${path}`)
    })
}

export default function (path: string) {
    io.listFiles(path, {
        recursive: true,
        fullPath: true,
    }).forEach(function (v) {
        if (v.endsWith('.js'))
            compileJs(v)
        else if (v.endsWith('.jsx')) {
            const v2 = `${io.getParent(v)}//${io.getName(v).replace(/\.jsx/, '.js')}`
            io.move(v, v2)
            compileJs(v2)
        }
    })
}
