import RecentChat from "../../api/client_data/RecentChat.ts"
import User from "../../api/client_data/User.ts"
import ContactsListItem from "./ContactsListItem.jsx"
import RecentsListItem from "./RecentsListItem.jsx"

interface Args extends React.HTMLAttributes<HTMLElement> {
    recentsList: RecentChat[]
    display: boolean
}

export default function RecentsList({
    recentsList,
    display,
    ...props
}: Args) {
    return <mdui-list style={{
        overflowY: 'auto',
        paddingRight: '10px',
        display: display ? undefined : 'none'
    }}>
        {
            recentsList.map((v) =>
                <RecentsListItem
                    key={v.id}
                    nickName={v.title}
                    avatar={v.avatar}
                    content={v.content} />
            )
        }
    </mdui-list>
}