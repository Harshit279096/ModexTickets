import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AppContext';

const Home: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    Modex<span style={{ color: '#fff' }}>Tickets</span>
                </h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => { login('user'); navigate('/shows'); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        User Login
                    </button>
                    <button onClick={() => { login('admin'); navigate('/admin'); }} className="btn-primary">
                        Admin Access
                    </button>
                </div>
            </nav>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <div className="animate-fade-in">
                    <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>
                        Experience the <br />
                        <span style={{ background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Next Generation</span>
                        <br /> of Booking
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Secure, fast, and reliable ticket booking for the world's most exclusive events.
                        Powered by advanced concurrency handling.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/shows">
                            <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Play size={20} fill="currentColor" /> Book Now
                            </button>
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '5rem', width: '100%', maxWidth: '1200px' }}>
                    <FeatureCard icon={<Zap color="#f59e0b" />} title="Lightning Fast" description="Real-time seat availability with millisecond precision." />
                    <FeatureCard icon={<ShieldCheck color="#10b981" />} title="Secure Transactions" description="Advanced locking mechanisms prevent overbooking." />
                    <FeatureCard icon={<Play color="#6366f1" />} title="Premium Experience" description="Immersive UI designed for the modern web." />
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', transition: 'transform 0.3s ease' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: '#94a3b8' }}>{description}</p>
    </div>
);

export default Home;
