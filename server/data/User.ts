// @ts-types="npm:sequelize"
import { Sequelize, Op, Model, DataTypes } from 'sequelize'

export default class User extends Model {
    declare created_id: number 
    static async initTable(sequelize: Sequelize, name: string) {
        this.init({
            created_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            }
        }, {
            sequelize: sequelize,
            tableName: name,
        })
        await this.sync({ alter: true })
    }
}
