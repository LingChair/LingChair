import webpack from 'webpack'
import config from "./config.ts"
import path from 'node:path'

export default webpack({
    mode: 'production',
    devtool: 'source-map',
    entry: './client/ui/App.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(import.meta.dirname as string, config.data_path, 'page_compiled'),
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                    },
                },
            },
        ],
    },
})
