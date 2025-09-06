import Avatar from "../Avatar.jsx"

import { React } from '../../Imports.ts'

/**
 * 一条消息
 * @param { Object } param
 * @param { "left" | "right" } [param.direction="left"] 消息方向
 * @param { String } [param.avatar] 头像链接
 * @param { String } [param.nickName] 昵称
 * @returns { React.JSX.Element }
 */
export default function Message({ direction = 'left', avatar, nickName, children, ...props } = {}) {
    let isAtRight = direction == 'right'
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
                    src={avatar}
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
