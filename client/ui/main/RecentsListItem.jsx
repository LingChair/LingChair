import Avatar from "../Avatar.tsx"

export default function RecentsListItem({ nickName, avatar, content }) {
    return (
        <mdui-list-item rounded style={{
            marginTop: '3px',
            marginBottom: '3px',
        }}>
            {nickName}
            <Avatar src={avatar} text={nickName} slot="icon" />
            <span slot="description"
                style={{
                    width: "100%",
                    display: "inline-block",
                    whiteSpace: "nowrap", /* 禁止换行 */
                    overflow: "hidden", /* 隐藏溢出内容 */
                    textOverflow: "ellipsis", /* 显示省略号 */
                }}>{content}</span>
        </mdui-list-item>
    )
}
