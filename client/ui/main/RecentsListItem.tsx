import RecentChat from "../../api/client_data/RecentChat.ts"
import Avatar from "../Avatar.tsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    recentChat: RecentChat
    openChatFragment: (id: string) => void
}

export default function RecentsListItem({ recentChat, openChatFragment }: Args) {
    const { id, title, avatar, content } = recentChat
    return (
        <mdui-list-item rounded style={{
            marginTop: '3px',
            marginBottom: '3px',
        }} onClick={() => openChatFragment(id)}>
            {title}
            <Avatar src={avatar} text={title} slot="icon" />
            <span slot="description"
                style={{
                    width: "100%",
                    display: "inline-block",
                    whiteSpace: "nowrap", /* 禁止换行 */
                    overflow: "hidden", /* 隐藏溢出内容 */
                    textOverflow: "ellipsis", /* 显示省略号 */
                }}>{content}</span>
        </mdui-list-item>
    )
}
