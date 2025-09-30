export default function isMobileUI() {
    return new URL(location.href).searchParams.get('mobile') == 'true'
}