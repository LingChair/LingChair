import { $ } from 'mdui/jq'

customElements.define('chat-file', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.style.display = 'block'
        const e = new DOMParser().parseFromString(`
        <a style="width: 100%;height: 100%;">
            <mdui-card variant="outlined" clickable style="display: flex;align-items: center;">
                <mdui-icon name="insert_drive_file" style="margin: 13px;font-size: 34px;"></mdui-icon>
                <span style="margin-right: 13px;"></span>
            </mdui-card>
        </a>`, 'text/html').body.firstChild as HTMLElement
        $(e).find('span').text($(this).attr("name"))
        const href = $(this).attr('href')
        $(e).attr('href', href)
        $(e).attr('target', '_blank')
        $(e).attr('download', href)
        e.style.textDecoration = 'none'
        e.style.color = 'inherit'
        // deno-lint-ignore no-window
        e.onclick = (e) => {
            e.stopPropagation()
        }
        this.appendChild(e)
    }
})
