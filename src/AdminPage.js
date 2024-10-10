import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore"; // Added getDoc import
import { db } from './firebase-config'; // Ensure this points to your Firebase config
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Track the search query
    const auth = getAuth();
    const navigate = useNavigate();

    // Check if the current user is an admin
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists() && userDoc.data().admin) {
                    setCurrentUser(user); // Set the current logged-in user
                    fetchUsers(); // Fetch users only if the current user is an admin
                } else {
                    navigate('/'); // Redirect non-admins to home page
                }
            } else {
                navigate('/'); // Redirect if not logged in
            }
        });
    }, [auth, navigate]);

    // Fetch all users from Firestore
    const fetchUsers = async () => {
        const usersCollectionRef = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollectionRef);
        const usersList = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUsers(usersList);
    };

    // Handle promotion to admin
    const promoteToAdmin = async (userId, userName) => {
        const confirmPromotion = window.confirm(`Are you sure you want to promote ${userName} to admin?`);
        if (confirmPromotion) {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, { admin: true });
            fetchUsers(); // Refresh users after promotion
        }
    };

    // Handle demotion from admin
    const demoteToUser = async (userId, userName) => {
        const confirmDemotion = window.confirm(`Are you sure you want to demote ${userName} to a regular user?`);
        if (confirmDemotion) {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, { admin: false });
            fetchUsers(); // Refresh users after demotion
        }
    };

    // Filter users based on search query (by name or email)
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-page">
            <h2>Admin Management</h2>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            <h3>Admins</h3>
            <ul>
                {filteredUsers.filter(user => user.admin).map((user) => (
                    <li key={user.uid}>
                        {user.name} ({user.email})
                        <button onClick={() => navigate(`/profile/${user.uid}`)}>View Profile</button>
                        {/* Hide demote button if the user is the current logged-in user */}
                        {user.uid !== currentUser?.uid && (
                            <button onClick={() => demoteToUser(user.uid, user.name)}>Demote to User</button>
                        )}
                    </li>
                ))}
            </ul>

            <h3>Members</h3>
            <ul>
                {filteredUsers.filter(user => !user.admin).map((user) => (
                    <li key={user.uid}>
                        {user.name} ({user.email})
                        <button onClick={() => navigate(`/profile/${user.uid}`)}>View Profile</button>
                        {/* Hide promote button if the user is the current logged-in user */}
                        {user.uid !== currentUser?.uid && (
                            <button onClick={() => promoteToAdmin(user.uid, user.name)}>Promote to Admin</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
