export type CallMethod = 
    "User.auth" |
    "User.register" |
    "User.login" |

    "User.setAvatar" |
    "User.updateProfile" |
    "User.getMyInfo" |

    "User.getMyContacts" |
    "User.addContact" |
    "User.removeContacts" |

    "Chat.getInfo" |
    "Chat.sendMessage" |
    "Chat.getMessageHistory"

export type ClientEvent = 
    "Client.onMessage"
