import io from '../lib/io.js';
import { sha256 } from '../lib/crypto.js'
import { CallbackMessage } from '../Types.js';

const baseDir = 'whitesilk_data/user'
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
     * 密码(经过加盐哈希处理后的 哈希后的密码)
     * @type { String }
     */
    passwordHashed
}

export const UserApi = {
    API_NAME: 'UserApi',
    /**
     * 注册用户
     * @param { Object } args 
     * @param { String } args.name 用户名(必须, 注册后可以删除)
     * @param { String } args.password 密码(哈希后)
     * @returns { CallbackMessage }
     */
    ["createUser"]: (args) => {
        // TODO: 想办法解决账号注册的问题
        // 思路之一: 扫名称 重复则不允许
        // 思路之二: 邮箱制 但是无法多账号 以及其他遗留问题
        // 长远思考

        // 2025.6.2 決定
        // 使用郵箱驗證, 以賬號ID為基準, 用戶名可改但不可重複制度
        // 關聯性字符串數據庫

        // 具體方案: 先使用郵箱驗證
        // 再注冊賬號
        // 賬號支持修改不重複的用戶名
        // 可以一個郵箱多個賬號
        // 修改郵箱 = 修改文件名
        // 多賬號管理 = 郵箱 (文件夾) + 多賬戶ID
        // 忘記賬號 = 郵箱驗證 + 給出所有賬號
        let user = UserManager.createUser({
            name: args.name,
        })
        user.passwordHashed = sha256('我是盐 这个后面会给成配置文件来配置的喵~' + args.password)
        user.updateProfile()
        return {
            msg: '🥰🥰🥰🥰🥰',
            code: CallbackMessage.Code.OK,
            data: args,
        }
    },
}
