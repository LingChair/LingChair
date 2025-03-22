import io from '../lib/io.js';
import { CallbackMessage } from '../Types.js';

const baseDir = 'whiteslik_data/user'
io.mkdirs(baseDir)

export class UserManager {
    static getUserProfileDir(id) {
        return `${baseDir}/${id}`
    }
    static getUserById(id) {
        return new User(id)
    }
    static getUserByName(name) {
        let list = io.listFolders(baseDir, {
            fullPath: false,
        })
    }

    /**
     * 创建新用户
     * @param { Object } arg
     * @param { String } [arg.name] 用户名
     * @returns { User }
     */
    static createUser({ name } = {}) {
        let idCountFile = io.open(`${baseDir}/idcount`, 'rw').checkExistsOrWrite('10000')
        let idCount = parseInt(idCountFile.readAll())

        io.mkdirs(`${baseDir}/${idCount}`)

        idCount++
        idCountFile.writeAll(idCount + '').close()
        idCount--

        let user = new User(idCount)
        user.id = idCount
        user.name = name
        user.updateProfile()
        return user
    }
}

export class User {
    constructor(id) {
        if (!io.exists(`${baseDir}/${id}`)) throw new Error(`用户 [id=${id}]不存在!`)

        // 尽管所有的键都是 undefined 但是仍然是键哦
        for (let k of Object.keys(this)) {
            this[k] = io.open(`${baseDir}/${id}/${k}`, 'rw').checkExistsOrWrite('').readAllAndClose().toString()
        }
    }
    updateProfile() {
        // 尽管所有的键都是 undefined 但是仍然是键哦
        for (let k of Object.keys(this)) {
            io.open(`${baseDir}/${this.id}/${k}`, 'w').writeAll((this[k] || '') + '').close()
        }
        // 防止服务端错误修改此值 主要是都是属性了再搞特殊对待很麻烦的
        io.open(`${baseDir}/${this.id}/id`, 'w').writeAll(this.id + '').close()
    }
    /**
     * 设置头像
     * @param { Buffer } data 头像数据
     */
    setAvatar(data) {
        io.open(`${baseDir}/${this.id}/avatar`, 'w').writeAll(data).close()
    }
    /**获取头像
     * @returns { Buffer } data 头像数据
     */
    getAvatar() {
        return io.open(`${baseDir}/${this.id}/avatar`, 'r').readAllAndClose()
    }
    /** 
     * 用户 ID
     * @type { String }
     */
    id
    /** 
     * 用户名
     * @type { String }
     */
    name
    /** 
     * 用户昵称
     * @type { String }
     */
    nick
    /** 
     * 用户简介
     * @type { String }
     */
    description
    /** 
     * 密码(经过哈希处理)
     * @type { String }
     */
    passwordHashed
}

export const UserApi = {
    API_NAME: 'UserApi',
    /**
     * @param { Object } arg 
     * @returns { CallbackMessage }
     */
    ["createUser"]: (arg) => {
        return {
            msg: '🥰🥰🥰🥰🥰',
            code: CallbackMessage.Code.OK,
        }
    },
}
