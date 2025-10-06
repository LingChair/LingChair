import { DatabaseSync } from "node:sqlite"
import path from 'node:path'

import config from "../config.ts"
import User from "../data/User.ts";
import EventBean from "./EventBean.ts";

export default class EventStorer {
    static database: DatabaseSync = this.init()

    private static init(): DatabaseSync {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, 'Events.db'))
        return db
    }

    static getInstanceForUser(user: User) {
        return new EventStorer(user)
    }

    declare user: User
    constructor(user: User) {
        this.user = user

        EventStorer.database.exec(`
            CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
                /* 序号 */ count INTEGER PRIMARY KEY AUTOINCREMENT,
                /* 事件 */ event_name TEXT NOT NULL,
                /* 数据 */ data TEXT NOT NULL,
            );
       `)
    }
    protected getTableName() {
        return `events_${this.user.bean.id}`
    }
    addEvent(eventName: string, data: unknown) {
        EventStorer.database.prepare(`INSERT INTO ${this.getTableName()} (
            event_name,
            data
        ) VALUES (?, ?);`).run(
            eventName,
            JSON.stringify(data)
        )
    }
    getEvents() {
        return EventStorer.database.prepare(`SELECT * FROM ${this.getTableName()};`).all().map((v: any) => ({
            ...v,
            data: JSON.parse(v.data)
        })) as unknown as EventBean[]
    }
    clearEvents() {
        EventStorer.database.prepare(`DELETE FROM ${this.getTableName()};`).run()
    }
}
