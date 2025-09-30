import { alert, Dropdown } from "mdui"
import { $ } from "mdui/jq"
import Client from "../../api/Client.ts"
import Data_Message from "../../api/client_data/Message.ts"
import DataCaches from "../../api/DataCaches.ts"
import Avatar from "../Avatar.tsx"
import copyToClipboard from "../copyToClipboard.ts"
import useAsyncEffect from "../useAsyncEffect.ts"
import React from "react"
import useEventListener from "../useEventListener.ts"
import isMobileUI from "../isMobileUI.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    userId: string
    rawData: string
    renderHTML: string
    message: Data_Message
}

export default function Message({ userId, rawData, renderHTML, message, ...props }: Args) {
    const isAtRight = Client.myUserProfile?.id == userId

    const [nickName, setNickName] = React.useState("")
    const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>("")

    useAsyncEffect(async () => {
        const user = await DataCaches.getUserProfile(userId)
        setNickName(user.nickname)
        setAvatarUrl(user?.avatar)
    }, [userId])

    const dropDownRef = React.useRef<Dropdown>(null)

    return (
        <div
            slot="trigger"
            style={{
                width: "100%",
                display: "flex",
                justifyContent: isAtRight ? "flex-end" : "flex-start",
                flexDirection: "column"
            }}
            {...props}>
            <div
                style={{
                    display: "flex",
                    justifyContent: isAtRight ? "flex-end" : "flex-start",
                }}>
                {
                    // 发送者昵称(左)
                    isAtRight && <span
                        style={{
                            alignSelf: "center",
                            fontSize: "90%"
                        }}>
                        {nickName}
                    </span>
                }
                {
                    // 发送者头像
                }
                <Avatar
                    src={avatarUrl}
                    text={nickName}
                    style={{
                        width: "43px",
                        height: "43px",
                        margin: "11px"
                    }} />
                {
                    // 发送者昵称(右)
                    !isAtRight && <span
                        style={{
                            alignSelf: "center",
                            fontSize: "90%"
                        }}>
                        {nickName}
                    </span>
                }
            </div>
            <mdui-card
                variant="elevated"
                style={{
                    maxWidth: 'var(--whitesilk-widget-message-maxwidth)', // (window.matchMedia('(pointer: fine)') && "50%") || (window.matchMedia('(pointer: coarse)') && "77%"),
                    minWidth: "0%",
                    [isAtRight ? "marginRight" : "marginLeft"]: "55px",
                    marginTop: "-5px",
                    padding: "15px",
                    alignSelf: isAtRight ? "flex-end" : "flex-start",
                }}>
                <mdui-dropdown trigger={isMobileUI() ? 'click' : 'contextmenu'} ref={dropDownRef}>
                    <span
                        slot="trigger"
                        id="msg"
                        style={{
                            fontSize: "94%"
                        }}
                        dangerouslySetInnerHTML={{
                            __html: renderHTML
                        }} />
                    <mdui-menu>
                        <mdui-menu-item icon="content_copy" onClick={() => copyToClipboard($(dropDownRef.current as HTMLElement).find('#msg').text())}>複製文字</mdui-menu-item>
                        <mdui-menu-item icon="content_copy" onClick={() => copyToClipboard(rawData)}>複製原文</mdui-menu-item>
                        <mdui-menu-item icon="info" onClick={() => alert({
                            headline: "消息详情",
                            description: JSON.stringify(message),
                            confirmText: "关闭",
                            onConfirm: () => { },
                        })}>查看詳情</mdui-menu-item>
                    </mdui-menu>
                </mdui-dropdown>
            </mdui-card>

        </div>
    )
}
