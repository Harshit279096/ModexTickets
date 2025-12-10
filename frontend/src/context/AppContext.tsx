import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface Show {
    id: number;
    name: string;
    startTime: string;
    totalSeats: number;
    price: number;
}

interface AuthContextType {
    user: { id: string; name: string; role: 'admin' | 'user' } | null;
    login: (role: 'admin' | 'user') => void;
    logout: () => void;
}

interface DataContextType {
    shows: Show[];
    refreshShows: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ id: string; name: string; role: 'admin' | 'user' } | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(false);

    const login = (role: 'admin' | 'user') => {
        setUser({
            id: role === 'admin' ? 'admin-123' : `user-${Math.floor(Math.random() * 1000)}`,
            name: role === 'admin' ? 'Admin User' : 'Guest User',
            role
        });
    };

    const logout = () => setUser(null);

    const refreshShows = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/shows`);
            setShows(res.data);
        } catch (error) {
            console.error("Failed to fetch shows", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshShows();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <DataContext.Provider value={{ shows, refreshShows, loading }}>
                {children}
            </DataContext.Provider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AppProvider");
    return context;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within AppProvider");
    return context;
};
