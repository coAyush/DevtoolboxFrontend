import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePrivateApi } from '../../api/axiosInstance';

const UserDetailsContext = createContext(null);

export const UserDetailsProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!user) {
            usePrivateApi.get("/users/dashboard")
                .then(res => {
                    if (isMounted && res && res.data) {
                        setUser(res.data);
                    }
                })
                .catch(err => {
                    console.warn("Could not pre-fetch user details in layout:", err);
                })
                .finally(() => {
                    if (isMounted) setLoading(false);
                });
        } else {
            setLoading(false);
        }
        return () => {
            isMounted = false;
        };
    }, [user]);

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
