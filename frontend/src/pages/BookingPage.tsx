import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import SeatGrid from '../components/SeatGrid';
import { Clock, Calendar } from 'lucide-react';

interface Seat {
    id: number;
    row: string;
    number: number;
    status: string;
}

interface ShowDetail {
    id: number;
    name: string;
    startTime: string;
    price: number;
    seats: Seat[];
}

const BookingPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [show, setShow] = useState<ShowDetail | null>(null);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const fetchShowDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3000/api/shows/${id}`);
            setShow(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to load show details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShowDetails();
        // Optional: Poll for updates every 5 seconds
        const interval = setInterval(fetchShowDetails, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const toggleSeat = (seatId: number) => {
        setSelectedSeatIds(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const handleBooking = async () => {
        if (!user) {
            alert('Please login as User first (Home Page -> User Login)');
            return;
        }

        setBookingStatus('processing');
        setErrorMsg('');

        try {
            await axios.post('http://localhost:3000/api/bookings', {
                userId: user.id,
                showId: Number(id),
                seatIds: selectedSeatIds
            });

            setBookingStatus('success');
            setSelectedSeatIds([]);
            fetchShowDetails(); // Refresh to show booked status
            setTimeout(() => navigate('/shows'), 2000); // Redirect after success
        } catch (error: any) {
            console.error(error);
            setBookingStatus('failed');
            setErrorMsg(error.response?.data?.error || 'Booking failed. Seats might have been taken.');
            fetchShowDetails(); // Refresh to see taken seats
        }
    };

    if (loading && !show) return <div className="page-container glass-panel" style={{ margin: '20px' }}>Loading...</div>;
    if (!show) return <div className="page-container">Show not found</div>;

    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98)), url(https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2069&auto=format&fit=crop)',
            backgroundSize: 'cover',
        }}>
            <div style={{ maxWidth: '1000px', margin: '2rem auto', width: '95%', display: 'flex', gap: '2rem', flexDirection: 'column' }}>

                {/* Header Info */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{show.name}</h1>
                        <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(show.startTime).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Price</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>${(selectedSeatIds.length * show.price).toFixed(2)}</p>
                    </div>
                </div>

                {/* Dynamic Status Message */}
                {bookingStatus === 'success' && (
                    <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', textAlign: 'center' }}>
                        Booking Confirmed! Redirecting...
                    </div>
                )}
                {bookingStatus === 'failed' && (
                    <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                {/* Main Content: Seat Grid */}
                <div className="glass-panel" style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <SeatGrid seats={show.seats} selectedSeatIds={selectedSeatIds} onToggleSeat={toggleSeat} />
                </div>

                {/* Action Bar */}
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', bottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
                    <div>
                        <p style={{ color: '#94a3b8' }}>Selected: <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedSeatIds.length} seats</span></p>
                    </div>
                    <button
                        className="btn-primary"
                        disabled={selectedSeatIds.length === 0 || bookingStatus === 'processing'}
                        onClick={handleBooking}
                        style={{ padding: '1rem 3rem', opacity: selectedSeatIds.length === 0 ? 0.5 : 1 }}
                    >
                        {bookingStatus === 'processing' ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BookingPage;
