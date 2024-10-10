import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config"; // Ensure this import points to your Firebase config
import { getDoc } from "firebase/firestore"; // Import getDoc

const SignIn = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user; // Extract user from userCredential
            const email = user.email;
            const photoURL = user.photoURL; // Extract the user's profile photo URL

            // Check if the email ends with '@ucsc.edu'
            if (true /*email.endsWith('@ucsc.edu')*/) {
                const userDocRef = doc(db, "users", user.uid); // Reference to the user document

                // Check if the user already exists
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    // If the user does not exist, create a new user entry
                    await setDoc(userDocRef, {
                        email: user.email,
                        uid: user.uid,
                        name: user.displayName || "", // Optional: Add display name
                        photoURL: photoURL || "", // Store the photo URL
                        admin: false // Optional: Set admin status as needed
                    });
                    console.log("New user created:", user.email);
                    // Redirect new users to their unique profile page
                    navigate(`/profile/${user.uid}`);
                } else {
                    console.log("User already registered:", user.email);
                    navigate("/"); // Redirect to the home page for existing users
                }
            } else {
                // Handle the case where the email domain is not allowed
                alert("Only UCSC accounts are allowed to sign in. Please use a ucsc.edu email.");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            alert("An error occurred during sign-in. Please try again.");
        }
    };

    return (
        <div className="sign-in">
            <h2>Sign in with Google</h2>
            <button onClick={signInWithGoogle}>Sign In with Google</button>
        </div>
    );
};

export default SignIn;
