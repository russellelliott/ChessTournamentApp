// Home.js
import React from "react";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";

const auth = getAuth();

function Home() {

    return (
        <div className="App">
            <h1>Welcome to the Homepage!</h1>
        </div>
    );
}

export default Home;
