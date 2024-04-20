import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './Profile.css'
import { Link } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const {authToken, setLocation} = useContext(AuthContext);

    useEffect(() => {
         
        if (authToken) {
            const fetchProfileData = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/profile/', {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    setUserData(response.data);
                    setLocation(response.data.location);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            };
            fetchProfileData();
        }
    }, []);

    return (
        <>
        <Link to={'/'} className='home-btn'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
        <div className="profile-container">
            <h1>Profile Page</h1>
            {userData ? (
                <div className="user-details">
                    <p>Name: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    <p>Address: {userData.address}</p>
                    <p>Location:{userData.location}</p>
                    <p>Pincode:{userData.pincode}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
        </>
    );
};

export default Profile;
