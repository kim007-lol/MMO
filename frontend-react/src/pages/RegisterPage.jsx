import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import AuthBranding from '../components/AuthBranding';
import api from '../api/axios';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [form, setForm] = useState({
        username: '', email: '', password: '', nama: '', no_hp: '', alamat: '', role: 'user'
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setGlobalError('');
    };

    const validate = () => {
        const err = {};
        if (!form.nama) err.nama = 'Nama wajib diisi';
        if (!form.username || form.username.indexOf(' ') >= 0) err.username = 'Username wajib diisi, tanpa spasi';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Format email tidak valid';
        if (!form.password || form.password.length < 8) err.password = 'Password minimal 8 karakter';
        if (!form.no_hp) err.no_hp = 'No. HP wajib diisi';
        if (!form.alamat) err.alamat = 'Alamat wajib diisi';
        
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const res = await api.post('/auth/register', form);
            if (res.data.status) {
                showToast('Akun berhasil dibuat', 'Silakan login', 'success');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setGlobalError(res.data.message);
            }
        } catch (err) {
            setGlobalError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            <AuthBranding />
            
            <div className="auth-form-side">
                <div className="auth-form-inner">
                    <div className="auth-form-title">Buat akun baru</div>
                    <div className="auth-form-sub">Isi data diri kamu untuk mendaftar</div>

                    {globalError && <div className="alert-box alert-error">{globalError}</div>}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label-c">Nama lengkap</label>
                                <div className="input-wrapper">
                                    <i className="ti ti-user input-icon"></i>
                                    <input type="text" name="nama" className={`form-input has-icon ${errors.nama ? 'input-error' : ''}`} placeholder="John Doe" value={form.nama} onChange={handleChange} />
                                </div>
                                {errors.nama && <div className="field-error">{errors.nama}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label-c">Username</label>
                                <div className="input-wrapper">
                                    <i className="ti ti-at input-icon"></i>
                                    <input type="text" name="username" className={`form-input has-icon ${errors.username ? 'input-error' : ''}`} placeholder="johndoe" value={form.username} onChange={handleChange} />
                                </div>
                                {errors.username && <div className="field-error">{errors.username}</div>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label-c">Email</label>
                            <div className="input-wrapper">
                                <i className="ti ti-mail input-icon"></i>
                                <input type="email" name="email" className={`form-input has-icon ${errors.email ? 'input-error' : ''}`} placeholder="john@email.com" value={form.email} onChange={handleChange} />
                            </div>
                            {errors.email && <div className="field-error">{errors.email}</div>}
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label-c">Password</label>
                                <div className="input-wrapper">
                                    <i className="ti ti-lock input-icon"></i>
                                    <input type={showPassword ? 'text' : 'password'} name="password" className={`form-input has-icon has-icon-right ${errors.password ? 'input-error' : ''}`} placeholder="Min. 8 karakter" value={form.password} onChange={handleChange} />
                                    <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                                        <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password && <div className="field-error">{errors.password}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label-c">No. handphone</label>
                                <div className="input-wrapper">
                                    <i className="ti ti-phone input-icon"></i>
                                    <input type="text" name="no_hp" className={`form-input has-icon ${errors.no_hp ? 'input-error' : ''}`} placeholder="0812xxxx" value={form.no_hp} onChange={handleChange} />
                                </div>
                                {errors.no_hp && <div className="field-error">{errors.no_hp}</div>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label-c">Alamat</label>
                            <textarea name="alamat" className={`form-input ${errors.alamat ? 'input-error' : ''}`} placeholder="Jl. Contoh No. 1, Kecamatan, Kota" value={form.alamat} onChange={handleChange}></textarea>
                            {errors.alamat && <div className="field-error">{errors.alamat}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label-c">Role</label>
                            <select name="role" className="form-input" value={form.role} onChange={handleChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-p btn-full" disabled={loading}>
                            {loading ? <><span className="spinner spinner-white" style={{ marginRight: '6px' }}></span>Mendaftar...</> : 'Daftar'}
                        </button>
                    </form>

                    <div className="auth-form-footer">
                        Sudah punya akun? <Link to="/login">Masuk di sini</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
