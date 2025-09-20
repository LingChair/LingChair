import RecentChat from "../../api/client_data/RecentChat.ts"
import RecentsListItem from "./RecentsListItem.tsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    recentsList: RecentChat[]
    setRecentsList: React.Dispatch<React.SetStateAction<RecentChat[]>>
    display: boolean
    currentChatId: string
    openChatFragment: (id: string) => void
}

export default function RecentsList({
    recentsList,
    setRecentsList,
    currentChatId,
    display,
    openChatFragment,
    ...props
}: Args) {
    return <mdui-list style={{
        overflowY: 'auto',
        paddingRight: '10px',
        display: display ? undefined : 'none',
        height: '100%',
    }} {...props}>
        {
            recentsList.map((v) =>
                <RecentsListItem
                    active={currentChatId == v.id}
                    openChatFragment={() => openChatFragment(v.id)}
                    key={v.id}
                    recentChat={v} />
            )
        }
    </mdui-list>
}