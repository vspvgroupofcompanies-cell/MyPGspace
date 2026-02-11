import { useState, useEffect } from 'react';
import { Bed, Pencil, Calendar, Info } from 'lucide-react';

const Rooms = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState<any>(null); // Stores room object

    // Form state for adding
    const [roomNumber, setRoomNumber] = useState('');
    const [sharingType, setSharingType] = useState('2');
    const [rentPerBed, setRentPerBed] = useState('');
    const [loading, setLoading] = useState(false);

    // Form state for editing bed availability
    const [editBedCode, setEditBedCode] = useState('');
    const [vacatingDate, setVacatingDate] = useState('');
    const [isPartial, setIsPartial] = useState(false);

    const fetchRooms = async () => {
        const res = await fetch('http://localhost:5000/api/rooms', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setRooms(data);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const groupedRooms = rooms.reduce((acc: any, room: any) => {
        const roomNum = parseInt(room.roomNumber);
        const floor = isNaN(roomNum) ? 'Other' : Math.floor(roomNum / 100);
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(room);
        return acc;
    }, {});

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    roomNumber,
                    sharingType: parseInt(sharingType),
                    rentPerBed: parseInt(rentPerBed)
                })
            });

            if (res.ok) {
                setShowAddModal(false);
                setRoomNumber('');
                setRentPerBed('');
                fetchRooms();
                alert('Room added successfully!');
            } else {
                alert('Error adding room');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBed = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/rooms/beds/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    roomId: showEditModal._id,
                    bedCode: editBedCode,
                    vacatingDate: vacatingDate || null,
                    isPartiallyAvailable: isPartial
                })
            });

            if (res.ok) {
                setShowEditModal(null);
                setEditBedCode('');
                setVacatingDate('');
                setIsPartial(false);
                fetchRooms();
                alert('Availability updated successfully!');
            } else {
                alert('Error updating availability');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h1>Rooms & Beds</h1>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Room</button>
            </div>

            <div className="floors-container">
                {Object.keys(groupedRooms).length === 0 ? (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'white' }}>
                        <p style={{ color: '#64748b' }}>No rooms found. Click "Add Room" to create one.</p>
                    </div>
                ) : Object.keys(groupedRooms).sort().map(floor => (
                    <div key={floor} className="floor-row" style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>FLOOR {floor}</h3>
                        <div className="room-horizontal-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '15px', flexWrap: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            <style>{`.room-horizontal-scroll::-webkit-scrollbar { display: none; }`}</style>
                            {groupedRooms[floor].map((room: any) => (
                                <div key={room._id} className="room-card" style={{ minWidth: '240px', flex: '0 0 auto', position: 'relative' }} onClick={() => setSelectedRoom(room)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ marginBottom: '12px' }}>Room {room.roomNumber}</h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowEditModal(room); }}
                                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                                            className="edit-room-btn"
                                            title="Manage Availability"
                                        >
                                            <Pencil size={14} color="#64748b" />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                                        <span>{room.sharingType} Sharing</span>
                                        <span>₹{room.rentPerBed}</span>
                                    </div>

                                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {room.beds.map((bed: any) => (
                                            <div key={bed.bedCode} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Bed
                                                    size={20}
                                                    color={bed.status === 'occupied' ? '#ef4444' : '#22c55e'}
                                                    style={{
                                                        opacity: bed.isPartiallyAvailable ? 0.4 : (bed.status === 'occupied' ? 0.8 : 1),
                                                        filter: bed.vacatingDate ? 'drop-shadow(0 0 2px #f59e0b)' : 'none'
                                                    }}
                                                />
                                                {bed.vacatingDate && (
                                                    <span style={{
                                                        position: 'absolute', top: '-8px', right: '-8px',
                                                        background: '#f59e0b', color: 'white', fontSize: '8px',
                                                        padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold'
                                                    }}>
                                                        NOTICE
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Availability Badges */}
                                    <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {room.beds.some((b: any) => b.isPartiallyAvailable) && (
                                            <span style={{ fontSize: '10px', padding: '2px 6px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', border: '1px solid #e2e8f0' }}>Partial Avail.</span>
                                        )}
                                        {room.beds.some((b: any) => b.vacatingDate) && (
                                            <span style={{ fontSize: '10px', padding: '2px 6px', background: '#fff7ed', color: '#ea580c', borderRadius: '4px', border: '1px solid #ffedd5' }}>Vacating Soon</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Room Details Modal */}
            {selectedRoom && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setSelectedRoom(null)}>
                    <div className="glass-card" style={{ background: 'white', padding: '30px', width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Info size={24} color="var(--primary)" /> Room {selectedRoom.roomNumber}</h2>
                            <button onClick={() => setSelectedRoom(null)} style={{ background: '#f1f5f9', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            {selectedRoom.beds.map((bed: any) => (
                                <div key={bed.bedCode} style={{
                                    padding: '16px', borderRadius: '12px', marginBottom: '12px',
                                    background: bed.status === 'occupied' ? '#eff6ff' : '#f0fdf4',
                                    border: `1px solid ${bed.status === 'occupied' ? '#bfdbfe' : '#bbf7d0'}`,
                                    display: 'flex', flexDirection: 'column', gap: '8px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Bed size={16} color={bed.status === 'occupied' ? '#3b82f6' : '#22c55e'} />
                                            Bed {bed.bedCode}
                                        </span>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: bed.status === 'occupied' ? '#3b82f6' : '#22c55e' }}>{bed.status.toUpperCase()}</span>
                                    </div>
                                    {bed.vacatingDate && (
                                        <div style={{ padding: '8px', background: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={12} color="#ea580c" />
                                            <span style={{ fontSize: '11px', color: '#9a3412', fontWeight: '500' }}>Vacates on: {new Date(bed.vacatingDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {bed.isPartiallyAvailable && (
                                        <div style={{ padding: '4px 8px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px', fontSize: '10px', color: '#64748b', textAlign: 'center' }}>
                                            Temporarily Marked Partial
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={() => setSelectedRoom(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAddModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="glass-card" style={{ background: 'white', padding: '30px', width: '100%', maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '24px' }}>Add New Room</h2>
                        <form onSubmit={handleAddRoom}>
                            {/* ... (keep existing add room form fields) */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Room Number</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="e.g. 101"
                                    value={roomNumber}
                                    onChange={e => setRoomNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Sharing Type</label>
                                <select
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={sharingType}
                                    onChange={e => setSharingType(e.target.value)}
                                    required
                                >
                                    <option value="1">1 Sharing (Single)</option>
                                    <option value="2">2 Sharing</option>
                                    <option value="3">3 Sharing</option>
                                    <option value="4">4 Sharing</option>
                                    <option value="5">5 Sharing</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Rent per Bed (₹)</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="e.g. 6000"
                                    value={rentPerBed}
                                    onChange={e => setRentPerBed(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-primary" style={{ flex: 1, background: '#64748b' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Adding...' : 'Add Room'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Availability Modal (Update Existing Room) */}
            {showEditModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="glass-card" style={{ background: 'white', padding: '30px', width: '100%', maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '24px' }}>Manage Room {showEditModal.roomNumber}</h2>
                        <form onSubmit={handleUpdateBed}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Bed</label>
                                <select
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={editBedCode}
                                    onChange={e => {
                                        setEditBedCode(e.target.value);
                                        const bed = showEditModal.beds.find((b: any) => b.bedCode === e.target.value);
                                        if (bed) {
                                            setVacatingDate(bed.vacatingDate ? new Date(bed.vacatingDate).toISOString().split('T')[0] : '');
                                            setIsPartial(bed.isPartiallyAvailable || false);
                                        }
                                    }}
                                    required
                                >
                                    <option value="">Choose a bed...</option>
                                    {showEditModal.beds.map((b: any) => <option key={b.bedCode} value={b.bedCode}>Bed {b.bedCode}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Expected Vacating Date</label>
                                <input
                                    type="date"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={vacatingDate}
                                    onChange={e => setVacatingDate(e.target.value)}
                                />
                                <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Leave blank if not vacating.</small>
                            </div>

                            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="partial"
                                    checked={isPartial}
                                    onChange={e => setIsPartial(e.target.checked)}
                                />
                                <label htmlFor="partial" style={{ fontWeight: '500', cursor: 'pointer' }}>Mark as Partially Available</label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-primary" style={{ flex: 1, background: '#64748b' }} onClick={() => setShowEditModal(null)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading || !editBedCode}>{loading ? 'Updating...' : 'Update Status'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .edit-room-btn:hover { background: #e2e8f0 !important; transform: scale(1.1); }
                .room-card:hover { border-color: var(--primary) !important; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                @media (max-width: 639px) {
                    .page-header { flex-direction: column; align-items: flex-start !important; }
                    .page-header h1 { font-size: 1.5rem; }
                    .page-header button { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Rooms;
