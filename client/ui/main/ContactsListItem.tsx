import User from "../../api/client_data/User.ts"
import Avatar from "../Avatar.tsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    contact: User
    openChatFragment: (id: string) => void
}

export default function ContactsListItem({ contact, openChatFragment }: Args) {
    const { id, nickname, avatar } = contact
    return (
        <mdui-list-item rounded style={{
            marginTop: '3px',
            marginBottom: '3px',
            width: '100%',
        }} onClick={() => openChatFragment(id)}>
            <span style={{
                width: "100%",
            }}>{nickname}</span>
            <Avatar src={avatar} text="title" slot="icon" />
        </mdui-list-item>
    )
}
