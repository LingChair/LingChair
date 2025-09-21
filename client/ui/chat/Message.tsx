import Client from "../../api/Client.ts"
import DataCaches from "../../api/DataCaches.ts"
import Avatar from "../Avatar.tsx"
import useAsyncEffect from "../useAsyncEffect.ts"
import React from "react"

interface Args extends React.HTMLAttributes<HTMLElement> {
    userId: string
}

export default function Message({ userId, children, ...props }: Args) {
    const isAtRight = Client.myUserProfile?.id == userId

    const [ nickName, setNickName ] = React.useState("")
    const [ avatarUrl, setAvatarUrl ] = React.useState<string | undefined>("")

    useAsyncEffect(async () => {
        const user = await DataCaches.getUserProfile(userId)
        setNickName(user.nickname)
        setAvatarUrl(user?.avatar)
    }, [userId])

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
                <span
                    id="msg"
                    style={{
                        fontSize: "94%"
                    }}>
                    {
                        // 消息内容
                        children
                    }
                </span>
            </mdui-card>
        </div>
    )
}
