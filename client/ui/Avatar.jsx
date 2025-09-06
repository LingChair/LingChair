import { React } from '../Imports.ts'

export default function Avatar({ src, text, icon = 'person', ...props } = {}) {
    return (
        src ? <mdui-avatar {...props}>
            <img src={src} alt={'(头像)' + text || ''} />
        </mdui-avatar>
            : (
                text ? <mdui-avatar {...props}>
                    {
                        text.substring(0, 0)
                    }
                </mdui-avatar>
                    : <mdui-avatar icon={icon} {...props} />
            )
    )
}
