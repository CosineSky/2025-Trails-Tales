import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
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
                <Routes>
                    {/* Setting /login as default route. */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* All routes. */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* 404 fallback. */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default App;
