import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getAvatarClass, getInitials } from '../utils/helpers';
import api from '../api/axios';

export default function UserListPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, total_pages: 0, limit: 10 });
    
    // Delete Modal State
    const [deleteId, setDeleteId] = useState(null);
    const [deleteName, setDeleteName] = useState('');
    const [deleting, setDeleting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/users', { params: { page, search } });
            if (res.data.status) {
                setUsers(res.data.data.users || []);
                setMeta({
                    total: res.data.data.total,
                    total_pages: res.data.data.total_pages,
                    page: res.data.data.page,
                    limit: res.data.data.limit,
                });
                // Emit event to update layout badge
                window.dispatchEvent(new Event('userListUpdated'));
            }
        } catch (err) {
            console.error('Failed to load users:', err);
            showToast('Gagal memuat data', '', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, search, showToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await api.delete(`/users/${deleteId}`);
            if (res.data.status) {
                showToast('Pengguna berhasil dihapus');
                fetchUsers();
                setDeleteId(null);
            } else {
                showToast(res.data.message, '', 'error');
            }
        } catch (err) {
            showToast('Gagal menghapus pengguna', '', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const startIdx = (meta.page - 1) * (meta.limit || 10);

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 20 }}>
                <div>
                    <h2>Manajemen User</h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Daftar semua pengguna terdaftar</div>
                </div>
                <Link to="/users/create" className="btn-p">
                    <i className="ti ti-plus" style={{ fontSize: 15 }}></i>
                    <span className="btn-text-hide">Tambah User</span>
                </Link>
            </div>

            <div className="toolbar" style={{ marginTop: 20, marginBottom: 16 }}>
                <div className="search-bar">
                    <i className="ti ti-search"></i>
                    <input
                        type="text"
                        placeholder="Cari nama, username, atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 48 }}>No.</th>
                                <th>Nama</th>
                                <th style={{ width: 140 }}>Username</th>
                                <th style={{ width: 180 }}>Email</th>
                                <th style={{ width: 130 }}>No. HP</th>
                                <th style={{ width: 90 }}>Role</th>
                                <th style={{ width: 100 }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="skeleton-row">
                                        <td colSpan="7">
                                            <div className="skeleton skeleton-block" style={{ width: `${60 + Math.random() * 40}%` }}></div>
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="empty-state">
                                            <div className="empty-icon"><i className="ti ti-users"></i></div>
                                            <div className="empty-title">Belum ada pengguna</div>
                                            <div className="empty-sub">Klik tombol Tambah User untuk menambahkan pengguna pertama</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u, i) => (
                                    <tr key={u.id}>
                                        <td>{startIdx + i + 1}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className={`user-avatar ${getAvatarClass(u.id)}`}>{getInitials(u.nama)}</div>
                                                <div>
                                                    <div className="user-info-name">{u.nama}</div>
                                                    <div className="user-info-sub">{u.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{u.username}</td>
                                        <td>{u.email}</td>
                                        <td>{u.no_hp || '-'}</td>
                                        <td>
                                            <span className={`badge-role ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="icon-btn" onClick={() => navigate(`/users/${u.id}`)} title="Detail">
                                                    <i className="ti ti-eye"></i>
                                                </button>
                                                <button className="icon-btn" onClick={() => navigate(`/users/${u.id}/edit`)} title="Edit">
                                                    <i className="ti ti-edit"></i>
                                                </button>
                                                <button className="icon-btn icon-btn-danger" onClick={() => { setDeleteId(u.id); setDeleteName(u.nama); }} title="Hapus">
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {meta.total_pages > 1 && (
                <div className="pagination-wrapper">
                    <div className="pagination-info">
                        Menampilkan {Math.min(startIdx + 1, meta.total)}–{Math.min(startIdx + meta.limit, meta.total)} dari {meta.total} pengguna
                    </div>
                    <div className="pagination-btns">
                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                            <i className="ti ti-chevron-left"></i>
                        </button>
                        
                        {(() => {
                            const pages = [];
                            const tp = meta.total_pages;
                            if (tp <= 5) {
                                for (let i = 1; i <= tp; i++) pages.push(i);
                            } else {
                                pages.push(1);
                                if (page > 3) pages.push('...');
                                for (let i = Math.max(2, page - 1); i <= Math.min(tp - 1, page + 1); i++) pages.push(i);
                                if (page < tp - 2) pages.push('...');
                                pages.push(tp);
                            }
                            
                            return pages.map((p, i) => (
                                p === '...' 
                                    ? <span key={`dots-${i}`} style={{ padding: '0 4px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>...</span>
                                    : <button key={i} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                            ));
                        })()}

                        <button className="page-btn" disabled={page >= meta.total_pages} onClick={() => setPage(p => p + 1)}>
                            <i className="ti ti-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="modal-overlay" onClick={() => !deleting && setDeleteId(null)}>
                    <div className="modal-box modal-box-sm" onClick={e => e.stopPropagation()}>
                        <div className="delete-modal-body">
                            <div className="delete-icon-circle"><i className="ti ti-trash"></i></div>
                            <div className="delete-title">Hapus pengguna?</div>
                            <div className="delete-desc">
                                Akun <strong>{deleteName}</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
                            </div>
                            <div className="delete-actions">
                                <button className="btn-s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteId(null)} disabled={deleting}>
                                    Batal
                                </button>
                                <button className="btn-del-confirm" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
