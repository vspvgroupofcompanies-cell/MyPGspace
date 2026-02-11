import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin();
                navigate('/');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Server connection failed');
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)'
        }}>
            <div className="glass-card" style={{ padding: '40px', width: '400px', background: 'white' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>MyPGspace Login</h1>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px' }}>Welcome to your PG portal</p>

                {error && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '16px' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
