// client/src/App.jsx
import {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/message')
            .then(res => res.json())
            .then(data => setMessage(data.message));
    }, []);

    return (
        <div>
            <h1>Demo App of React & Node.js</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
