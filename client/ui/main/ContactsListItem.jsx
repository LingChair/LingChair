import Avatar from "../Avatar.jsx"

import { React } from '../../Imports.ts'

export default function ContactsListItem({ nickName, avatar }) {
    return (
        <mdui-list-item rounded style={{
            marginTop: '3px',
            marginBottom: '3px',
            width: '100%',
        }}>
            <span style={{
                width: "100%",
            }}>{nickName}</span>
            <Avatar src={avatar} text="title" slot="icon" />
        </mdui-list-item>
    )
}
