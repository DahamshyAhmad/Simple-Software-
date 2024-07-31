import React from 'react';

const Navbar = ({ user, onLogin, onSignUp, onLogout }) => {
    return (
        <nav style={styles.navbar}>
            <h1 style={styles.title}>Welcome To AEJ Notes !!</h1>
            <div>
                {user ? (
                    <>
                        <span style={styles.username}>{user.email}</span>
                        <button style={styles.button} onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button style={styles.button} onClick={onLogin}>Login</button>
                        <button style={styles.button} onClick={onSignUp}>Sign Up</button>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#282c34',
        color: 'white'
    },
    title: {
        margin: 0,
        color: '#61dafb',
        fontWeight: 'bold'

    },
    username: {
        marginRight: '20px',
        color: '#61dafb',
        fontWeight: 'bold'
    },
    button: {
        margin: '0 10px',
        padding: '10px 20px',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#282c34',
        fontWeight: 'bold'
    }
};

export default Navbar;
