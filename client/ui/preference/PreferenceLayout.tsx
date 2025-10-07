export default function PreferenceLayout({ children, ...props }) {
    return <mdui-list style={{
        marginLeft: '15px',
        marginRight: '15px',
    }} {...props}>
        {children}
    </mdui-list>
}