import { ListItem } from "mdui";
import User from "../../api/client_data/User.ts"
import Avatar from "../Avatar.tsx"
import React from 'react'

interface Args extends React.HTMLAttributes<HTMLElement> {
    contact: User
    active?: boolean
}

export default function ContactsListItem({ contact, ...prop }: Args) {
    const { id, nickname, avatar } = contact
    const ref = React.useRef<HTMLElement>(null)

    return (
        <mdui-list-item ref={ref} rounded style={{
            marginTop: '3px',
            marginBottom: '3px',
            width: '100%',
        }} {...prop as any}>
            <span style={{
                width: "100%",
            }}>{nickname}</span>
            <Avatar src={avatar} text="title" slot="icon" />
        </mdui-list-item>
    )
}
