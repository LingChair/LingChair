import io from '../lib/io.js';

const baseDir = 'whiteslik_data/user'

export class UserManager {
    static getUserProfileDir(id) {
        return `${baseDir}/${id}`
    }
    static findUserById(id) {
        let list = io.listFolders(baseDir)
        console.log(list)
    }
    static findUserByName(name) {
        
    }

    /**
     * 创建新用户
     * @param { Object } arg
     * @param { String } [arg.name] 用户名
     * @returns { User }
     */
    static createUser({ name } = {}) {
        
    }
}

export class User {
    /** @type { Number } */
    id
    /** @type { String } */
    name
    /** @type { String } */
    nick
    /** @type { String } */
    description
}

export class UserApi {
    static createUser() {

    }
}
