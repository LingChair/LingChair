// @ts-types="npm:sequelize"
import { Sequelize } from 'sequelize'
import Config from "../config.ts"
import User from "./User.ts";

abstract class BaseDataManager {
    declare sequelize: Sequelize
    declare name: string
    constructor(name: string) {
        this.init(name)
        this.onInit()
    }
    private init(name: string) {
        this.name = name
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: Config.dirs.DATABASES_DIR + '/' + name + '.db'
        })
    }
    abstract onInit(): void
}

class UserDataManager extends BaseDataManager {
    static SINGLE_INSTANCE = new UserDataManager('users')
    override onInit(): void {
        User.initTable(this.sequelize, this.name)
    }
}

export default class DataBaseManager {
    static getUserDataManager() {
        return UserDataManager.SINGLE_INSTANCE
    }
}
