import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthBranding from '../components/AuthBranding';
import api from '../api/axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [form, setForm] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = {};
        if (!form.username) err.username = 'Username wajib diisi';
        if (!form.password) err.password = 'Password wajib diisi';
        
        if (Object.keys(err).length > 0) {
            setErrors(err);
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/auth/login', form);
            if (res.data.status) {
                login(res.data.data.token, res.data.data.user);
                navigate('/users');
            } else {
                setGlobalError(res.data.message);
            }
        } catch (err) {
            setGlobalError(err.response?.data?.message || 'Username atau password salah');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            <AuthBranding />
            
            <div className="auth-form-side">
                <div className="auth-form-inner">
                    <div className="auth-form-title">Masuk ke akun</div>
                    <div className="auth-form-sub">Masukkan username dan password kamu</div>

                    {globalError && <div className="alert-box alert-error">{globalError}</div>}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label-c">Username</label>
                            <div className="input-wrapper">
                                <i className="ti ti-user input-icon"></i>
                                <input 
                                    type="text" 
                                    name="username"
                                    className={`form-input has-icon ${errors.username ? 'input-error' : ''}`} 
                                    placeholder="Masukkan username"
                                    value={form.username}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.username && <div className="field-error">{errors.username}</div>}
                        </div>
                        
                        <div className="form-group">
                            <div className="label-row">
                                <label className="form-label-c" style={{ marginBottom: 0 }}>Password</label>
                                <a href="#" className="label-link" onClick={e => e.preventDefault()}>Lupa password?</a>
                            </div>
                            <div className="input-wrapper" style={{ marginTop: '5px' }}>
                                <i className="ti ti-lock input-icon"></i>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    name="password"
                                    className={`form-input has-icon has-icon-right ${errors.password ? 'input-error' : ''}`} 
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                                    <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && <div className="field-error">{errors.password}</div>}
                        </div>
                        
                        <button type="submit" className="btn-p btn-full" disabled={loading}>
                            {loading ? <><span className="spinner spinner-white" style={{ marginRight: '6px' }}></span>Memproses...</> : 'Masuk'}
                        </button>
                    </form>

                    <div className="auth-form-footer">
                        Belum punya akun? <Link to="/register">Daftar sekarang</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
