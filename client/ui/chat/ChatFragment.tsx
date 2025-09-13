import { Tab } from "mdui"
import useEventListener from "../useEventListener.ts"
import Message from "./Message.jsx"
import MessageContainer from "./MessageContainer.jsx"

import * as React from 'react'

export default function ChatFragment({ ...props } = {}) {
    const messageList = React.useState([])

    const [tabItemSelected, setTabItemSelected] = React.useState('Chat')
    const tabRef: React.MutableRefObject<Tab | null> = React.useRef(null)
    useEventListener(tabRef, 'change', (event) => {
        setTabItemSelected((event.target as HTMLElement as Tab).value as string)
    })

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        }} {...props}>
            <mdui-tabs ref={tabRef} value="Chat" style={{
                position: 'sticky',
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}>
                <mdui-tab value="Chat">Title</mdui-tab>
                <mdui-tab value="Settings">設定</mdui-tab>

                <mdui-tab-panel slot="panel" value="Chat" style={{
                    display: tabItemSelected == "Chat" ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "15px"
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
                        <mdui-text-field variant="outlined" placeholder="喵呜~" autosize max-rows={1} style={{
                            marginRight: '10px',
                        }}></mdui-text-field>
                        <mdui-button-icon slot="end-icon" icon="more_vert" style={{
                            marginRight: '6px',
                        }}></mdui-button-icon>
                        <mdui-button-icon icon="send" style={{
                            marginRight: '7px',
                        }}></mdui-button-icon>
                    </div>
                </mdui-tab-panel>
                <mdui-tab-panel slot="panel" value="Settings" style={{
                    display: tabItemSelected == "Settings" ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                }}>
                    Work in progress...
                </mdui-tab-panel>
            </mdui-tabs>
        </div>
    )
}
