export type CallMethod = 
    "User.auth" |
    "User.register" |
    "User.login" |
    "User.refreshAccessToken" |

    "User.setAvatar" |
    "User.updateProfile" |
    "User.getMyInfo" |

    "User.getInfo" |

    "User.getMyContacts" |
    "User.addContact" |
    "User.removeContacts" |

    "User.getMyRecentChats" | 

    "Chat.getInfo" |

    "Chat.createGroup" |

    "Chat.getIdForPrivate" |
    "Chat.getAnotherUserIdFromPrivate" |

    "Chat.sendMessage" |
    "Chat.getMessageHistory" |

    "Chat.uploadFile"

export type ClientEvent = 
    "Client.onMessage"

export const CallableMethodBeforeAuth = [
    "User.auth",
    "User.register",
    "User.login",
    "User.refreshAccessToken",
]