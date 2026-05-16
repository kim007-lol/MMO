<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="auth-split">
    <div class="auth-dark">
        <div class="auth-dark-logo">
            <div class="auth-dark-logo-icon"><i class="ti ti-users-group"></i></div>
            <span>MMO User Management</span>
        </div>
        <div class="auth-dark-center">
            <div class="auth-dark-heading">Kelola pengguna<br>dengan mudah.</div>
            <div class="auth-dark-sub">Platform manajemen user untuk tim kamu.</div>
            <div class="auth-features">
                <div class="auth-feature"><div class="auth-feature-icon"><i class="ti ti-shield-lock"></i></div><span>JWT Authentication</span></div>
                <div class="auth-feature"><div class="auth-feature-icon"><i class="ti ti-users"></i></div><span>CRUD Manajemen User</span></div>
                <div class="auth-feature"><div class="auth-feature-icon"><i class="ti ti-refresh"></i></div><span>AJAX tanpa reload halaman</span></div>
            </div>
        </div>
        <div class="auth-dark-footer">&copy; 2026 MMO User Management</div>
    </div>
    <div class="auth-form-side">
        <div class="auth-form-inner">
            <div class="auth-form-title">Buat akun baru</div>
            <div class="auth-form-sub">Isi data diri kamu untuk mendaftar</div>

            <div id="globalError" class="alert-box alert-error" style="display:none;"></div>

            <form id="registerForm" autocomplete="off">
                <div class="form-row-2">
                    <div class="form-group">
                        <label class="form-label-c">Nama lengkap</label>
                        <div class="input-wrapper"><i class="ti ti-user input-icon"></i><input type="text" class="form-input has-icon" id="nama" placeholder="John Doe"></div>
                        <div class="field-error" id="err-nama"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label-c">Username</label>
                        <div class="input-wrapper"><i class="ti ti-at input-icon"></i><input type="text" class="form-input has-icon" id="username" placeholder="johndoe"></div>
                        <div class="field-error" id="err-username"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label-c">Email</label>
                    <div class="input-wrapper"><i class="ti ti-mail input-icon"></i><input type="email" class="form-input has-icon" id="email" placeholder="john@email.com"></div>
                    <div class="field-error" id="err-email"></div>
                </div>
                <div class="form-row-2">
                    <div class="form-group">
                        <label class="form-label-c">Password</label>
                        <div class="input-wrapper">
                            <i class="ti ti-lock input-icon"></i>
                            <input type="password" class="form-input has-icon has-icon-right" id="password" placeholder="Min. 8 karakter">
                            <button type="button" class="input-icon-right" onclick="togglePassword('password', this)" tabindex="-1">
                                <i class="ti ti-eye"></i>
                            </button>
                        </div>
                        <div class="field-error" id="err-password"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label-c">No. handphone</label>
                        <div class="input-wrapper"><i class="ti ti-phone input-icon"></i><input type="text" class="form-input has-icon" id="no_hp" placeholder="0812xxxx"></div>
                        <div class="field-error" id="err-no_hp"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label-c">Alamat</label>
                    <textarea class="form-input" id="alamat" placeholder="Jl. Contoh No. 1, Kecamatan, Kota"></textarea>
                    <div class="field-error" id="err-alamat"></div>
                </div>
                <div class="form-group">
                    <label class="form-label-c">Role</label>
                    <select class="form-input" id="role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn-p" style="width:100%;justify-content:center;margin-top:20px;padding:10px" id="btnSubmit">Daftar</button>
            </form>

            <div class="auth-form-footer">
                Sudah punya akun? <a href="/auth/login">Masuk di sini</a>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?>
<script src="/js/auth.js"></script>
<?= $this->endSection() ?>
