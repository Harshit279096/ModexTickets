import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/AppContext';
import { Calendar, Clock, Ticket } from 'lucide-react';

const ShowsList: React.FC = () => {
    const { shows, loading } = useData();

    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url(https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
        }}>
            <div style={{ maxWidth: '1200px', margin: '4rem auto', width: '90%' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Available Shows</h1>

                {loading ? (
                    <p>Loading shows...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {shows.map(show => (
                            <div key={show.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>{show.name}</h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                                    <Calendar size={16} />
                                    <span>{new Date(show.startTime).toLocaleDateString()}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                                    <Clock size={16} />
                                    <span>{new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
                                    <Ticket size={16} />
                                    <span>${show.price}</span>
                                </div>

                                <Link to={`/booking/${show.id}`} style={{ marginTop: 'auto' }}>
                                    <button className="btn-primary" style={{ width: '100%' }}>
                                        Select Seats
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowsList;
