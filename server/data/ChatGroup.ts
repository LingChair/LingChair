import chalk from "chalk"
import Chat from "./Chat.ts"
import User from "./User.ts"
import GroupSettingsBean from "./GroupSettingsBean.ts"

class GroupSettings {
    declare chat: ChatGroup
    declare settings: GroupSettingsBean
    constructor(chat: ChatGroup) {
        this.chat = chat
        this.settings = JSON.parse(chat.bean.settings)
    }

    update(bean: GroupSettingsBean) {
        const updateValue = (key: string) => {
            if (key in bean)
                this.settings[key] = bean[key]
        }
        for (const k of [
            'allow_new_member_join',
            'allow_new_member_from_invitation',
            'new_member_join_method',
            'answered_and_allowed_by_admin_question',
        ])
            updateValue(k)

        this.apply()
    }
    apply() {
        this.chat.setAttr('settings', JSON.stringify(this.settings))
    }
}

export default class ChatGroup extends Chat {
    getSettings() {
        return new GroupSettings(this)
    }

    static fromChat(chat: Chat) {
        return new ChatGroup(chat.bean)
    }

    static createGroup(group_name?: string) {
        return this.create(group_name, 'group')
    }
}