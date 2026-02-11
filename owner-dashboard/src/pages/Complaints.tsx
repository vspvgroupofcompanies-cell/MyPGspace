import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

const Complaints = () => {
    const [complaints, setComplaints] = useState<any[]>([]);

    const fetchComplaints = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/complaints', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setComplaints(data);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/complaints/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (res.ok) fetchComplaints();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Tenant Complaints</h1>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px' }}>Tenant Info</th>
                            <th style={{ padding: '16px' }}>Category</th>
                            <th style={{ padding: '16px' }}>Description</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px' }}>Date</th>
                            <th style={{ padding: '16px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No complaints found.</td></tr>
                        ) : complaints.map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td data-label="Tenant" style={{ padding: '16px' }}>
                                    {c.isAnonymous ? (
                                        <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Anonymous Post</span>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <p style={{ fontWeight: '600', margin: 0 }}>{c.tenantName}</p>
                                                {c.tenantPhone && (
                                                    <a href={`tel:${c.tenantPhone}`} style={{ color: '#10b981', display: 'flex', alignItems: 'center' }} title={`Call ${c.tenantName}`}>
                                                        <Phone size={14} />
                                                    </a>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Room {c.roomBed}</p>
                                        </div>
                                    )}
                                </td>
                                <td data-label="Category" style={{ padding: '16px' }}>
                                    <span style={{ padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '12px' }}>{c.category}</span>
                                </td>
                                <td data-label="Issue" style={{ padding: '16px' }}>{c.description}</td>
                                <td data-label="Status" style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                        background: c.status === 'Resolved' ? '#dcfce7' : c.status === 'In Progress' ? '#fef9c3' : '#fee2e2',
                                        color: c.status === 'Resolved' ? '#166534' : c.status === 'In Progress' ? '#854d0e' : '#991b1b'
                                    }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td data-label="Date" style={{ padding: '16px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td data-label="Action" style={{ padding: '16px' }}>
                                    <select
                                        style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                                        value={c.status}
                                        onChange={(e) => updateStatus(c._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    table, thead, tbody, th, td, tr { display: block; }
                    thead tr { position: absolute; top: -9999px; left: -9999px; }
                    tr { border: 1px solid #e2e8f0; margin-bottom: 15px; border-radius: 12px; padding: 10px; background: white; }
                    td { border: none; position: relative; padding-left: 45% !important; text-align: left; min-height: 40px; display: flex; align-items: center; }
                    td:before { position: absolute; left: 15px; width: 40%; font-weight: bold; color: #64748b; content: attr(data-label); }
                }
            `}</style>
        </div>
    );
};

export default Complaints;
