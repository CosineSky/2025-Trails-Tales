import '../../LoginRegister.css';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {message} from "antd";
import {_HOST_IP, _HOST_PORT} from "../../config";
import logo from '../../assets/images/logo.png';


/*
    Server IP
 */
const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(1);


    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            message.error('密码和确认密码不匹配！');
            return;
        }
        if (password.length < 6 || password.length > 32) {
            message.error('密码长度必须在6到32字符之间！');
            return;
        }
        if (username.length > 16) {
            message.error('用户名长度不能超过16个字符！');
            return;
        }

        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });

        if (res.status === 200) {
            message.success('注册成功，已跳转到登录页面！');
            navigate('/login');
        }
        else if (res.status === 400) {
            message.error('用户名已经存在！');
        }
        else if (res.status === 500) {
            message.error('服务器出现未知错误！');
        }
    };


    return (
        <div className="login-bg-wrapper">
            <div className="login-wrapper">
                <form className="login">
                    <div className="login-title-box">
                        <img src={logo} alt="logo" className="logo-img" />
                        <span className="title">Trails & Tales 审核管理系统</span>
                    </div>
                    <input type="text" placeholder="请输入用户名..." onChange={e => setUsername(e.target.value)} />
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path
                            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>

                    <input type="password" placeholder="请输入密码..." onChange={e => setPassword(e.target.value)} />
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-shield-check-icon lucide-shield-check"><path
                            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path
                            d="m9 12 2 2 4-4"/></svg>
                    </span>

                    <input type="password" placeholder="请输入确认密码..." onChange={e => setConfirmPassword(e.target.value)} />
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
                            <option value={1}>审核人员</option>
                            <option value={2}>管理员</option>
                        </select>
                    </div>
                    <br/>

                    <span className="info">已经拥有账户？</span>
                    <Link to="/login">点击登录！</Link>
                    <button onClick={handleRegister}>
                        <i className="spinner"></i>
                        <span className="state">注册</span>
                    </button>
                </form>
            </div>
        </div>

    );
}
