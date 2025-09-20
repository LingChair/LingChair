import React from 'react'
import Chat from "../../api/client_data/Chat.ts"
import useAsyncEffect from "../useAsyncEffect.ts"
import Client from "../../api/Client.ts"
import data from "../../Data.ts"
import { Dialog } from "mdui"

interface Args extends React.HTMLAttributes<HTMLElement> {
    chat: Chat
    chatInfoDialogRef: React.MutableRefObject<Dialog>
}

export default function ChatInfoDialog({ chat, chatInfoDialogRef }: Args) {
    const [isMySelf, setIsMySelf] = React.useState(false)

    useAsyncEffect(async () => {
        const re = await Client.invoke("Chat.getInfo", {
            token: data.access_token,
            target: chat.id,
        })
    })

    return (
        <mdui-dialog close-on-overlay-click close-on-esc ref={chatInfoDialogRef}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Avatar src={chat?.avatar} text={chat?.nickname} style={{
                    width: '50px',
                    height: '50px',
                }} />
                <span style={{
                    marginLeft: "15px",
                    fontSize: '16.5px',
                }}>{user?.nickname}</span>
            </div>
            <mdui-divider style={{
                marginTop: "10px",
                marginBottom: "10px",
            }}></mdui-divider>

            <mdui-list>
                {!isMySelf && <mdui-list-item icon="edit" rounded>編輯聯絡人訊息</mdui-list-item>}
                {
                    isMySelf && <>
                        <mdui-list-item icon="edit" rounded>編輯資料</mdui-list-item>
                        <mdui-list-item icon="settings" rounded>賬號設定</mdui-list-item>
                        <mdui-list-item icon="lock" rounded>隱私設定</mdui-list-item>
                    </>
                }
            </mdui-list>
        </mdui-dialog>
    )
}
