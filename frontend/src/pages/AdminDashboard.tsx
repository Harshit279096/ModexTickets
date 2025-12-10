import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        totalSeats: 50,
        price: 100
    });

    if (user?.role !== 'admin') {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2>Access Denied</h2>
                    <p>You must be an admin to view this page.</p>
                    <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>Go Home</button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/admin/shows', formData);
            toast.success('Show created successfully!');
            // Reset form
            setFormData({ name: '', startTime: '', totalSeats: 50, price: 100 });
            // Redirect to home/shows after short delay
            setTimeout(() => navigate('/shows'), 1500);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create show.');
        }
    };

    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url(https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop)',
            backgroundSize: 'cover'
        }}>
            <div style={{ maxWidth: '800px', margin: '4rem auto', width: '90%' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Admin Dashboard</h1>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Create New Show</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Show Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                placeholder="e.g. Avengers: Secret Wars"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    value={formData.price || ''}
                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    required
                                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Total Seats</label>
                            <input
                                type="number"
                                value={formData.totalSeats || ''}
                                onChange={e => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                            Create Show
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
