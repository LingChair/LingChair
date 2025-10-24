import { Dropdown, Dialog, dialog } from "mdui"
import { $ } from "mdui/jq"
import Client from "../../api/Client.ts"
import Data_Message from "../../api/client_data/Message.ts"
import DataCaches from "../../api/DataCaches.ts"
import Avatar from "../Avatar.tsx"
import copyToClipboard from "../copyToClipboard.ts"
import useAsyncEffect from "../useAsyncEffect.ts"
import useEventListener from "../useEventListener.ts"
import React from "react"
import isMobileUI from "../isMobileUI.ts"
import ReactJson from 'react-json-view'
import User from "../../api/client_data/User.ts"
import getUrlForFileByHash from "../../getUrlForFileByHash.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    userId: string
    rawData: string
    renderHTML: string
    message: Data_Message
    openUserInfoDialog: (user: User | string) => void
}

export default function Message({ userId, rawData, renderHTML, message, openUserInfoDialog, ...props }: Args) {
    const isAtRight = Client.myUserProfile?.id == userId

    const [nickName, setNickName] = React.useState("")
    const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>("")

    useAsyncEffect(async () => {
        const user = await DataCaches.getUserProfile(userId)
        setNickName(user.nickname)
        setAvatarUrl(getUrlForFileByHash(user?.avatar_file_hash))
    }, [userId])

    const dropDownRef = React.useRef<Dropdown>(null)
    const messageJsonDialogRef = React.useRef<Dialog>(null)
    useEventListener(messageJsonDialogRef, 'click', (e) => {
        e.stopPropagation()
    })
    useEventListener(dropDownRef, 'closed', (e) => {
        setDropDownOpen(false)
    })

    const [isDropDownOpen, setDropDownOpen] = React.useState(false)

    const [isUsingFullDisplay, setIsUsingFullDisplay] = React.useState(false)

    React.useEffect(() => {
        const text = $(dropDownRef.current as HTMLElement).find('#msg').text().trim()
        setIsUsingFullDisplay(text == '' || (
            rawData.split("tws:\/\/file\?hash=").length == 2
            && /\<\/chat\-(file|image|video)\>(\<\/span\>)?$/.test(renderHTML.trim())
        ))
    }, [renderHTML])

    return (
        <div
            slot="trigger"
            onContextMenu={(e) => {
                if (isMobileUI()) return
                e.preventDefault()
                setDropDownOpen(!isDropDownOpen)
            }}
            onClick={(e) => {
                if (!isMobileUI()) return
                e.preventDefault()
                setDropDownOpen(!isDropDownOpen)
            }}
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
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        openUserInfoDialog(userId)
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
                    padding: isUsingFullDisplay ? undefined : "13px",
                    paddingTop: isUsingFullDisplay ? undefined : "14px",
                    alignSelf: isAtRight ? "flex-end" : "flex-start",
                    backgroundColor: isUsingFullDisplay ? "inherit" : undefined
                }}>
                <mdui-dialog close-on-overlay-click close-on-esc ref={messageJsonDialogRef}>
                    {
                        // @ts-ignore 这是可以正常工作的
                        <ReactJson src={message} />
                    }
                </mdui-dialog>
                <mdui-dropdown trigger="manual" ref={dropDownRef} open={isDropDownOpen}>
                    <span
                        slot="trigger"
                        id="msg"
                        style={{
                            fontSize: "94%"
                        }}
                        dangerouslySetInnerHTML={{
                            __html: renderHTML
                        }} />
                    <mdui-menu onClick={(e) => {
                        e.stopPropagation()
                        setDropDownOpen(false)
                    }}>
                        <mdui-menu-item icon="content_copy" onClick={() => copyToClipboard($(dropDownRef.current as HTMLElement).find('#msg').text().trim())}>复制文字</mdui-menu-item>
                        <mdui-menu-item icon="content_copy" onClick={() => copyToClipboard(rawData)}>复制原文</mdui-menu-item>
                        <mdui-menu-item icon="info" onClick={() => messageJsonDialogRef.current!.open = true}>JSON</mdui-menu-item>
                    </mdui-menu>
                </mdui-dropdown>
            </mdui-card>

        </div>
    )
}
