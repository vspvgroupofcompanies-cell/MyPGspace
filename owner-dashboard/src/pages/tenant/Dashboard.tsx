import { useState, useEffect } from 'react';

const TenantDashboard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const profRes = await fetch(`http://localhost:5000/api/tenants/${user.id}`, { headers });
            const profData = await profRes.json();
            setProfile(profData);

            const payRes = await fetch(`http://localhost:5000/api/payments/tenant/${user.id}`, { headers });
            const payData = await payRes.json();
            setPayments(payData);

            const annRes = await fetch(`http://localhost:5000/api/announcements`, { headers });
            const annData = await annRes.json();
            setAnnouncements(annData);
        };
        fetchData();
    }, [user.id]);

    const handleDownload = async (paymentId: string) => {
        const token = localStorage.getItem('token');
        window.open(`http://localhost:5000/api/payments/receipt/${paymentId}?token=${token}`, '_blank');
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (!profile) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your profile...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                <div>
                    <h1>Hello, {user.name} 👋</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome to your MyPGspace portal</p>
                </div>
                <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
                <div>
                    <div className="glass-card" style={{ marginBottom: '30px', padding: '24px', background: 'white' }}>
                        <h3 style={{ marginBottom: '20px' }}>Your Stay</h3>
                        <div style={{ marginBottom: '12px' }}>
                            <small style={{ color: 'var(--text-muted)' }}>Room & Bed</small>
                            <p style={{ fontWeight: '600' }}>Room {profile.roomId?.roomNumber} / {profile.bedCode}</p>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <small style={{ color: 'var(--text-muted)' }}>Monthly Rent</small>
                            <p style={{ fontWeight: '600' }}>₹{profile.rentAmount}</p>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <small style={{ color: 'var(--text-muted)' }}>Joining Date</small>
                            <p style={{ fontWeight: '600' }}>{new Date(profile.joiningDate).toLocaleDateString()}</p>
                        </div>
                        <div style={{ padding: '10px', borderRadius: '8px', background: profile.status === 'Paid' ? '#dcfce7' : '#fee2e2', textAlign: 'center' }}>
                            <span style={{ color: profile.status === 'Paid' ? '#166534' : '#991b1b', fontWeight: '700' }}>
                                STATUS: {profile.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                        <h3 style={{ marginBottom: '20px' }}>Announcements</h3>
                        {announcements.length === 0 ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No announcements.</p> : announcements.map(ann => (
                            <div key={ann._id} style={{ marginBottom: '16px', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>
                                <p style={{ fontWeight: '600', fontSize: '14px' }}>{ann.title}</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{ann.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '20px' }}>Payment History</h3>
                    <div className="glass-card" style={{ background: 'white', padding: '20px' }}>
                        {payments.length === 0 ? (
                            <p>No payments recorded yet.</p>
                        ) : (
                            payments.map(pay => (
                                <div key={pay._id} style={{
                                    padding: '20px', marginBottom: '16px', border: '1px solid #f1f5f9', borderRadius: '12px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '700' }}>{pay.monthFor}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            Paid via {pay.paymentMode} on {new Date(pay.paymentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{pay.amountPaid}</p>
                                        <button
                                            onClick={() => handleDownload(pay._id)}
                                            style={{ background: '#f5f3ff', color: 'var(--primary)', padding: '8px 16px', border: '1px solid #ddd6fe', borderRadius: '8px' }}
                                        >
                                            Receipt PDF
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantDashboard;
