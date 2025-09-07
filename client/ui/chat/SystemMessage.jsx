/**
 * 一条系统提示消息
 * @returns { React.JSX.Element }
 */
export default function SystemMessage({ children } = {}) {
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
                    paddingTop: '9px',
                    paddingBottom: '9px',
                    paddingLeft: '18px',
                    paddingRight: '18px',
                    fontSize: '92%',
                }}>
                {children}
            </mdui-card>
        </div>
    )
}
