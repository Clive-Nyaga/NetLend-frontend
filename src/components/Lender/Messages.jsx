import { useState, useEffect } from 'react';

const Messages = ({ lenderId }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // Mock messages data
    setMessages([
      {
        id: 1,
        from: 'John Doe',
        subject: 'Mortgage Application Inquiry',
        preview: 'I am interested in your 3BR apartment listing...',
        date: '2024-01-15',
        unread: true
      },
      {
        id: 2,
        from: 'Jane Smith',
        subject: 'Document Submission',
        preview: 'I have uploaded the required documents...',
        date: '2024-01-14',
        unread: false
      }
    ]);
  }, [lenderId]);

  return (
    <div className="section">
      <h2>Messages</h2>
      
      <div className="messages-container">
        <div className="messages-list">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message-item ${message.unread ? 'unread' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="message-header">
                <strong>{message.from}</strong>
                <span className="message-date">{message.date}</span>
              </div>
              <div className="message-subject">{message.subject}</div>
              <div className="message-preview">{message.preview}</div>
            </div>
          ))}
        </div>
        
        {selectedMessage && (
          <div className="message-detail">
            <h3>{selectedMessage.subject}</h3>
            <p><strong>From:</strong> {selectedMessage.from}</p>
            <p><strong>Date:</strong> {selectedMessage.date}</p>
            <div className="message-content">
              <p>{selectedMessage.preview}</p>
            </div>
            <button 
              className="btn" 
              onClick={() => {
                const reply = prompt(`Reply to ${selectedMessage.from}:`);
                if (reply) {
                  alert(`Message sent to ${selectedMessage.from}: "${reply}"`);
                  setSelectedMessage(null);
                }
              }}
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;