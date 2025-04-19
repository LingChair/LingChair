import Avatar from "../Avatar.js"

export default function RecentsListItem({ title, avatar, content }) {
    return (
        <mdui-list-item rounded style={{
            marginTop: '3px',
            marginBottom: '3px',
        }}>
            {title}
            <Avatar src={avatar} text="title" slot="icon" />
            <span slot="description"
                style={{
                    display: "inline-block", /* 或者 block */
                    maxWidth: "100%", /* 或者固定宽度如 200px */
                    whiteSpace: "nowrap", /* 禁止换行 */
                    overflow: "hidden", /* 隐藏溢出内容 */
                    textOverflow: "ellipsis", /* 显示省略号 */
                }}>{content}</span>
        </mdui-list-item>
    )
}
