import Config from "../config.ts"
import User from "./User.ts";

abstract class BaseDataManager {
    declare name: string
    constructor(name: string) {
        this.init(name)
        this.onInit()
    }
    private init(name: string) {
        this.name = name
        
    }
    abstract onInit(): void
}

class UserDataManager extends BaseDataManager {
    static SINGLE_INSTANCE = new UserDataManager('users')
    override onInit(): void {
        
    }
}

export default class DataBaseManager {
    static getUserDataManager() {
        return UserDataManager.SINGLE_INSTANCE
    }
}
