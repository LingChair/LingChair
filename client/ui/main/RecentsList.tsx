import { TextField } from "mdui"
import RecentChat from "../../api/client_data/RecentChat.ts"
import useEventListener from "../useEventListener.ts"
import RecentsListItem from "./RecentsListItem.tsx"
import React from "react"
import useAsyncEffect from "../useAsyncEffect.ts"
import Client from "../../api/Client.ts"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts";
import data from "../../Data.ts";
import EventBus from "../../EventBus.ts";

interface Args extends React.HTMLAttributes<HTMLElement> {
    display: boolean
    currentChatId: string
    openChatFragment: (id: string) => void
}

export default function RecentsList({
    currentChatId,
    display,
    openChatFragment,
    ...props
}: Args) {
    const searchRef = React.useRef<HTMLElement>(null)
    const [searchText, setSearchText] = React.useState('')
    const [recentsList, setRecentsList] = React.useState<RecentChat[]>([])

    useEventListener(searchRef, 'input', (e) => {
        setSearchText((e.target as unknown as TextField).value)
    })

    useAsyncEffect(async () => {
        async function updateRecents() {
            const re = await Client.invoke("User.getMyRecentChats", {
                token: data.access_token,
            })
            if (re.code != 200)
                return checkApiSuccessOrSncakbar(re, "获取最近對話列表失败")
    
            setRecentsList(re.data!.recent_chats as RecentChat[])
        }
        updateRecents()
        EventBus.on('RecentsList.updateRecents', () => updateRecents())
        setTimeout(() => updateRecents(), 15 * 1000)
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
                chat.content.includes(searchText)
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