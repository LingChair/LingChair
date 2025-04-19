/**
 * 消息容器
 * @returns { React.JSX.Element }
 */
export default function MessageContainer({ children, style, ...props } = {}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingTop: '10px',
            paddingBottom: '14px',
            ...style,
        }}
        {...props}>
            {children}
        </div>
    )
}
