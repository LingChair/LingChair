import { $ } from 'mdui/jq'

customElements.define('chat-file', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.style.display = 'block'
        const e = new DOMParser().parseFromString(`
        <div style="width: 100%;height: 100%;">
            <mdui-card variant="outlined" clickable style="display: flex;align-items: center;">
                <mdui-icon name="insert_drive_file" style="margin: 13px;font-size: 34px;"></mdui-icon>
                <span style="margin-right: 13px;"></span>
            </mdui-card>
        </div>`, 'text/html').body.firstChild as HTMLElement
        $(e).find('span').text($(this).attr("name"))
        const href = $(this).attr('href')
        // deno-lint-ignore no-window
        e.onclick = () => window.open(href, '_blank')
        this.appendChild(e)
    }
})
