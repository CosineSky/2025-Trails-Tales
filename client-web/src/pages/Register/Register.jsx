// src/pages/Register.jsx
import './Register.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords don\'t match!');
            return;
        }

        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.status === 200) {
            navigate('/login');
        }
    };

    return (
        <div className="register-bg-wrapper">
            <div className="register-wrapper">
                <form className="login">
                    <p className="title">Register</p>
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                    <i className="fa fa-user"></i>
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    <i className="fa fa-key"></i>
                    <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)}/>
                    <i className="fa fa-key"></i>

                    <span className="info">Already have an account? </span>
                    <Link to="/login">Log in!</Link>
                    <button onClick={handleRegister}>
                        <i className="spinner"></i>
                        <span className="state">Register</span>
                    </button>
                </form>
            </div>
        </div>
    );
}