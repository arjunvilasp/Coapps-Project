import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', location: '', address: '', pincode: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post('http://localhost:8000/api/register/', formData,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' 
                }
            });
            // console.log('Registration successful:', response.data);
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            console.error('Error registering:', error.response.data);
            setError(error.response.data.detail || 'An error occurred during registration.');
        }
    };
    return (
        <div className="main-register-container">
            <div className="register-container">
                <div className='left-section'>
                    <img src='https://media.wired.com/photos/5c9040ee4950d24718d6da99/1:1/w_1800,h_1800,c_limit/shoppingcart-1066110386.jpg' alt='img'/>
                </div>
                <div className="right-section">
                    <div className="register-form">
                        <h2>Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <textarea type="text" id="address" name="address" value={formData.address} cols={5} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pincode">Pincode:</label>
                                <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn-register" disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                            {error && <div className="error-message">{error}</div>}
                        </form>
                        <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
