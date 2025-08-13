let chats = [];

export const getAllChats = (req, res) => {
    res.json(chats);
};

export const addChat = (req, res) => {
    const { body } = req.body;
    const { user } = req;
    const newMessage = { 
        username: user.username, 
        body,
        timestamp: new Date().toISOString()
    };
    chats.push(newMessage);
    res.status(201).json({ 
        message: 'Message sent',
        chat: newMessage
    });
};