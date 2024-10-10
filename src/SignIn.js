// SignIn.js
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config"; // Ensure this import points to your Firebase config

const SignIn = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user; // Extract user from userCredential
      const email = user.email;

      // Check if the email ends with '@ucsc.edu'
      if (email.endsWith('@ucsc.edu')) {
        // Add user to Firestore collection 'users'
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
          name: user.displayName || "", // Optional: Add display name
          admin: false // Optional: Set admin status as needed
        });
        console.log("User data added to Firestore");
        navigate("/"); // Redirect to the home page
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
