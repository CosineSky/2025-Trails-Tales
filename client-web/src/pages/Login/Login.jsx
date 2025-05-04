// src/pages/Login.jsx
import './Login.css';
import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.status === 200) {
            const { token } = await res.json();
            if (!token) {
                return null;
            }
            try {
                const decodedToken = jwtDecode(token);
                localStorage.setItem('username', decodedToken.username);
                localStorage.setItem('role', decodedToken.role);
            } catch (error) {
                console.error('Failed to decode token:', error);
                return null;
            }
            navigate('/home');
        }

    };

    return (
        <div className="login-bg-wrapper">
            <div className="login-wrapper">
                <form className="login">
                    <p className="title">Log in</p>
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                    <i className="fa fa-user"></i>
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    <i className="fa fa-key"></i>
                    <Link to="/reset">Forgot your password?</Link><br/>
                    <span className="info">Don't have an account? </span>
                    <Link to="/register">Register one!</Link>
                    <button onClick={handleLogin}>
                        <i className="spinner"></i>
                        <span className="state">Log in</span>
                    </button>
                </form>
            </div>
        </div>
    );
}