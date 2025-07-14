import config from './server/config.ts'
import io from './server/lib/io.js'

config.ensureAllDirsAreCreated()
io.copyDir('./client', config.dirs.WEB_PAGE_DIR)

await import('./server/build.ts').then(a => a.default(config.dirs.WEB_PAGE_DIR))
