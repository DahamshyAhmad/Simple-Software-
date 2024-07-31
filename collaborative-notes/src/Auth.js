import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Auth = ({ mode, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const auth = getAuth(); // יצירת מופע auth

    const handleAction = async () => {
        try {
            if (mode === 'login') {
                await signInWithEmailAndPassword(auth, email, password); // שימוש נכון בפונקציה
                setMessage('Logged in successfully!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password); // שימוש נכון בפונקציה
                setMessage('Signed up successfully!');
            }
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 2000);
        } catch (error) {
            console.error(`Error during ${mode}`, error);
            setMessage(`Error during ${mode}: ${error.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={styles.input}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={styles.input}
            />
            <button onClick={handleAction} style={styles.button}>
                {mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
            <button onClick={onClose} style={styles.button}>Close</button>
            {message && <div style={styles.message}>{message}</div>}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        margin: '20px auto',
        maxWidth: '400px'
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    button: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    message: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
        borderRadius: '5px',
        width: '100%',
        textAlign: 'center'
    }
};

export default Auth;
