import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getAvatarClass, getInitials, formatDate } from '../utils/helpers';
import api from '../api/axios';

export default function UserDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            const res = await api.get(`/users/${id}`);
            if (res.data.status) {
                setUser(res.data.data);
            } else {
                showToast(res.data.message, '', 'error');
                navigate('/users');
            }
        } catch (err) {
            console.error('Failed to load user:', err);
            showToast('Gagal memuat detail pengguna', '', 'error');
            navigate('/users');
        } finally {
            setLoading(false);
        }
    }, [id, showToast, navigate]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    if (loading) {
        return (
            <div className="page-card page-card-sm">
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="page-card page-card-sm">
            <div className="page-header" style={{ marginBottom: 0 }}>
                <Link to="/users" className="btn-s">
                    <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i>
                    <span className="btn-text-hide">Kembali</span>
                </Link>
                <h2>Detail pengguna</h2>
            </div>

            <div className="detail-header" style={{ marginTop: 24 }}>
                <div className={`detail-avatar-lg ${getAvatarClass(user.id)}`}>
                    {getInitials(user.nama)}
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{user.nama}</div>
                    <span className={`badge-role ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ marginTop: 4 }}>
                        {user.role}
                    </span>
                </div>
            </div>

            <div>
                <div className="detail-row">
                    <div className="detail-row-label"><i className="ti ti-at"></i>Username</div>
                    <div className="detail-row-value">{user.username}</div>
                </div>
                <div className="detail-row">
                    <div className="detail-row-label"><i className="ti ti-mail"></i>Email</div>
                    <div className="detail-row-value">{user.email}</div>
                </div>
                <div className="detail-row">
                    <div className="detail-row-label"><i className="ti ti-phone"></i>No. HP</div>
                    <div className="detail-row-value">{user.no_hp || '-'}</div>
                </div>
                <div className="detail-row">
                    <div className="detail-row-label"><i className="ti ti-map-pin"></i>Alamat</div>
                    <div className="detail-row-value">{user.alamat || '-'}</div>
                </div>
                <div className="detail-row">
                    <div className="detail-row-label"><i className="ti ti-clock"></i>Bergabung</div>
                    <div className="detail-row-value">{formatDate(user.created_at)}</div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-s" onClick={() => navigate('/users')}>Tutup</button>
                <Link to={`/users/${user.id}/edit`} className="btn-p">Edit</Link>
            </div>
        </div>
    );
}
