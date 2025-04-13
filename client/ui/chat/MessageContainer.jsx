export default function MessageContainer({ children }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingTop: '10px',
            paddingBottom: '14px'
        }}>
            {children}
        </div>
    )
}