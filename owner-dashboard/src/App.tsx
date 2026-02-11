import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Complaints from './pages/Complaints';
import Login from './pages/Login';
import TenantDashboard from './pages/TenantDashboard';
import Sidebar from './components/Sidebar';
import AIChatbot from './components/AIChatbot';
import { useState, useEffect } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(JSON.parse(localStorage.getItem('user') || '{}').role);

    useEffect(() => {
        const handleStorage = () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setIsAuthenticated(!!localStorage.getItem('token'));
            setRole(user.role);
        };
        window.addEventListener('storage', handleStorage);
        // Poll for changes since storage event only triggers from other tabs
        const interval = setInterval(handleStorage, 1000);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const onLogin = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setIsAuthenticated(true);
        setRole(user.role);
    };

    if (!isAuthenticated && window.location.pathname !== '/login') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="app-container">
            {isAuthenticated && <Sidebar />}
            <main className={isAuthenticated ? "main-content" : ""}>
                <Routes>
                    <Route path="/login" element={<Login onLogin={onLogin} />} />

                    {isAuthenticated && role === 'owner' ? (
                        <>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/rooms" element={<Rooms />} />
                            <Route path="/tenants" element={<Tenants />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/complaints" element={<Complaints />} />
                        </>
                    ) : isAuthenticated && role === 'tenant' ? (
                        <Route path="/" element={<TenantDashboard />} />
                    ) : (
                        <Route path="/" element={<Navigate to="/login" />} />
                    )}

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                {isAuthenticated && (
                    <footer style={{
                        marginTop: '50px',
                        padding: '20px 0',
                        borderTop: '1px solid #e2e8f0',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '12px'
                    }}>
                        All rights reserved by Etukas Tech Pvt Ltd. 2026
                    </footer>
                )}
            </main>
            {isAuthenticated && <AIChatbot />}
        </div>
    );
}

export default App;
