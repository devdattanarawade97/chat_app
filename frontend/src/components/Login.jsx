import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Import the CSS file

function Login() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (name.trim()) {
            navigate('/chat', { state: { name } });
        }
    };

    return (
        <div className="login-container">
                   <h1 className="App-title">Chat-App</h1>
          
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    Join Chat
                </button>
            </form>
        </div>
    );
}

export default Login;
