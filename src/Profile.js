import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { uid } = useParams(); // Get the UID from the route
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const [profileData, setProfileData] = useState(null);
    const [editableFields, setEditableFields] = useState({});
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.admin || false);
                    setIsCurrentUser(user.uid === uid);
                }
            }

            // Fetch the profile data for the user whose profile is being viewed
            const profileDoc = await getDoc(doc(db, "users", uid));
            if (profileDoc.exists()) {
                setProfileData(profileDoc.data());
            } else {
                // If the user doesn't have any data, initialize an empty profile
                setProfileData({
                    major: '',
                    enrollmentType: '',
                    yearEnrolled: '',
                    chessUsername: '',
                    lichessUsername: '',
                    fideId: '',
                    discordUsername: '',
                });
            }

            setLoading(false);
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchProfileData(user);
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [uid, db, auth]);

    useEffect(() => {
        // Open all editable fields for new users (when profileData is initialized)
        if (profileData && Object.keys(profileData).length === 0) {
            setEditableFields({
                major: true,
                enrollmentType: true,
                yearEnrolled: true,
                chessUsername: true,
                lichessUsername: true,
                fideId: true,
                discordUsername: true,
            });
        }
    }, [profileData]);

    const handleEditToggle = (field) => {
        setEditableFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleFieldChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (field) => {
        try {
            // Only allow update if the current user is the profile owner or an admin
            if (isCurrentUser || isAdmin) {
                if (field === 'enrollmentType' && profileData.enrollmentType === 'default') {
                    alert("Please select a valid enrollment type.");
                    return; // Prevent form submission
                }

                await setDoc(doc(db, "users", uid), {
                    [field]: profileData[field],
                }, { merge: true });
                alert(`${field} updated successfully!`);
            } else {
                alert("You do not have permission to update this profile.");
            }

            handleEditToggle(field); // Exit edit mode
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`An error occurred while updating ${field}. Please try again.`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Profile</h2>
            {profileData && (
                <div>
                    {/* Major */}
                    <div>
                        <label>Major:</label>
                        {!editableFields.major ? (
                            <div>
                                <span>{profileData.major || 'N/A'}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('major')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={profileData.major}
                                    onChange={(e) => handleFieldChange('major', e.target.value)}
                                />
                                <button onClick={() => handleSubmit('major')}>Done</button>
                                <button onClick={() => handleEditToggle('major')}>Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* Enrollment Type */}
                    <div>
                        <label>Undergrad/Grad:</label>
                        {!editableFields.enrollmentType ? (
                            <div>
                                <span>{profileData.enrollmentType === '' ? 'Please select...' : profileData.enrollmentType}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('enrollmentType')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <select
                                    value={profileData.enrollmentType || ''}
                                    onChange={(e) => handleFieldChange('enrollmentType', e.target.value)}
                                >
                                    <option value="" disabled>Please select...</option>
                                    <option value="undergrad">Undergrad</option>
                                    <option value="grad">Grad</option>
                                </select>
                                <button onClick={() => handleSubmit('enrollmentType')}>Done</button>
                                <button onClick={() => handleEditToggle('enrollmentType')}>Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* Year Enrolled */}
                    <div>
                        <label>Year Enrolled:</label>
                        {!editableFields.yearEnrolled ? (
                            <div>
                                <span>{profileData.yearEnrolled || 'N/A'}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('yearEnrolled')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <select
                                    value={profileData.yearEnrolled || ''} // Set to empty string initially
                                    onChange={(e) => handleFieldChange('yearEnrolled', e.target.value)}
                                >
                                    <option value="" disabled>Select Year Enrolled</option> {/* Default prompt option */}
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5+">5+</option>
                                </select>
                                <button onClick={() => handleSubmit('yearEnrolled')}>Done</button>
                                <button onClick={() => handleEditToggle('yearEnrolled')}>Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* Chess.com Username */}
                    <div>
                        <label>Chess.com Username:</label>
                        {!editableFields.chessUsername ? (
                            <div>
                                <span>{profileData.chessUsername || 'N/A'}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('chessUsername')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={profileData.chessUsername}
                                    onChange={(e) => handleFieldChange('chessUsername', e.target.value)}
                                />
                                <button onClick={() => handleSubmit('chessUsername')}>Done</button>
                                <button onClick={() => handleEditToggle('chessUsername')}>Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* Lichess Username */}
                    <div>
                        <label>Lichess Username:</label>
                        {!editableFields.lichessUsername ? (
                            <div>
                                <span>{profileData.lichessUsername || 'N/A'}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('lichessUsername')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={profileData.lichessUsername}
                                    onChange={(e) => handleFieldChange('lichessUsername', e.target.value)}
                                />
                                <button onClick={() => handleSubmit('lichessUsername')}>Done</button>
                                <button onClick={() => handleEditToggle('lichessUsername')}>Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* FIDE ID */}
                    <div>
                        <label>FIDE ID:</label>
                        {!editableFields.fideId ? (
                            <div>
                                <span>{profileData.fideId || 'N/A'}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('fideId')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={profileData.fideId}
                                    onChange={(e) => handleFieldChange('fideId', e.target.value)}
                                />
                                <button onClick={() => handleSubmit('fideId')}>Done</button>
                                <button onClick={() => handleEditToggle('fideId')}>Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* Discord Username */}
                    <div>
                        <label>Discord Username:</label>
                        {!editableFields.discordUsername ? (
                            <div>
                                <span>{profileData.discordUsername || 'N/A'}</span>
                                {(isCurrentUser || isAdmin) && <button onClick={() => handleEditToggle('discordUsername')}>Edit</button>}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={profileData.discordUsername}
                                    onChange={(e) => handleFieldChange('discordUsername', e.target.value)}
                                />
                                <button onClick={() => handleSubmit('discordUsername')}>Done</button>
                                <button onClick={() => handleEditToggle('discordUsername')}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
