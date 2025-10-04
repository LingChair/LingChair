export default function copyToClipboard(text: string) {
    if (!("via" in window) && navigator.clipboard)
        return navigator.clipboard.writeText(text)
    return new Promise((res, rej) => {
        if (document.hasFocus()) {
            const a = document.createElement("textarea")
            document.body.appendChild(a)
            a.style.position = "fixed"
            a.style.clip = "rect(0 0 0 0)"
            a.style.top = "10px"
            a.value = text
            a.select()
            document.execCommand("cut", true)
            document.body.removeChild(a)
            res(null)
        } else {
            rej()
        }
    })
}
