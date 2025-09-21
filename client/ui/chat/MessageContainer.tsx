interface Args extends React.HTMLAttributes<HTMLElement> {}

export default function MessageContainer({ children, style, ...props }: Args) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '20px',
            ...style,
        }}
        {...props}>
            {children}
        </div>
    )
}
