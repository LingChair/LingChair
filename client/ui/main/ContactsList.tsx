import React from "react"
import ContactsListItem from "./ContactsListItem.tsx"
import useEventListener from "../useEventListener.ts"
import { Dialog, ListItem, TextField } from "mdui"
import useAsyncEffect from "../useAsyncEffect.ts"
import Client from "../../api/Client.ts"
import data from "../../Data.ts"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import Chat from "../../api/client_data/Chat.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    display: boolean
    chatInfoDialogRef: React.MutableRefObject<Dialog>
    setChatInfo: React.Dispatch<React.SetStateAction<Chat>>
}

export default function ContactsList({
    display,
    setChatInfo,
    chatInfoDialogRef,
    ...props
}: Args) {
    const searchRef = React.useRef<HTMLElement>(null)
    const [isMultiSelecting, setIsMultiSelecting] = React.useState(false)
    const [searchText, setSearchText] = React.useState('')
    const [contactsList, setContactsList] = React.useState<Chat[]>([])

    useEventListener(searchRef, 'input', (e) => {
        setSearchText((e.target as unknown as TextField).value)
    })

    useAsyncEffect(async () => {
        const re = await Client.invoke("User.getMyContacts", {
            token: data.access_token,
        })
        if (re.code != 200)
            return checkApiSuccessOrSncakbar(re, "获取對話列表失败")

        setContactsList(re.data!.contacts_list as Chat[])
    })

    return <mdui-list style={{
        overflowY: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: display ? undefined : 'none',
        height: '100%',
        width: '100%',
    }} {...props}>
        <mdui-text-field icon="search" type="search" clearable ref={searchRef} variant="outlined" placeholder="搜索..." style={{
            marginTop: '5px',
        }}></mdui-text-field>

        <mdui-list-item rounded style={{
            width: '100%',
            marginTop: '13px',
            marginBottom: '15px',
        }} icon="person_add">添加對話</mdui-list-item>
        {/* <mdui-list-item rounded style={{
            width: '100%',
            marginBottom: '15px',
        }} icon={ isMultiSelecting ? "done" : "edit"} onClick={() => setIsMultiSelecting(!isMultiSelecting)}>{ isMultiSelecting ? "關閉多選" : "多選模式" }</mdui-list-item> */}

        {
            contactsList.filter((chat) =>
                searchText == '' ||
                chat.title.includes(searchText) ||
                chat.id.includes(searchText)
            ).map((v) =>
                <ContactsListItem
                    // active={!isMultiSelecting && false}
                    onClick={(e) => {
                        const self = (e.target as ListItem)
                        /*if (isMultiSelecting)
                            self.active = !self.active
                        else*/
                        setChatInfo(v)
                        chatInfoDialogRef.current!.open = true
                    }} 
                    key={v.id}
                    contact={v} />
            )
        }
    </mdui-list>
}