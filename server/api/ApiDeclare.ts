export type CallMethod = 
    "User.auth" |
    "User.register" |
    "User.login" |

    "User.setAvatar" |

    "Chat.sendMessage" |
    "Chat.getMessageHistory"

export type ClientEvent = 
    "Client.onMessage"
