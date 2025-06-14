import config from './server/config.ts'
config.ensureAllDirsAreCreated()
await import('./server/build.ts').then(a => a.default(config.dirs.WEB_PAGE_DIR))
