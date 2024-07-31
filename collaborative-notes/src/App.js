import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Auth from './Auth';
import Notes from './Notes';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function App() {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLoginClick = () => {
        setAuthMode('login');
        setShowAuth(true);
    };

    const handleSignUpClick = () => {
        setAuthMode('signup');
        setShowAuth(true);
    };

    const handleLogoutClick = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            setUser(null);
        }).catch((error) => {
            console.error('Error during sign out', error);
        });
    };

    const handleAuthClose = () => {
        setShowAuth(false);
    };

    return (
        <div className="App">
            <Navbar
                user={user}
                onLogin={handleLoginClick}
                onSignUp={handleSignUpClick}
                onLogout={handleLogoutClick}
            />
            {showAuth ? (
                <Auth mode={authMode} onClose={handleAuthClose} />
            ) : user ? (
                <Notes />
            ) : (
                <div style={styles.message}>
                    <p>Please login to add notes</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    message: {
        textAlign: 'center',
        marginTop: '50px'
    }
};

export default App;
