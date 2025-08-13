let chats = [];

export const getAllChats = (req, res) => {
    console.log('Getting all chats, total:', chats.length);
    res.json(chats);
};

export const addChat = (req, res) => {
    const { body } = req.body;
    const { user } = req;
    const newMessage = { 
        id: Date.now() + Math.random(), // Уникальный ID
        username: user.username, 
        body,
        timestamp: new Date().toISOString()
    };
    chats.push(newMessage);
    console.log('New message added:', newMessage.username, ':', newMessage.body, '| Total messages:', chats.length);
    res.status(201).json({ 
        message: 'Message sent',
        chat: newMessage
    });
};