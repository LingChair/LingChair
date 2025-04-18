import Avatar from "./Avatar.js"
import Message from "./chat/Message.js"
import MessageContainer from "./chat/MessageContainer.js"

function ListItem({ title, avatar, content }) {
    return (
        <mdui-list-item rounded>
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

export default function App() {
    return (
        <div style={{
            display: "flex",
        }}>
            {
                // 侧边列表
                // 囊括内容: 最近, 联系人
                // 最近 对应 聊天页面
                // 联系人 对应 ???
            }
            <mdui-list style={{
                width: "22.4%"
            }}>
                <ListItem
                    title="麻油衣酱"
                    avatar="https://www.court-records.net/mugshot/aa6-004-maya.png"
                    content="Nick's old partner and friend and the chief-in-training of Kurain Village, Maya makes her return to the main series..." />
                <ListItem
                    title="麻油一酱"
                    avatar="https://www.court-records.net/mugshot/aa6-004-maya.png"
                    content="我是绫里真宵, 是一名灵媒师~" />
            </mdui-list>
            {/* <MessageContainer>
                <Message
                    nickname="Fey"
                    avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                    Test
                </Message>
                <Message
                    direction="right"
                    nickname="Fey"
                    avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                    Test
                </Message>
            </MessageContainer> */}
        </div >
    )
}