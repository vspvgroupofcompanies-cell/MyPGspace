import { useState } from 'react';

const Payments = () => {
    const [tenantId, setTenantId] = useState('');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('UPI');
    const [month, setMonth] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ tenantId, amountPaid: amount, paymentMode: mode, monthFor: month })
            });
            if (res.ok) {
                setMessage('Payment recorded successfully!');
                setAmount('');
                setMonth('');
            } else {
                setMessage('Error recording payment');
            }
        } catch (err) {
            setMessage('Server error');
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <h1 style={{ marginBottom: '30px' }}>Record Payment</h1>

            <div className="glass-card" style={{ maxWidth: '600px', background: 'white', padding: '30px', margin: '0 auto' }}>
                {message && (
                    <div style={{
                        padding: '12px', background: '#ecfdf5', border: '1px solid #10b981',
                        color: '#065f46', borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
                    }}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tenant ID</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            value={tenantId}
                            onChange={(e) => setTenantId(e.target.value)}
                            placeholder="Paste ID from management list"
                            required
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }} className="form-row">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Amount (₹)</label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Month</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="Oct 2023"
                                required
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Payment Mode</label>
                        <select
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="UPI">UPI / Scanner</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank Transfer</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>Record & Issue Receipt</button>
                </form>
            </div>

            <style>{`
                @media (max-width: 480px) {
                    .form-row { grid-template-columns: 1fr !important; }
                    .glass-card { padding: 20px !important; }
                }
            `}</style>
        </div>
    );
};

export default Payments;
