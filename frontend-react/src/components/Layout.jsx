import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userCount, setUserCount] = useState(0);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Listen to route changes to close sidebar on mobile
    useEffect(() => {
        closeSidebar();
    }, [location.pathname]);

    // Fetch user count for sidebar badge
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await api.get('/users?limit=1');
                if (res.data.status) {
                    setUserCount(res.data.data.total);
                }
            } catch (err) {
                console.error('Failed to fetch user count', err);
            }
        };
        fetchCount();
        
        // Polling or listen to an event could be added here,
        // but fetching once on layout mount is a good start.
        // For dynamic updates, we can export a global event or context.
        window.addEventListener('userListUpdated', fetchCount);
        return () => window.removeEventListener('userListUpdated', fetchCount);
    }, []);

    const initials = user?.nama ? user.nama.substring(0, 2).toUpperCase() : 'U';

    return (
        <div>
            {/* Topbar */}
            <div className="topbar">
                <div className="topbar-left">
                    <button className="hamburger" onClick={toggleSidebar}>
                        <i className="ti ti-menu-2"></i>
                    </button>
                    <a href="/users" className="topbar-brand" onClick={(e) => { e.preventDefault(); navigate('/users'); }}>
                        <div className="topbar-brand-icon"><i className="ti ti-users-group"></i></div>
                        <span>MMO User Management</span>
                    </a>
                </div>
                <div className="topbar-right">
                    <span className="topbar-user-name">{user?.nama || user?.username || 'User'}</span>
                    <div className="topbar-avatar">{initials}</div>
                </div>
            </div>

            <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
            
            <div className="app-shell">
                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div style={{ flex: 1 }}>
                        <div className="sidebar-section-label">Menu</div>
                        <div className="sidebar-nav">
                            <button 
                                className={`sidebar-item ${location.pathname.startsWith('/users') ? 'active' : ''}`} 
                                onClick={() => navigate('/users')}
                            >
                                <i className="ti ti-users"></i>
                                Manajemen User
                                <span className="nav-badge">{userCount}</span>
                            </button>
                        </div>
                    </div>
                    <div className="sidebar-bottom">
                        <div className="sidebar-section-label">Akun</div>
                        <div className="sidebar-nav">
                            <button className="sidebar-item" onClick={handleLogout}>
                                <i className="ti ti-logout"></i>
                                Keluar
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="app-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
