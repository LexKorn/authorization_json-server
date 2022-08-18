import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);

    const login = useCallback(id => {
        setUserId(id);

        localStorage.setItem(storageName, JSON.stringify({
            userId: id
        }))
    }, []);

    const logout = useCallback(() => {
        setUserId(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data) {
            login(data.userId);
        }
        setReady(true);
    }, [login]);


    return { login, logout, userId, ready };
}