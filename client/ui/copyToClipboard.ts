import { $ } from 'mdui/jq'

export default function copyToClipboard(text: string) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
    } else {
        const input = $('#copy_to_clipboard_fallback').get(0) as HTMLInputElement
        input.value = text
        input.select()
        input.setSelectionRange(0, 1145141919810)
        document.execCommand('copy')
        input.setSelectionRange(null, null)
    }
}