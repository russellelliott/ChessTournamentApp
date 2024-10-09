// Login.js
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function Login() {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in:", user.email);
            } else {
                console.log("User is signed out");
            }
        });

        return () => unsubscribe();
    }, []);

    // Function to login existing user
    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            console.log("User logged in");
            window.location.pathname = "/"; // Redirect to homepage
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    return (
        <div className="App">
            <h3>Login</h3>
            <input
                placeholder="Email..."
                onChange={(event) => { setLoginEmail(event.target.value); }}
            />
            <input
                placeholder="Password..."
                type="password"
                onChange={(event) => { setLoginPassword(event.target.value); }}
            />
            <button onClick={login}>Login</button>
        </div>
    );
}

export default Login;
