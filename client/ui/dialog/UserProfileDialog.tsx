import * as React from 'react'
import { Dialog } from "mdui"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import data from "../../Data.ts"
import Avatar from "../Avatar.tsx"
import User from "../../api/client_data/User.ts"
import getUrlForFileByHash from "../../getUrlForFileByHash.ts"

interface Refs {
    userProfileDialogRef: React.MutableRefObject<Dialog>
    chatInfoDialogRef: React.MutableRefObject<Dialog>
    openChatFragment: (id: string) => void
    user: User
}

export default function UserProfileDialog({
    userProfileDialogRef,
    chatInfoDialogRef,
    openChatFragment,
    user
}: Refs) {
    return (
        <mdui-dialog close-on-overlay-click close-on-esc ref={userProfileDialogRef}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Avatar src={getUrlForFileByHash(user?.avatar_file_hash)} text={user?.nickname} style={{
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
            }}></mdui-divider>

            <mdui-list>
                {/* <mdui-list-item icon="edit" rounded>设置备注</mdui-list-item> */}
                <mdui-list-item icon="chat" rounded onClick={async () => {
                    const re = await Client.invoke("Chat.getIdForPrivate", {
                        token: data.access_token,
                        target: user.id,
                    })
                    if (re.code != 200)
                        return checkApiSuccessOrSncakbar(re, '获取对话失败')
                    
                    openChatFragment(re.data!.chat_id as string)
                    userProfileDialogRef.current!.open = false
                    chatInfoDialogRef.current!.open = false
                }}>对话</mdui-list-item>
            </mdui-list>
        </mdui-dialog>
    )
}