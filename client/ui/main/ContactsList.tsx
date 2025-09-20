import React from "react"
import User from "../../api/client_data/User.ts"
import ContactsListItem from "./ContactsListItem.tsx"
import useEventListener from "../useEventListener.ts"
import { ListItem, TextField } from "mdui"
import useAsyncEffect from "../useAsyncEffect.ts"
import Client from "../../api/Client.ts"
import data from "../../Data.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    display: boolean
    openChatFragment: (id: string) => void
}

export default function ContactsList({
    display,
    openChatFragment,
    ...props
}: Args) {
    const searchRef = React.useRef<HTMLElement>(null)
    const [isMultiSelecting, setIsMultiSelecting] = React.useState(false)
    const [searchText, setSearchText] = React.useState('')
    const [contactsList, setContactsList] = React.useState([
        {
            id: '1',
            avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
            nickname: "麻油衣酱",
        },
        {
            id: '0',
            avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
            nickname: "Maya Fey",
        },
    ] as User[])

    useEventListener(searchRef, 'input', (e) => {
        setSearchText((e.target as unknown as TextField).value)
    })

    useAsyncEffect(async () => {
        
    })

    return <mdui-list style={{
        overflowY: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: display ? undefined : 'none',
        height: '100%',
    }} {...props}>
        <mdui-text-field icon="search" type="search" clearable ref={searchRef} variant="outlined" placeholder="搜索..." style={{
            marginTop: '5px',
        }}></mdui-text-field>

        <mdui-list-item rounded style={{
            width: '100%',
            marginTop: '13px',
            marginBottom: '15px',
        }} icon="person_add">添加聯絡人</mdui-list-item>
        {/* <mdui-list-item rounded style={{
            width: '100%',
            marginBottom: '15px',
        }} icon={ isMultiSelecting ? "done" : "edit"} onClick={() => setIsMultiSelecting(!isMultiSelecting)}>{ isMultiSelecting ? "關閉多選" : "多選模式" }</mdui-list-item> */}

        {
            contactsList.filter((user) =>
                searchText == '' ||
                user.nickname.includes(searchText) ||
                user.id.includes(searchText) ||
                user.username?.includes(searchText)
            ).map((v) =>
                <ContactsListItem
                    /* active={!isMultiSelecting && false}
                    onClick={(e) => {
                        const self = (e.target as ListItem)
                        if (isMultiSelecting)
                            self.active = !self.active
                        else
                            void(0)
                    }} */
                    key={v.id}
                    contact={v} />
            )
        }
    </mdui-list>
}