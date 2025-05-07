// src/pages/Register.jsx
import './Register.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const HOST_IP = '115.175.40.241';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(1); // 默认角色是“审核人员”

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords don\'t match!');
            return;
        }

        const res = await fetch(`http://${HOST_IP}:5000/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }), // 添加角色信息到请求体
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
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <i className="fa fa-user"></i>
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <i className="fa fa-key"></i>
                    <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
                    <i className="fa fa-key"></i>

                    {/* 角色选择下拉菜单 */}
                    <select onChange={e => setRole(e.target.value)} value={role}>
                        <option value={1}>审核人员</option>
                        <option value={2}>管理员</option>
                    </select><br/>

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
