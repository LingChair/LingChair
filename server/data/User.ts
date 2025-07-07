// @ts-types="npm:sequelize"
import { Sequelize, Model, DataTypes } from 'sequelize'

export default class User extends Model {
    declare created_id: number 
    static async initTable(sequelize: Sequelize, name: string) {
        this.init({
            created_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nick_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            avatar: {
                type: DataTypes.BLOB,
            },
            
        }, {
            sequelize: sequelize,
            tableName: name,
        })
        await this.sync({ alter: true })
    }
}
