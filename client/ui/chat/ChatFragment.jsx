import Message from "./Message.jsx"
import MessageContainer from "./MessageContainer.jsx"

import * as React from 'react'

export default function ChatFragment({ ...props } = {}) {
    const messageList = React.useState([])

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        }} {...props}>
            <mdui-top-app-bar style={{
                position: 'sticky',
            }}>
                <mdui-button-icon icon="menu"></mdui-button-icon>
                <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
                <mdui-button-icon icon="more_vert"></mdui-button-icon>
            </mdui-top-app-bar>
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <mdui-button variant="text">加載更多</mdui-button>
                </div>
                <MessageContainer>
                </MessageContainer>
                {
                    // 输入框
                }
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '0.1rem',
                    paddingTop: '0.1rem',
                    height: '4rem',
                    position: 'sticky',
                    bottom: '2px',
                    marginLeft: '5px',
                    marginRight: '4px',
                    backgroundColor: 'rgb(var(--mdui-color-background))',
                }}>
                    <mdui-text-field variant="outlined" placeholder="喵呜~" autosize max-rows="1" style={{
                        marginRight: '10px',
                    }}></mdui-text-field>
                    <mdui-button-icon slot="end-icon" icon="more_vert" style={{
                        marginRight: '6px',
                    }}></mdui-button-icon>
                    <mdui-button-icon icon="send" style={{
                        marginRight: '7px',
                    }}></mdui-button-icon>
                </div>
            </div>
        </div >
    )
}
