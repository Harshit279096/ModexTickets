import React from 'react';

interface Seat {
    id: number;
    row: string;
    number: number;
    status: string; // 'AVAILABLE' | 'BOOKED' | 'LOCKED'
}

interface SeatGridProps {
    seats: Seat[];
    selectedSeatIds: number[];
    onToggleSeat: (seatId: number) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, selectedSeatIds, onToggleSeat }) => {
    // Group seats by row
    const rows = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>);

    const sortedRows = Object.keys(rows).sort();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{
                width: '100%',
                height: '40px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
                borderRadius: '50% 50% 0 0',
                marginBottom: '2rem',
                textAlign: 'center',
                color: '#94a3b8',
                lineHeight: '40px',
                boxShadow: '0 -10px 20px -5px rgba(99, 102, 241, 0.2)'
            }}>
                SCREEN
            </div>

            {sortedRows.map(rowLabel => (
                <div key={rowLabel} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ width: '20px', textAlign: 'center', color: '#64748b' }}>{rowLabel}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {rows[rowLabel].sort((a, b) => a.number - b.number).map(seat => {
                            const isSelected = selectedSeatIds.includes(seat.id);
                            const isBooked = seat.status === 'BOOKED' || seat.status === 'LOCKED';

                            return (
                                <button
                                    key={seat.id}
                                    disabled={isBooked}
                                    onClick={() => onToggleSeat(seat.id)}
                                    title={`Row ${seat.row} Seat ${seat.number}`}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: isBooked
                                            ? '#334155'
                                            : isSelected
                                                ? 'var(--primary)'
                                                : 'rgba(255,255,255,0.1)',
                                        color: isBooked ? '#475569' : 'white',
                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none',
                                        transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                                    }}
                                >
                                    <span style={{ fontSize: '0.7rem' }}>{seat.number}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SeatGrid;
