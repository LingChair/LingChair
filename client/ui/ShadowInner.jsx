export default function ShadowInner({ children }) {
    return (
        <div onLoad={window.shadowInnerInit}>
            {children}
        </div>
    )
}
