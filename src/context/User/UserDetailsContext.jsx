import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePrivateApi } from '../../api/axiosInstance';

const UserDetailsContext = createContext(null);

export const UserDetailsProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    return (
        <UserDetailsContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </UserDetailsContext.Provider>
    )
};

export const useUserDetails = () => {
    const context = useContext(UserDetailsContext)
    if (!context) {
        throw new Error("userDetails must be used withing UserDetailsContext")
    }
    return context;
}
