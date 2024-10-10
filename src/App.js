import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config'; // Import Firestore config
import './App.css';
import SignIn from './SignIn';
import Home from './Home';
import Profile from './Profile'; // Import Profile component
import AdminPage from './AdminPage'; // Import AdminPage component

function App() {
    const [user, setUser] = useState(null); // State to track user
    const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Update user state

                // Check if the current user is an admin
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists() && userDoc.data().admin) {
                    setIsAdmin(true); // Set admin state to true if user is admin
                } else {
                    setIsAdmin(false); // Set admin state to false if user is not an admin
                }
            } else {
                setUser(null); // No user is logged in
                setIsAdmin(false); // Reset admin state
            }
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
                        <Link to={`/profile/${user.uid}`}>Profile</Link> {/* Link to the specific user's profile page */}
                        {isAdmin && <Link to="/admin">Admin</Link>} {/* Link to Admin page (visible only if user is admin) */}
                        <button onClick={handleLogout}>Sign Out</button>
                    </>
                ) : (
                    <Link to="/signin">Sign In</Link>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile/:uid" element={<Profile />} /> {/* Route for the Profile page with UID */}
                <Route path="/admin" element={<AdminPage />} /> {/* Route for Admin page */}
            </Routes>
        </Router>
    );
}

export default App;
