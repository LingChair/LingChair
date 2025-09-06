export default function snackbar(text) {
    $("#public_snackbar").text(text).get(0).open()
}
