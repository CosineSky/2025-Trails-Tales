import '../../LoginRegister.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {message} from "antd";


/*
    Server IP
 */
// TODO - dev/prod env switching.
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
            message.error('密码和确认密码不匹配！');
            return;
        }

        const res = await fetch(`http://${HOST_IP}:5000/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });

        if (res.status === 200) {
            message.success('注册成功，已跳转到登录页面！');
            navigate('/login');
        }
    };


    return (
        <div className="login-bg-wrapper">
            <div className="login-wrapper">
                <form className="login">
                    <p className="title">Register</p>

                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path
                            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>

                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-shield-check-icon lucide-shield-check"><path
                            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path
                            d="m9 12 2 2 4-4"/></svg>
                    </span>

                    <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-shield-check-icon lucide-shield-check"><path
                            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path
                            d="m9 12 2 2 4-4"/></svg>
                    </span>

                    {/* 角色选择下拉菜单 */}
                    <hr/>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <svg style={{margin: '18px 10px 0 0'}}
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-user-round-pen-icon lucide-user-round-pen">
                            <path d="M2 21a8 8 0 0 1 10.821-7.487"/>
                            <path
                                d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
                            <circle cx="10" cy="8" r="5"/>
                        </svg>
                        <select
                            className="custom-select"
                            onChange={e => setRole(e.target.value)}
                            value={role}
                        >
                            <option value={1}>Reviewer</option>
                            <option value={2}>Admin</option>
                        </select>
                    </div>
                    <br/>

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
