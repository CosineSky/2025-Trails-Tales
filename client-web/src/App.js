// client/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from './pages/NotFound/NotFound';

import './App.css';



function App() {
    return (
        <div className="app-wrapper">
            <BrowserRouter>
                {/*<nav>*/}
                {/*    <Link to="/">Home</Link> | <Link to="/about">About</Link>*/}
                {/*</nav>*/}
                {/*<hr />*/}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* 404 fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
