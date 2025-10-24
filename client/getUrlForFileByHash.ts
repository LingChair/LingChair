export default function getUrlForFileByHash(file_hash?: string, defaultUrl?: string) {
    return file_hash ? "uploaded_files/" + file_hash: defaultUrl
}
