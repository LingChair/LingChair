import openImageViewer from "../openImageViewer.ts"
import { snackbar } from "../snackbar.ts"

import { $ } from 'mdui/jq'


customElements.define('chat-image', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.style.display = 'block'
        const e = new Image()
        e.style.maxWidth = "100%"
        e.style.maxHeight = "90%"
        e.style.marginTop = '5px'
        e.style.marginBottom = '5px'
        e.style.borderRadius = "var(--mdui-shape-corner-medium)"
        e.alt = $(this).attr('alt') || ""
        e.onerror = () => {
            const src = $(this).attr('src')
            $(this).html(`<mdui-icon name="broken_image" style="font-size: 2rem;"></mdui-icon>`)
            $(this).attr('alt', '无法加载: ' + $(this).attr('alt'))
            $(this).on('click', () => {
                snackbar({
                    message: `图片 (${src}) 无法加载!`,
                    placement: 'top'
                })
            })
        }
        e.src = $(this).attr('src') as string
        e.onclick = (event) => {
            event.stopPropagation()
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
