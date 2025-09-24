import { TextField } from "mdui"
import RecentChat from "../../api/client_data/RecentChat.ts"
import useEventListener from "../useEventListener.ts"
import RecentsListItem from "./RecentsListItem.tsx"
import React from "react"

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
    const searchRef = React.useRef<HTMLElement>(null)
    const [searchText, setSearchText] = React.useState('')

    useEventListener(searchRef, 'input', (e) => {
        setSearchText((e.target as unknown as TextField).value)
    })

    return <mdui-list style={{
        overflowY: 'auto',
        paddingRight: '10px',
        paddingLeft: '10px',
        display: display ? undefined : 'none',
        height: '100%',
        width: '100%',
    }} {...props}>
        <mdui-text-field icon="search" type="search" clearable ref={searchRef} variant="outlined" placeholder="搜索..." style={{
            marginTop: '5px',
            marginBottom: '13px',
        }}></mdui-text-field>
        {
            recentsList.filter((chat) =>
                searchText == '' ||
                chat.title.includes(searchText) ||
                chat.id.includes(searchText) ||
                chat.content?.includes(searchText)
            ).map((v) =>
                <RecentsListItem
                    active={currentChatId == v.id}
                    openChatFragment={() => openChatFragment(v.id)}
                    key={v.id}
                    recentChat={v} />
            )
        }
    </mdui-list>
}