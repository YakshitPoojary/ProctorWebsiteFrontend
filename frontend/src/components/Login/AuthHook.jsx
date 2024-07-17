import React, { createContext, useState, useEffect } from 'react';
import AuthService from './Authenticate';

const AuthContext = createContext();

const AuthHook = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthHook, AuthContext };
