import process from 'node:process'
import child_process from 'node:child_process'
import fs from 'node:fs/promises'

function spawn(exec: string, args: string[]) {
    child_process.spawnSync(exec, args, {
        stdio: [process.stdin, process.stdout, process.stderr]
    })
}

function runBuild() {
    const args = [
        "run",
        "-A",
        "--node-modules-dir",
    ]
    let i = 0
    for (const arg of process.argv) {
        if (i > 1)
            args.push(arg)
        i++
    }
    
    spawn('deno', args)
}

if (process.platform == 'android') {
    try {
        await fs.stat('./node_modules/.deno/rollup@4.50.1/node_modules/rollup/')
    } catch (e) {
        spawn('deno', ['install', '--node-modules-dir=auto'])
    }
    spawn('sh', ["fix-build-on-android.sh"])
}

runBuild()
