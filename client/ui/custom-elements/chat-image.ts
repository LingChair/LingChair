import { $ } from 'mdui/jq'
import { dialog } from 'mdui'

import 'pinch-zoom-element'

function openImageViewer(src: string) {
    $('#image-viewer-dialog-inner').empty()

    const e = new Image()
    e.onload = () => ($('#image-viewer-dialog-inner').get(0) as any).setTransform({
        scale: 0.1,
        x: 0 + e.width / 4,
        y: 0 + e.height / 16,
    })
    e.src = src
    $('#image-viewer-dialog-inner').append(e)
    $('#image-viewer-dialog').attr('open', 'true')
}

customElements.define('chat-image', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const e = new Image()
        e.style.maxWidth = "100%"
        e.style.maxHeight = "90%"
        e.style.marginTop = "13px"
        e.style.borderRadius = "var(--mdui-shape-corner-medium)"
        e.alt = $(this).attr('alt') || ""
        e.onerror = () => {
            const bak = $(this).html()
            $(this).html(`<br/><mdui-icon name="broken_image" style="font-size: 2rem;"></mdui-icon>`)
            $(this).attr('alt', '無法加載圖像')
            $(this).on('click', () => {
                dialog({
                    headline: "圖片無法載入",
                    description: "您是否需要重新加載?",
                    actions: [
                        {
                            text: "重載",
                            onClick: () => {
                                $(this).html(bak)
                                return false
                            },
                        },
                        {
                            text: "取消",
                            onClick: () => {
                                return false
                            },
                        },
                    ],
                })
            })
        }
        e.src = $(this).attr('src') as string
        e.onclick = () => {
            openImageViewer($(this).attr('src') as string)
        }
        this.appendChild(e)
    }
})

document.body.appendChild(new DOMParser().parseFromString(`
    <mdui-dialog id="image-viewer-dialog" fullscreen="fullscreen">
        <style>
            #image-viewer-dialog::part(panel) {
                background: rgba(0, 0, 0, 0) !important;
                padding: 0 !important;
            }
    
            #image-viewer-dialog>mdui-button-icon[icon=close] {
                z-index: 114514;
                position: fixed;
                top: 15px;
                right: 15px;
                color: #ffffff
            }
    
            #image-viewer-dialog>mdui-button-icon[icon=open_in_new] {
                z-index: 114514;
                position: fixed;
                top: 15px;
                right: 65px;
                color: #ffffff
            }
        </style>
        <mdui-button-icon icon="open_in_new"
            onclick="window.open(document.querySelector('#image-viewer-dialog-inner > *').src, '_blank')">
        </mdui-button-icon>
        <mdui-button-icon icon="close" onclick="this.parentNode.open = false">
        </mdui-button-icon>
        <pinch-zoom id="image-viewer-dialog-inner" style="width: var(--whitesilk-window-width); height: var(--whitesilk-window-height);">
        </pinch-zoom>
    </mdui-dialog>
`, 'text/html').body.firstChild as Node)
