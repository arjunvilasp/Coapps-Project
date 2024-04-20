// Login.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const navigate = useNavigate() 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', formData);
            const { token } = response.data;
            login(token);
            console.log('Login successful');
            navigate('/')
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };
    

    return (
        <div className='main-login-container'>
        <div className="login-container">
        <div className="left-section">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn-login">Login</button>
                </form>
                <p className="register-link">Don't have an account? <Link to="/register">Register</Link></p>
            </div>
            </div>
            <div className='right-section'>
                <img src='https://media.wired.com/photos/5c9040ee4950d24718d6da99/1:1/w_1800,h_1800,c_limit/shoppingcart-1066110386.jpg' alt='img'/>
            </div>
        </div>
        </div>
    );
};

export default Login;
