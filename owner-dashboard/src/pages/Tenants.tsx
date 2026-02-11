import { useState, useEffect } from 'react';
import { UserMinus, Calendar, Bell, Plane, CheckCircle, XCircle } from 'lucide-react';

const Tenants = () => {
    const [tenants, setTenants] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showNoticeModal, setShowNoticeModal] = useState<any>(null); // Stores tenant profile
    const [loading, setLoading] = useState(false);

    // Form state for adding
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [roomId, setRoomId] = useState('');
    const [bedCode, setBedCode] = useState('');
    const [rent, setRent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Notice Period state
    const [vacatingDate, setVacatingDate] = useState('');

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const [tenantRes, roomRes, userRes] = await Promise.all([
                fetch('http://localhost:5000/api/tenants', { headers }),
                fetch('http://localhost:5000/api/rooms', { headers }),
                fetch('http://localhost:5000/api/users/me', { headers })
            ]);

            const tenantData = await tenantRes.json();
            setTenants(Array.isArray(tenantData) ? tenantData : []);

            const roomData = await roomRes.json();
            setRooms(Array.isArray(roomData) ? roomData : []);

            const userData = await userRes.json();
            setUserProfile(userData);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:5000/api/tenants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name, phone, roomId, bedCode,
                    rentAmount: parseInt(rent),
                    joiningDate: date,
                    dueDate: 5
                })
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
                setName(''); setPhone(''); setRoomId(''); setBedCode(''); setRent('');
                alert('Tenant registered successfully!');
            } else {
                const err = await res.json();
                alert(err.message || 'Error adding tenant');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFlightMode = async () => {
        const token = localStorage.getItem('token');
        const nextVal = !userProfile?.isFlightMode;
        try {
            const res = await fetch('http://localhost:5000/api/users/update-flightmode', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isFlightMode: nextVal })
            });
            if (res.ok) {
                const updated = await res.json();
                setUserProfile(updated);
                alert(`Notice Configuration (Flight Mode) ${nextVal ? 'Enabled' : 'Disabled'}`);
            }
        } catch (err) {
            alert('Error updating configuration');
        }
    };

    const handleSetNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:5000/api/tenants/notice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    profileId: showNoticeModal._id,
                    noticeDate: new Date(),
                    vacatingDate: vacatingDate
                })
            });

            if (res.ok) {
                setShowNoticeModal(null);
                setVacatingDate('');
                fetchData();
                alert('Notice period initiated successfully!');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelNotice = async (profileId: string) => {
        if (!window.confirm('Are you sure you want to cancel the notice period for this tenant?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/tenants/cancel-notice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profileId })
            });
            if (res.ok) {
                fetchData();
                alert('Notice cancelled.');
            }
        } catch (err) {
            alert('Server error');
        }
    };

    // Force 1 month date logic
    const getMinNoticeDate = () => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    };

    const selectedRoom = rooms.find(r => r._id === roomId);

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }} className="page-header">
                <div>
                    <h1>Tenant Management</h1>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Manage residents and notice periods</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleToggleFlightMode}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px',
                            background: userProfile?.isFlightMode ? '#eff6ff' : '#f8fafc',
                            border: `1px solid ${userProfile?.isFlightMode ? '#3b82f6' : '#e2e8f0'}`,
                            color: userProfile?.isFlightMode ? '#1d4ed8' : '#64748b',
                            cursor: 'pointer', fontWeight: '500', fontSize: '13px'
                        }}
                        title="Configure automatic notice notifications"
                    >
                        <Plane size={16} />
                        Flight Mode: {userProfile?.isFlightMode ? 'On' : 'Off'}
                    </button>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Tenant</button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px' }}>Name</th>
                            <th style={{ padding: '16px' }}>Room/Bed</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px' }}>Notice Details</th>
                            <th style={{ padding: '16px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map(tenant => (
                            <tr key={tenant._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td data-label="Name" style={{ padding: '16px' }}>
                                    <p style={{ fontWeight: '600', margin: 0 }}>{tenant.userId?.name}</p>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{tenant.userId?.phone}</p>
                                </td>
                                <td data-label="Room" style={{ padding: '16px' }}>Bed {tenant.bedCode}</td>
                                <td data-label="Status" style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                        background: tenant.isOnNotice ? '#fff7ed' : (tenant.status === 'Paid' ? '#dcfce7' : '#fee2e2'),
                                        color: tenant.isOnNotice ? '#ea580c' : (tenant.status === 'Paid' ? '#166534' : '#991b1b')
                                    }}>
                                        {tenant.isOnNotice ? 'ON NOTICE' : (tenant.status || 'UNPAID')}
                                    </span>
                                </td>
                                <td data-label="Notice" style={{ padding: '16px' }}>
                                    {tenant.isOnNotice ? (
                                        <div style={{ fontSize: '12px', color: '#ea580c' }}>
                                            <p style={{ margin: 0, fontWeight: '600' }}>Vacates:</p>
                                            <p style={{ margin: 0 }}>{new Date(tenant.vacatingDate).toLocaleDateString()}</p>
                                        </div>
                                    ) : (
                                        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>N/A</span>
                                    )}
                                </td>
                                <td data-label="Actions" style={{ padding: '16px' }}>
                                    {tenant.isOnNotice ? (
                                        <button
                                            onClick={() => handleCancelNotice(tenant._id)}
                                            style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            Cancel Notice
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setShowNoticeModal(tenant); setVacatingDate(getMinNoticeDate()); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            <UserMinus size={14} /> Remove
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Notice Modal */}
            {showNoticeModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="glass-card" style={{ background: 'white', padding: '30px', width: '100%', maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '16px' }}>Initiate Notice Period</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                            You are starting the removal process for <strong>{showNoticeModal.userId?.name}</strong>. {userProfile?.isFlightMode && "Tenant will be notified via FlightMode."}
                        </p>

                        <form onSubmit={handleSetNotice}>
                            <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: '600', color: '#1e293b' }}>
                                    <Calendar size={18} color="var(--primary)" /> Final Vacating Date
                                </label>
                                <input
                                    type="date"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    value={vacatingDate}
                                    min={getMinNoticeDate()}
                                    onChange={e => setVacatingDate(e.target.value)}
                                    required
                                />
                                <small style={{ color: '#ef4444', marginTop: '8px', display: 'block', fontWeight: '500' }}>
                                    * Minimum 1-month notice period required.
                                </small>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-primary" style={{ flex: 1, background: '#64748b' }} onClick={() => setShowNoticeModal(null)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, background: '#ef4444' }} disabled={loading}>
                                    Confirm Removal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Tenant Modal (existing logic) */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="glass-card" style={{ background: 'white', padding: '30px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '24px' }}>Register New Tenant</h2>
                        <form onSubmit={handleAddTenant}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                                <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                                <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="10 Digits" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Room</label>
                                    <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={roomId} onChange={e => { setRoomId(e.target.value); setBedCode(''); }} required>
                                        <option value="">Select Room</option>
                                        {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bed</label>
                                    <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={bedCode} onChange={e => setBedCode(e.target.value)} required disabled={!roomId}>
                                        <option value="">Bed</option>
                                        {selectedRoom?.beds.filter((b: any) => b.status === 'vacant').map((b: any) => <option key={b.bedCode} value={b.bedCode}>{b.bedCode}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Rent (₹)</label>
                                    <input type="number" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={rent} onChange={e => setRent(e.target.value)} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Start Date</label>
                                    <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={date} onChange={e => setDate(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-primary" style={{ flex: 1, background: '#64748b' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    table, thead, tbody, th, td, tr { display: block; }
                    thead tr { position: absolute; top: -9999px; left: -9999px; }
                    tr { border: 1px solid #e2e8f0; margin-bottom: 15px; border-radius: 12px; padding: 10px; background: white; }
                    td { border: none; position: relative; padding-left: 45% !important; text-align: left; min-height: 45px; display: flex; align-items: center; }
                    td:before { position: absolute; left: 15px; width: 40%; font-weight: bold; color: #64748b; content: attr(data-label); }
                }
            `}</style>
        </div>
    );
};

export default Tenants;
