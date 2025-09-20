import React from "react"
import User from "../../api/client_data/User.ts"
import ContactsListItem from "./ContactsListItem.tsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    contactsList: User[]
    setContactsList: React.Dispatch<React.SetStateAction<User[]>>
    display: boolean
    openChatFragment: (id: string) => void
}

export default function ContactsList({
    contactsList,
    setContactsList,
    display,
    openChatFragment,
    ...props
}: Args) {
    return <mdui-list style={{
        overflowY: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: display ? undefined : 'none',
        height: '100%',
    }} {...props}>
        <mdui-list-item rounded style={{
            width: '100%',
        }} icon="person_add">添加聯絡人</mdui-list-item>
        {
            contactsList.map((v2) =>
                <ContactsListItem
                    openChatFragment={openChatFragment}
                    key={v2.id}
                    contact={v2} />
            )
        }
    </mdui-list>
}