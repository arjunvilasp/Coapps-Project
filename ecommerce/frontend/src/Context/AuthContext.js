import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
    const [location,setLocation] = useState('');


    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
    };

    const logout = () => {
        setAuthToken('');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout, setLocation, location }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
