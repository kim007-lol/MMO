/**
 * Komponen panel branding (sisi kiri) untuk halaman auth.
 * Digunakan bersama oleh LoginPage dan RegisterPage
 * agar tidak terjadi duplikasi markup.
 */
export default function AuthBranding() {
    return (
        <div className="auth-dark">
            <div className="auth-dark-logo">
                <div className="auth-dark-logo-icon"><i className="ti ti-users-group"></i></div>
                <span>MMO User Management</span>
            </div>
            <div className="auth-dark-center">
                <div className="auth-dark-heading">Kelola pengguna<br/>dengan mudah.</div>
                <div className="auth-dark-sub">Platform manajemen user untuk tim kamu.</div>
                <div className="auth-features">
                    <div className="auth-feature"><div className="auth-feature-icon"><i className="ti ti-shield-lock"></i></div><span>JWT Authentication</span></div>
                    <div className="auth-feature"><div className="auth-feature-icon"><i className="ti ti-users"></i></div><span>CRUD Manajemen User</span></div>
                    <div className="auth-feature"><div className="auth-feature-icon"><i className="ti ti-refresh"></i></div><span>AJAX tanpa reload halaman</span></div>
                </div>
            </div>
            <div className="auth-dark-footer">&copy; 2026 MMO User Management</div>
        </div>
    );
}
