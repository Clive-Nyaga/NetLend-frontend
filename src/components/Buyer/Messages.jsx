import { useState, useEffect } from 'react';

const Messages = ({ buyerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    // Mock data for now
    setMessages([
      {
        id: 1,
        lender_name: 'ABC Bank',
        last_message: 'Your application is under review'
      }
    ]);
  }, [buyerId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    alert('Message sent!');
    setNewMessage('');
  };

  return (
    <div>
      <h3>Messages</h3>
      
      <div className="messages-container">
        <div className="conversations-list">
          {messages.map(conversation => (
            <div 
              key={conversation.id} 
              className={`conversation ${selectedConversation === conversation.id ? 'active' : ''}`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <h4>{conversation.lender_name}</h4>
              <p>{conversation.last_message}</p>
            </div>
          ))}
        </div>
        
        {selectedConversation && (
          <div className="message-thread">
            <div className="message-input">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
      
      {messages.length === 0 && (
        <p>No messages yet. Apply for loans to start conversations with lenders.</p>
      )}
    </div>
  );
};

export default Messages;