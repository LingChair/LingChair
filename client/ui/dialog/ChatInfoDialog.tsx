import React from 'react'
import Chat from "../../api/client_data/Chat.ts"
import useAsyncEffect from "../useAsyncEffect.ts"
import Client from "../../api/Client.ts"
import data from "../../Data.ts"
import { Dialog } from "mdui"
import Avatar from "../Avatar.tsx";
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    chat: Chat
    openChatFragment: (id: string) => void
    chatInfoDialogRef: React.MutableRefObject<Dialog>
}

export default function ChatInfoDialog({ chat, chatInfoDialogRef, openChatFragment }: Args) {
    const [chatInfo, setChatInfo] = React.useState(null as unknown as Chat)
    const isMySelf = Client.myUserProfile?.id == chatInfo?.user_a_id && Client.myUserProfile?.id == chatInfo?.user_b_id

    useAsyncEffect(async () => {
        if (chat == null) return
        const re = await Client.invoke("Chat.getInfo", {
            token: data.access_token,
            target: chat.id,
        })
        if (re.code != 200)
            return checkApiSuccessOrSncakbar(re, '獲取對話訊息失敗')
        setChatInfo(re.data!.chat_info as Chat)
    })

    return (
        <mdui-dialog close-on-overlay-click close-on-esc ref={chatInfoDialogRef}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Avatar src={chat?.avatar as string} text={chat?.nickname as string} style={{
                    width: '50px',
                    height: '50px',
                }} />
                <span style={{
                    marginLeft: "15px",
                    fontSize: '16.5px',
                }}>{chat?.title}</span>
            </div>
            <mdui-divider style={{
                marginTop: "10px",
                marginBottom: "10px",
            }}></mdui-divider>

            <mdui-list>
                <mdui-list-item icon="chat" rounded onClick={() => {
                    chatInfoDialogRef.current!.open = false
                    openChatFragment(chat.id)
                }}>對話</mdui-list-item>
            </mdui-list>
        </mdui-dialog>
    )
}
