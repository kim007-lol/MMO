import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function UserFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const { showToast } = useToast();

    const [form, setForm] = useState({
        username: '', email: '', password: '', nama: '', no_hp: '', alamat: '', role: 'user'
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    const [showPassword, setShowPassword] = useState(false);

    const loadUser = useCallback(async () => {
        try {
            const res = await api.get(`/users/${id}`);
            if (res.data.status) {
                const u = res.data.data;
                setForm({
                    username: u.username,
                    email: u.email,
                    password: '',
                    nama: u.nama,
                    no_hp: u.no_hp || '',
                    alamat: u.alamat || '',
                    role: u.role,
                });
            }
        } catch (err) {
            showToast('Gagal memuat data pengguna', '', 'error');
            navigate('/users');
        } finally {
            setPageLoading(false);
        }
    }, [id, showToast, navigate]);

    useEffect(() => {
        if (isEdit) {
            loadUser();
        }
    }, [isEdit, loadUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setGlobalError('');
    };

    const handleRoleChange = (role) => {
        setForm({ ...form, role });
    };

    const validate = () => {
        const err = {};
        if (!form.username) err.username = 'Username wajib diisi';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Format email tidak valid';
        if (!isEdit && (!form.password || form.password.length < 6)) err.password = 'Password minimal 6 karakter';
        if (isEdit && form.password && form.password.length < 6) err.password = 'Password minimal 6 karakter';
        if (!form.nama) err.nama = 'Nama wajib diisi';
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        const payload = { ...form };
        if (isEdit && !payload.password) delete payload.password;

        try {
            let res;
            if (isEdit) {
                res = await api.put(`/users/${id}`, payload);
            } else {
                res = await api.post('/users', payload);
            }

            if (res.data.status) {
                showToast(isEdit ? 'Data berhasil diperbarui' : 'Pengguna berhasil ditambahkan');
                window.dispatchEvent(new Event('userListUpdated'));
                navigate('/users');
            } else {
                setGlobalError(res.data.message);
            }
        } catch (err) {
            setGlobalError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="page-card">
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-card">
            <div className="page-header">
                <h2>{isEdit ? 'Edit pengguna' : 'Tambah pengguna baru'}</h2>
                <Link to="/users" className="btn-s">
                    <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i>
                    <span className="btn-text-hide">Kembali</span>
                </Link>
            </div>

            {globalError && <div className="alert-box alert-error">{globalError}</div>}

            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="section-label" style={{ marginTop: 0 }}>Informasi Akun</div>
                <div className="form-row-2">
                    <div className="form-group">
                        <label className="form-label-c">Username</label>
                        <input type="text" name="username" className={`form-input ${errors.username ? 'input-error' : ''}`} placeholder="johndoe" value={form.username} onChange={handleChange} />
                        {errors.username && <div className="field-error">{errors.username}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label-c">{isEdit ? 'Password baru' : 'Password'}</label>
                        <div className="input-wrapper">
                            <input type={showPassword ? 'text' : 'password'} name="password" className={`form-input has-icon-right ${errors.password ? 'input-error' : ''}`} placeholder={isEdit ? 'Kosongkan jika tidak ingin ubah' : 'Min. 6 karakter'} value={form.password} onChange={handleChange} />
                            <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                                <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}></i>
                            </button>
                        </div>
                        {errors.password && <div className="field-error">{errors.password}</div>}
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label-c">Email</label>
                    <input type="email" name="email" className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="john@email.com" value={form.email} onChange={handleChange} />
                    {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="section-label">Data Diri</div>
                <div className="form-group">
                    <label className="form-label-c">Nama lengkap</label>
                    <input type="text" name="nama" className={`form-input ${errors.nama ? 'input-error' : ''}`} placeholder="John Doe" value={form.nama} onChange={handleChange} />
                    {errors.nama && <div className="field-error">{errors.nama}</div>}
                </div>
                <div className="form-group">
                    <label className="form-label-c">No. handphone</label>
                    <input type="text" name="no_hp" className="form-input" placeholder="0812xxxx" value={form.no_hp} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label-c">Alamat</label>
                    <textarea name="alamat" className="form-input" placeholder="Jl. ..." value={form.alamat} onChange={handleChange}></textarea>
                </div>

                <div className="section-label">Role</div>
                <div className="role-cards">
                    <div className={`role-card ${form.role === 'user' ? 'selected' : ''}`} onClick={() => handleRoleChange('user')}>
                        <div className="role-card-icon"><i className="ti ti-user"></i></div>
                        <div>
                            <div className="role-card-name">User</div>
                            <div className="role-card-desc">Akses standar</div>
                        </div>
                    </div>
                    <div className={`role-card ${form.role === 'admin' ? 'selected' : ''}`} onClick={() => handleRoleChange('admin')}>
                        <div className="role-card-icon"><i className="ti ti-shield"></i></div>
                        <div>
                            <div className="role-card-name">Admin</div>
                            <div className="role-card-desc">Akses penuh</div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <Link to="/users" className="btn-s">Batal</Link>
                    <button type="submit" className="btn-p" disabled={loading}>
                        {loading ? (
                            <><span className="spinner spinner-white"></span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</>
                        ) : (
                            <><i className="ti ti-check" style={{ fontSize: 16 }}></i>{isEdit ? 'Perbarui' : 'Simpan'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
