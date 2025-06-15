import io from './lib/io.js'

export default class Config {
    static ensureAllDirsAreCreated() {
        for (const key of Object.keys(Config.dirs) as Array<keyof typeof Config.dirs>) {
            io.mkdirs(Config.dirs[key])
        }
    }
    static BASE_DIR = 'whitesilk_data'
    static dirs = {
        WEB_PAGE_DIR: this.BASE_DIR + '/_webpage',
        DATABASES_DIR: this.BASE_DIR + '/databases',
    }
}
