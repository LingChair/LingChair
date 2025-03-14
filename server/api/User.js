class UserManager {
    static findUserById(id) {

    }
    static findUserByName(name) {

    }

    /**
     * 创建新用户
     * @param { Object } arg
     * @param { String } [arg.name] 用户名
     * @param { String } [arg.name] 用户名
     * @returns { User }
     */
    static createUser() {

    }
}

class User {
    /** @type { Number } */
    id
    /** @type { String } */
    name
    /** @type { String } */
    nick
    /** @type { String } */
    description
}

class UserApi {
    static createUser() {

    }
}

export {
    User,
    UserManager,
    UserApi
}
