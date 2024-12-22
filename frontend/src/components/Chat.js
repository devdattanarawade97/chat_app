import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../socket'; // Assuming socket is configured and exported
import './Chat.css';  // Import the CSS file

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name;

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);


  
  useEffect(() => {
    if (!name) {
      navigate('/');
      return;
    }

    socket.emit('join', name); // Emit 'join' event when user joins

    // Handle user list update
    const handleUpdateUserList = (userList) => {
        setUsers(userList.filter((user) => user.username !== name)); // Exclude current user
    };

    // Handle incoming messages
    const handleReceiveMessage = ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    };

    // Listen for updates to user list and new messages
    socket.on('updateUserList', handleUpdateUserList);
    socket.on('receiveMessage', handleReceiveMessage);

    // Cleanup on unmount
    return () => {
      socket.off('updateUserList', handleUpdateUserList);
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [name, navigate]);

  const handleSendMessage = () => {
    if (currentMessage.trim() && selectedUser) {
      socket.emit('sendMessage', {
        sender: name,
        recipient: selectedUser.id,
        message: currentMessage,
      });
      setMessages((prev) => [...prev, { sender: 'You', message: currentMessage }]);
      setCurrentMessage('');
    }
  };

  const handleLogout = () => {
    socket.emit('logout'); // You can handle logout events in socket.io as needed
    navigate('/'); // Navigate to the home screen
  };

  return (
    <div className="chat-container">
      <div className="users-list">
        <h3>Online Users</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-box">
        <div className="chat-header">
          <h3>Chat with {selectedUser?.username || '...'}</h3>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="message-input"
            disabled={!selectedUser}
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
            disabled={!selectedUser}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
