import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

const TenantDashboard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [complaintCategory, setComplaintCategory] = useState('Facility');
    const [complaintDesc, setComplaintDesc] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [complaintLoading, setComplaintLoading] = useState(false);
    const [myComplaints, setMyComplaints] = useState<any[]>([]);
    const [prevStatuses, setPrevStatuses] = useState<Record<string, string>>({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchMyComplaints = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/complaints/my-complaints', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();

            // Check for status changes to trigger notification sound
            let statusChanged = false;
            const newStatuses: Record<string, string> = {};
            data.forEach((c: any) => {
                newStatuses[c._id] = c.status;
                if (prevStatuses[c._id] && prevStatuses[c._id] !== c.status) {
                    statusChanged = true;
                }
            });

            if (statusChanged) {
                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.log("Sound play failed", e));
            }

            setPrevStatuses(newStatuses);
            setMyComplaints(data);
        } catch (err) {
            console.error('Error fetching complaints:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                const profRes = await fetch(`http://localhost:5000/api/tenants/${user.id}`, { headers });
                const profData = await profRes.json();
                setProfile(profData);

                const payRes = await fetch(`http://localhost:5000/api/payments/tenant/${user.id}`, { headers });
                const payData = await payRes.json();
                setPayments(payData);

                const annRes = await fetch(`http://localhost:5000/api/announcements`, { headers });
                const annData = await annRes.json();
                setAnnouncements(annData);

                fetchMyComplaints();
            } catch (err) {
                console.error('Error fetching tenant data:', err);
            }
        };
        if (user.id) fetchData();

        // Polling for complaints status
        const interval = setInterval(fetchMyComplaints, 10000);
        return () => clearInterval(interval);
    }, [user.id]);

    const handleDownload = async (paymentId: string) => {
        const token = localStorage.getItem('token');
        window.open(`http://localhost:5000/api/payments/receipt/${paymentId}?token=${token}`, '_blank');
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const handleSubmitComplaint = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Bad Words Filter for Mutual Respect
        const badWords = ["fuck", "shit", "asshole", "bitch", "lanja", "modda", "puku", "dengu", "chutiya", "gaandu"];
        const hasBadWord = badWords.some(word => complaintDesc.toLowerCase().includes(word));

        if (hasBadWord) {
            alert("Your complaint contains inappropriate language. Please maintain mutual respect and use professional language.");
            return;
        }

        if (isAnonymous) {
            const confirmed = window.confirm("You are choosing to post anonymously. Please acknowledge that you will not be able to track the progress of this complaint. Do you want to proceed?");
            if (!confirmed) return;
        }

        setComplaintLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    category: complaintCategory,
                    description: complaintDesc,
                    isAnonymous
                })
            });

            if (res.ok) {
                setShowComplaintModal(false);
                setComplaintDesc('');
                fetchMyComplaints();
                alert('Submitted successfully!');
            } else {
                alert('Error submitting complaint');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setComplaintLoading(false);
        }
    };

    const getStatusCounts = () => {
        const counts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
        myComplaints.forEach(c => {
            if (counts.hasOwnProperty(c.status)) {
                // @ts-ignore
                counts[c.status]++;
            }
        });
        return counts;
    };

    const counts = getStatusCounts();

    if (!profile) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your profile...</div>;

    return (
        <div className="tenant-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '90vh' }}>
            <header className="tenant-header" style={{ marginBottom: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontWeight: 800 }}>Hello, {user.name} 👋</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome to your MyPGspace portal</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="btn-primary" style={{ background: '#ef4444', flex: 1 }} onClick={() => setShowComplaintModal(true)}>Raise Complaint</button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="tenant-grid">
                <div className="left-col">
                    <div className="glass-card" style={{ marginBottom: '24px', padding: '24px', background: 'white' }}>
                        <h3 style={{ marginBottom: '20px' }}>Your Stay</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
                            <div style={{ padding: '10px', borderRadius: '8px', background: profile.status === 'Paid' ? '#dcfce7' : '#fee2e2', textAlign: 'center', alignSelf: 'center' }}>
                                <span style={{ color: profile.status === 'Paid' ? '#166534' : '#991b1b', fontWeight: '700', fontSize: '12px' }}>
                                    {profile.status ? profile.status.toUpperCase() : 'PENDING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* My Complaints Section */}
                    <div className="glass-card" style={{ borderLeft: '4px solid #ef4444', marginBottom: '24px', padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MessageSquare color="#ef4444" size={20} /> My Complaints
                            </h3>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Pending [{counts.Pending}]</span>
                            <span style={{ padding: '4px 8px', background: '#fef9c3', color: '#854d0e', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Review [{counts['In Progress']}]</span>
                            <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Approved [{counts.Resolved}]</span>
                        </div>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {myComplaints.length === 0 ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No complaints raised.</p> : myComplaints.map(c => (
                                <div key={c._id} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <p style={{ fontWeight: '600', fontSize: '13px' }}>{c.category}</p>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold',
                                            background: c.status === 'Resolved' ? '#dcfce7' : c.status === 'In Progress' ? '#fef9c3' : '#fee2e2',
                                            color: c.status === 'Resolved' ? '#166534' : c.status === 'In Progress' ? '#854d0e' : '#991b1b'
                                        }}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{c.description}</p>
                                    <small style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', background: 'white', marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Announcements</h3>
                        {announcements.length === 0 ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No announcements.</p> : announcements.map(ann => (
                            <div key={ann._id} style={{ marginBottom: '16px', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>
                                <p style={{ fontWeight: '600', fontSize: '14px' }}>{ann.title}</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{ann.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-col">
                    <h3 style={{ marginBottom: '20px' }}>Payment History</h3>
                    <div className="glass-card" style={{ background: 'white', padding: '15px' }}>
                        {payments.length === 0 ? (
                            <p>No payments recorded yet.</p>
                        ) : (
                            payments.map(pay => (
                                <div key={pay._id} className="payment-item" style={{
                                    padding: '15px', marginBottom: '12px', border: '1px solid #f1f5f9', borderRadius: '12px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '700' }}>{pay.monthFor}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {pay.paymentMode} • {new Date(pay.paymentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
                                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{pay.amountPaid}</p>
                                        <button
                                            className="receipt-btn"
                                            onClick={() => handleDownload(pay._id)}
                                            style={{ background: '#f5f3ff', color: 'var(--primary)', padding: '6px 12px', border: '1px solid #ddd6fe', borderRadius: '8px', fontSize: '12px' }}
                                        >
                                            Receipt
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {showComplaintModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
                    padding: '15px'
                }}>
                    <div className="glass-card modal-content" style={{ background: 'white', padding: '30px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '24px' }}>Register Complaint</h2>
                        <form onSubmit={handleSubmitComplaint}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                                <select
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={complaintCategory}
                                    onChange={e => setComplaintCategory(e.target.value)}
                                    required
                                >
                                    <option value="Facility">Facility (Wi-Fi, Water, etc.)</option>
                                    <option value="Maintenance">Maintenance (Electrical, Plumbing)</option>
                                    <option value="Cleanliness">Cleanliness</option>
                                    <option value="Food">Food Quality</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                                <textarea
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px' }}
                                    placeholder="Describe your issue..."
                                    value={complaintDesc}
                                    onChange={e => setComplaintDesc(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="anon"
                                    checked={isAnonymous}
                                    onChange={e => setIsAnonymous(e.target.checked)}
                                />
                                <label htmlFor="anon" style={{ fontSize: '13px', cursor: 'pointer' }}>
                                    Post Anonymously
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#64748b' }}
                                    onClick={() => setShowComplaintModal(false)}
                                    disabled={complaintLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#ef4444' }}
                                    disabled={complaintLoading}
                                >
                                    {complaintLoading ? '...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @media (min-width: 768px) {
                    .tenant-header { display: flex; justify-content: space-between; align-items: center; }
                    .tenant-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
                    .header-actions { width: auto; }
                    .header-actions button { width: auto; }
                    .tenant-container { padding: 40px !important; }
                }
                
                @media (max-width: 767px) {
                    .tenant-grid { display: flex; flex-direction: column; }
                    h1 { font-size: 1.5rem; }
                    .payment-item { padding: 12px !important; }
                    .receipt-btn { padding: 4px 8px !important; font-size: 10px !important; }
                }
            `}</style>
        </div>
    );
};

export default TenantDashboard;
