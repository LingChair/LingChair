import { React } from '../../Imports.ts'

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
            marginBottom: '20px',
            height: "100%",
            ...style,
        }}
        {...props}>
            {children}
        </div>
    )
}
