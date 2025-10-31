import { $ } from 'mdui/jq'

customElements.define('chat-video', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.style.display = 'block'
        const e = new DOMParser().parseFromString(`<video controls></video>`, 'text/html').body.firstChild as HTMLVideoElement
        e.style.maxWidth = "400px"
        e.style.maxHeight = "300px"
        e.style.width = "100%"
        e.style.height = "100%"
        e.style.borderRadius = "var(--mdui-shape-corner-medium)"
        e.src = $(this).attr('src') as string
        e.onclick = (e) => e.stopPropagation()
        this.appendChild(e)
    }
})
