rm -r ./node_modules/.deno/rollup@4.50.1/node_modules/rollup/
cp -r ./node_modules/.deno/@rollup+wasm-node@4.48.0/node_modules/@rollup/wasm-node/ node_modules/.deno/rollup@4.50.1/node_modules/rollup/
echo Replaced rollup with @rollup/wasm-node successfully
