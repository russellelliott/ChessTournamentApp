// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';
import SignIn from './SignIn';
import Home from './Home';
import Profile from './Profile'; // Import Profile component

function App() {
    const [user, setUser] = useState(null); // State to track user

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleLogout = async () => {
        const auth = getAuth();
        await signOut(auth);
        window.location.pathname = "/"; // Redirect to homepage after signing out
    };

    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/profile">Profile</Link> {/* Link to Profile page */}
                        <button onClick={handleLogout}>Sign Out</button>
                    </>
                ) : (
                    <Link to="/signin">Sign In</Link>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} /> {/* Route for Profile page */}
            </Routes>
        </Router>
    );
}

export default App;
