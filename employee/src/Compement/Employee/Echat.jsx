import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/chat.css'; 
import axios from 'axios';

const socket = io('http://localhost:3001'); 
const App = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);
    axios.defaults.withCredentials = true;

    useEffect(() => {
     
      axios.get('http://localhost:3000/employee/user')
          .then(response => {
              if (response.data.Status) {
                  setUser(response.data.user);
              } else {
                 
              }
          })
          .catch(() => {
            
          });

     
      fetch('http://localhost:3000/chat/history', {
          credentials: 'include'
      })
          .then(response => response.json())
          .then(data => {
            if (data.Status) {
                setMessages(data.messages);
            }
        });
     
      socket.on('receiveMessage', (message) => {
        console.log('Received message:', message); 
        setMessages((prevMessages) => [...prevMessages, message]);
    });

      return () => {
          socket.off('receiveMessage');
      };
  }, []);
  useEffect(() => {
   
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
}, [messages]);

  const sendMessage = () => {
      if (message.trim()) {
          socket.emit('sendMessage', { content: message, senderId: user.name });
          setMessage('');
      }
  };
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card chat-card">
                        <div className="card-header text-center">
                            <h4>Chat</h4>
                        </div>
                        <div className="card-body chat-body">
                            <ul className="list-group list-group-flush">
                                {messages.map((msg, index) => (
                                    <li key={index} className={`list-group-item ${msg.senderId === user.name ? 'sender' : 'receiver'}`}>
                                        <span className="message-sender">{msg.senderId}:</span>
                                        {msg.content}
                                    </li>
                                ))}
                                 <div ref={messagesEndRef} />
                            </ul>
                        </div>
                        <div className="card-footer">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" onClick={sendMessage}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;