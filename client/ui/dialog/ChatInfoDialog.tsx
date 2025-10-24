import React from 'react'
import Chat from "../../api/client_data/Chat.ts"
import useAsyncEffect from "../useAsyncEffect.ts"
import Client from "../../api/Client.ts"
import data from "../../Data.ts"
import { Dialog } from "mdui"
import Avatar from "../Avatar.tsx"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import User from "../../api/client_data/User.ts"
import getUrlForFileByHash from "../../getUrlForFileByHash.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    chat: Chat
    openChatFragment: (id: string) => void
    chatInfoDialogRef: React.MutableRefObject<Dialog>
    openUserInfoDialog: (user: User | string) => void
}

export default function ChatInfoDialog({ chat, chatInfoDialogRef, openChatFragment, openUserInfoDialog }: Args) {
    const [chatInfo, setChatInfo] = React.useState(null as unknown as Chat)
    const isMySelf = Client.myUserProfile?.id == chatInfo?.user_a_id && Client.myUserProfile?.id == chatInfo?.user_b_id

    useAsyncEffect(async () => {
        if (chat == null) return
        const re = await Client.invoke("Chat.getInfo", {
            token: data.access_token,
            target: chat.id,
        })
        if (re.code != 200)
            return checkApiSuccessOrSncakbar(re, '获取对话信息失败')
        setChatInfo(re.data!.chat_info as Chat)
    })

    return (
        <mdui-dialog close-on-overlay-click close-on-esc ref={chatInfoDialogRef}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Avatar src={getUrlForFileByHash(chat?.avatar_file_hash as string)} text={chat?.nickname as string} style={{
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
            }}></mdui-divider>

            <mdui-list>
                {
                    chat?.type == 'private' &&
                    <mdui-list-item icon="person" rounded onClick={async () => {
                        const re = await Client.invoke("Chat.getAnotherUserIdFromPrivate", {
                            token: data.access_token,
                            target: chat.id,
                        })
                        if (re.code != 200)
                            return checkApiSuccessOrSncakbar(re, '获取用户失败')

                        openUserInfoDialog(re.data!.user_id as string)
                    }}>用户详情</mdui-list-item>
                }
                <mdui-list-item icon="chat" rounded onClick={() => {
                    chatInfoDialogRef.current!.open = false
                    openChatFragment(chat.id)
                }}>打开此对话</mdui-list-item>
            </mdui-list>
        </mdui-dialog>
    )
}
