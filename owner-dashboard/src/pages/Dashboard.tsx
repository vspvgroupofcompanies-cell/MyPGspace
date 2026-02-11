import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [showAnnModal, setShowAnnModal] = useState(false);
    const [annTitle, setAnnTitle] = useState('');
    const [annMessage, setAnnMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/stats/owner', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: annTitle, message: annMessage })
            });

            if (res.ok) {
                setShowAnnModal(false);
                setAnnTitle('');
                setAnnMessage('');
                alert('Announcement posted successfully!');
            } else {
                const data = await res.json();
                alert(data.message || 'Error posting announcement');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    if (!stats) return <div style={{ padding: '40px' }}>Loading statistics...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Rooms</div>
                    <div className="stat-value">{stats.totalRooms}</div>
                    <div style={{ fontSize: '12px', color: 'var(--success)' }}>{stats.occupiedRooms} occupied</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Beds</div>
                    <div className="stat-value">{stats.totalBeds}</div>
                    <div style={{ fontSize: '12px', color: 'var(--info)' }}>{stats.vacantBeds} vacant</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Fee Paid (Current Month)</div>
                    <div className="stat-value">{stats.feePaidTenants}</div>
                    <div style={{ fontSize: '12px', color: 'var(--danger)' }}>{stats.pendingPayments} pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Receipts Generated</div>
                    <div className="stat-value">{stats.receiptsGenerated}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button className="btn-primary" onClick={() => navigate('/tenants')}>Add Tenant</button>
                <button className="btn-primary" style={{ background: '#10b981' }} onClick={() => navigate('/payments')}>Record Payment</button>
                <button className="btn-primary" style={{ background: '#f59e0b' }} onClick={() => setShowAnnModal(true)}>New Announcement</button>
            </div>

            <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                <h3>Quick Management</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Frequently used actions</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    <div
                        onClick={() => navigate('/rooms')}
                        style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer' }}
                    >
                        <p style={{ fontWeight: '600' }}>Manage Rooms</p>
                        <small style={{ color: 'var(--text-muted)' }}>Check occupancy & beds</small>
                    </div>
                    <div
                        onClick={() => navigate('/tenants')}
                        style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer' }}
                    >
                        <p style={{ fontWeight: '600' }}>Tenant List</p>
                        <small style={{ color: 'var(--text-muted)' }}>View active residents</small>
                    </div>
                </div>
            </div>

            {/* Announcement Modal */}
            {showAnnModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass-card" style={{ background: 'white', padding: '40px', width: '500px' }}>
                        <h2 style={{ marginBottom: '24px' }}>Post New Announcement</h2>
                        <form onSubmit={handlePostAnnouncement}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="e.g., Maintenance Scheduled"
                                    value={annTitle}
                                    onChange={e => setAnnTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Message</label>
                                <textarea
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '120px' }}
                                    placeholder="Enter announcement details here..."
                                    value={annMessage}
                                    onChange={e => setAnnMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#64748b' }}
                                    onClick={() => setShowAnnModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#f59e0b' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Posting...' : 'Post Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
