import '../../LoginRegister.css';
import {jwtDecode} from 'jwt-decode';
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {message} from "antd";


/*
    Server IP
 */
// TODO - dev/prod env switching.
const HOST_IP = '115.175.40.241';


export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://${HOST_IP}:5000/api/login`, {
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

    };


    return (
        <div className="login-bg-wrapper">
            <div className="login-wrapper">
                <form className="login">
                    <p className="title">Log in</p>
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path
                            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>

                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    <span className="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-shield-check-icon lucide-shield-check"><path
                            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path
                            d="m9 12 2 2 4-4"/></svg>
                    </span>

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