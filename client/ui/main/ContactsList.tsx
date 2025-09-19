import User from "../../api/client_data/User.ts"
import ContactsListItem from "./ContactsListItem.tsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    contactsMap: { [key: string]: User[] }
    display: boolean
    openChatFragment: (id: string) => void
}

export default function ContactsList({
    contactsMap,
    display,
    openChatFragment,
    ...props
}: Args) {
    return <mdui-list style={{
        overflowY: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: display ? undefined : 'none'
    }} {...props}>

        <mdui-collapse accordion value={Object.keys(contactsMap)[0]}>
            <mdui-list-item rounded style={{
                width: '100%',
            }} icon="person_add">添加聯絡人</mdui-list-item>
            {
                Object.keys(contactsMap).map((v) =>
                    <mdui-collapse-item key={v} value={v}>
                        <mdui-list-subheader slot="header">{v}</mdui-list-subheader>
                        {
                            contactsMap[v].map((v2) =>
                                <ContactsListItem
                                    openChatFragment={openChatFragment}
                                    key={v2.id}
                                    contact={v2} />
                            )
                        }
                    </mdui-collapse-item>
                )
            }
        </mdui-collapse>
    </mdui-list>
}