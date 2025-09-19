import User from "../../api/client_data/User.ts"
import ContactsListItem from "./ContactsListItem.jsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    contactsMap: { [key: string]: User[] }
    display: boolean
}

export default function ContactsList({
    contactsMap,
    display,
    ...props
}: Args) {
    return <mdui-list style={{
        overflowY: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: display ? undefined : 'none'
    }} {...props}>

        <mdui-collapse accordion value={Object.keys(contactsMap)[0]}>
            {
                Object.keys(contactsMap).map((v) =>
                    <mdui-collapse-item key={v} value={v}>
                        <mdui-list-subheader slot="header">{v}</mdui-list-subheader>
                        {
                            contactsMap[v].map((v2) =>
                                <ContactsListItem
                                    key={v2.id}
                                    nickName={v2.nickname}
                                    avatar={v2.avatar} />
                            )
                        }
                    </mdui-collapse-item>
                )
            }
        </mdui-collapse>
    </mdui-list>
}