export default function Message({ direction = 'left', children }) {
    return (
        <div
            slot="trigger"
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column"
            }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start"
                }}>
                {
                    // 发送者昵称(左)
                    direction == 'left' && <span
                        style={{
                            alignSelf: "center",
                            fontSize: "90%"
                        }}></span>
                }
                {
                    // 发送者头像
                }
                <mdui-avatar
                    style={{
                        width: "43px",
                        height: "43px",
                        margin: "11px"
                    }}>
                </mdui-avatar>
                {
                    // 发送者昵称(右)
                    direction == 'right' && <span
                        style={{
                            alignSelf: "center",
                            fontSize: "90%"
                        }}>
                    </span>
                }
            </div>
            <mdui-card
                variant="elevated"
                style={{
                    maxWidth: (window.matchMedia('(pointer: fine)') && "50%") || (window.matchMedia('(pointer: coarse)') && "77%"),
                    minWidth: "0%",
                    marginLeft: "55px",
                    marginTop: "-5px",
                    padding: "15px",
                    alignSelf: "flex-start"
                }}>
                {
                    // 消息内容
                    children
                }
                <span
                    id="msg"
                    style={{
                        fontSize: "94%"
                    }}>
                </span>
            </mdui-card>
        </div>
    )
}
