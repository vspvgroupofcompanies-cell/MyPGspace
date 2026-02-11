import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, DoorOpen, Users, CreditCard, MessageSquare, LogOut, Info, UserCircle } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const ownerItems = [
        { to: "/", label: "Dashboard", Icon: LayoutDashboard },
        { to: "/rooms", label: "Rooms & Beds", Icon: DoorOpen },
        { to: "/tenants", label: "Tenants", Icon: Users },
        { to: "/payments", label: "Payments", Icon: CreditCard },
        { to: "/complaints", label: "Complaints", Icon: MessageSquare },
    ];

    const tenantItems = [
        { to: "/", label: "Home", Icon: LayoutDashboard },
        { to: "/profile", label: "My Profile", Icon: UserCircle },
        { to: "/announcements", label: "Announcements", Icon: Info },
    ];

    const navItems = role === 'owner' ? ownerItems : tenantItems;

    return (
        <>
            <div className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
                        <h2 style={{ color: '#6366f1', fontWeight: 800, margin: 0, fontSize: '1.2rem' }}>MyPGspace</h2>
                    </div>
                    <button
                        className="mobile-toggle"
                        onClick={toggleMenu}
                        style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <nav className={isOpen ? "nav-open" : ""}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            <item.Icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        style={{
                            background: '#1e293b',
                            color: '#f8fafc',
                            padding: '12px',
                            width: '100%',
                            marginTop: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </nav>
            </div>

            <style>{`
                .mobile-toggle { display: block; }
                
                @media (min-width: 768px) {
                    .mobile-toggle { display: none; }
                    .sidebar nav {
                        display: flex !important;
                        flex-direction: column;
                        flex: 1;
                        width: 100%;
                        margin-top: 40px;
                    }
                }
                
                @media (max-width: 767px) {
                    .sidebar nav {
                        display: none;
                        position: absolute;
                        top: 60px;
                        left: 0;
                        width: 100%;
                        background: #0f172a;
                        padding: 20px;
                        flex-direction: column;
                        z-index: 1000;
                        border-top: 1px solid #1e293b;
                        height: calc(100vh - 60px);
                    }
                    .sidebar nav.nav-open { display: flex; }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
