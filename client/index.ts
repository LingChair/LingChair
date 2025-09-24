import 'mdui/mdui.css'
import 'mdui'
import { $ } from "mdui/jq"
import { breakpoint, Dialog } from "mdui"

import * as React from 'react'
import ReactDOM from 'react-dom/client'

import './ui/custom-elements/chat-image.ts'

const urlParams = new URL(location.href).searchParams

// deno-lint-ignore no-window no-window-prefix
urlParams.get('debug') == 'true' && window.addEventListener('error', ({ message, filename, lineno, colno, error }) => {
    const m = $("#ErrorDialog_Message")
    const d = $("#ErrorDialog").get(0) as Dialog
    const s = d.open
    d.open = true
    m.html((s ? `${m.html()}<br/><br/>` : '') + `${message} (${filename || 'unknown'}:${lineno}:${colno})`)
})

import App from './ui/App.tsx'
import AppMobile from './ui/AppMobile.tsx'
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(React.createElement(urlParams.get('mobile') == 'true' ? AppMobile : App, null))

const onResize = () => {
    document.body.style.setProperty('--whitesilk-widget-message-maxwidth', breakpoint().down('md') ? "80%" : "70%")
    // deno-lint-ignore no-window
    document.body.style.setProperty('--whitesilk-window-width', window.innerWidth + 'px')
    // deno-lint-ignore no-window
    document.body.style.setProperty('--whitesilk-window-height', window.innerHeight + 'px')
}
// deno-lint-ignore no-window no-window-prefix
window.addEventListener('resize', onResize)
onResize()
