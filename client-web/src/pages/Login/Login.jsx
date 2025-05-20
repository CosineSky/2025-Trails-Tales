import '../../LoginRegister.css';
import {jwtDecode} from 'jwt-decode';
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {message} from "antd";
import {_HOST_IP, _HOST_PORT} from "../../config";
import logo from "../../assets/images/logo.png";


/*
    Server IP
 */
const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        if (res.status === 200) {
            const {token} = await res.json();
            if (!token) {
                return null;
            }
            try {
                const decodedToken = jwtDecode(token);
                localStorage.setItem('username', decodedToken.username);
                localStorage.setItem('role', decodedToken.role);
            } catch (err) {
                console.error('Failed to decode token:', err);
                return null;
            }
            message.success('登录成功！');
            navigate('/home');
        }
        else if (res.status === 401) {
            message.error('用户名或密码错误！');
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
                    <input type="text" placeholder="请输入用户名..." onChange={e => setUsername(e.target.value)}/>
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path
                            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>

                    <input type="password" placeholder="请输入密码..." onChange={e => setPassword(e.target.value)}/>
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-shield-check-icon lucide-shield-check"><path
                            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path
                            d="m9 12 2 2 4-4"/></svg>
                    </span>

                    <Link to="/reset">忘记密码？</Link><br/>
                    <span className="info">还没有账户？没关系， </span>
                    <Link to="/register">点击注册！</Link>
                    <button onClick={handleLogin}>
                        <i className="spinner"></i>
                        <span className="state">登录</span>
                    </button>
                </form>
            </div>
        </div>
    );

}