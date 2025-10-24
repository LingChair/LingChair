
export default function SystemMessage({ children }: React.HTMLAttributes<HTMLElement>) {
    return (
        <div style={{
            width: '100%',
            flexDirection: 'column',
            display: 'flex',
            marginTop: '25px',
            marginBottom: '20px',
        }}>
            <mdui-card variant="filled"
                style={{
                    alignSelf: 'center',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingLeft: '17px',
                    paddingRight: '17px',
                    fontSize: '92%',
                }}>
                {children}
            </mdui-card>
        </div>
    )
}
