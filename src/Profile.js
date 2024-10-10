// Profile.js
import React, { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const [major, setMajor] = useState('');
    const [enrollmentType, setEnrollmentType] = useState('undergrad'); // Default to undergrad
    const [yearEnrolled, setYearEnrolled] = useState('1');
    const [chessUsername, setChessUsername] = useState('');
    const [lichessUsername, setLichessUsername] = useState('');
    const [fideId, setFideId] = useState('');
    const [discordUsername, setDiscordUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();

        try {
            // Create or update user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                major,
                enrollmentType,
                yearEnrolled,
                chessUsername,
                lichessUsername,
                fideId,
                discordUsername
            }, { merge: true }); // Merge to update existing fields

            alert("Profile updated successfully!");
            navigate("/"); // Redirect to homepage
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile. Please try again.");
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Major:</label>
                    <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Undergrad/Grad:</label>
                    <select
                        value={enrollmentType}
                        onChange={(e) => setEnrollmentType(e.target.value)}
                    >
                        <option value="undergrad">Undergrad</option>
                        <option value="grad">Grad</option>
                    </select>
                </div>
                <div>
                    <label>Year Enrolled:</label>
                    <select
                        value={yearEnrolled}
                        onChange={(e) => setYearEnrolled(e.target.value)}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                    </select>
                </div>
                <div>
                    <label>Chess.com Username:</label>
                    <input
                        type="text"
                        value={chessUsername}
                        onChange={(e) => setChessUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Lichess Username:</label>
                    <input
                        type="text"
                        value={lichessUsername}
                        onChange={(e) => setLichessUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>FIDE ID:</label>
                    <input
                        type="text"
                        value={fideId}
                        onChange={(e) => setFideId(e.target.value)}
                    />
                </div>
                <div>
                    <label>Discord Username:</label>
                    <input
                        type="text"
                        value={discordUsername}
                        onChange={(e) => setDiscordUsername(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
