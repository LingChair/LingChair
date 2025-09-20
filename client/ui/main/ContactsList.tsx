import React from "react"
import User from "../../api/client_data/User.ts"
import ContactsListItem from "./ContactsListItem.tsx"
import useEventListener from "../useEventListener.ts"
import { TextField } from "mdui";

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
    const searchRef = React.useRef<HTMLElement>(null)
    const [searchText, setSearchText] = React.useState('')

    useEventListener(searchRef, 'input', (e) => {
        setSearchText((e.target as unknown as TextField).value)
    })

    return <mdui-list style={{
        overflowY: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: display ? undefined : 'none',
        height: '100%',
    }} {...props}>
        <mdui-text-field icon="search" type="search" clearable ref={searchRef} variant="outlined" label="搜索..." style={{
            marginTop: '5px',
        }}></mdui-text-field>

        <mdui-list-item rounded style={{
            width: '100%',
            marginTop: '13px',
            marginBottom: '15px',
        }} icon="person_add">添加聯絡人</mdui-list-item>
        {
            contactsList.filter((user) =>
                searchText == '' || 
                user.nickname.includes(searchText) ||
                user.id.includes(searchText) ||
                user.username?.includes(searchText)
            ).map((v) =>
                <ContactsListItem
                    openChatFragment={openChatFragment}
                    key={v.id}
                    contact={v} />
            )
        }
    </mdui-list>
}