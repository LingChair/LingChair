import RecentChat from "../../api/client_data/RecentChat.ts"
import RecentsListItem from "./RecentsListItem.tsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    recentsList: RecentChat[]
    display: boolean
    openChatFragment: (id: string) => void
}

export default function RecentsList({
    recentsList,
    display,
    openChatFragment,
    ...props
}: Args) {
    return <mdui-list style={{
        overflowY: 'auto',
        paddingRight: '10px',
        display: display ? undefined : 'none'
    }} {...props}>
        {
            recentsList.map((v) =>
                <RecentsListItem
                    openChatFragment={openChatFragment}
                    key={v.id}
                    recentChat={v} />
            )
        }
    </mdui-list>
}