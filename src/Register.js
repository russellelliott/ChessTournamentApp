// Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";

function Register() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    // Function to register user
    const register = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const user = userCredential.user;

            // Add user to Firestore collection 'users'
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                uid: user.uid
            });

            console.log("User created:", user);
            alert("User created successfully!");
            window.location.pathname = "/"; // Redirect to homepage
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    return (
        <div className="App">
            <h3>Register User</h3>
            <input
                placeholder="Email..."
                onChange={(event) => { setRegisterEmail(event.target.value); }}
            />
            <input
                placeholder="Password..."
                type="password"
                onChange={(event) => { setRegisterPassword(event.target.value); }}
            />
            <button onClick={register}>Create User</button>
        </div>
    );
}

export default Register;
