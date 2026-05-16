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
            <div class="auth-form-title">Masuk ke akun</div>
            <div class="auth-form-sub">Masukkan username dan password kamu</div>

            <div id="globalError" class="alert-box alert-error" style="display:none;"></div>

            <form id="loginForm" autocomplete="off">
                <div class="form-group">
                    <label class="form-label-c">Username</label>
                    <div class="input-wrapper">
                        <i class="ti ti-user input-icon"></i>
                        <input type="text" class="form-input has-icon" id="username" placeholder="Masukkan username">
                    </div>
                    <div class="field-error" id="err-username"></div>
                </div>
                <div class="form-group">
                    <div class="label-row">
                        <label class="form-label-c" style="margin-bottom:0">Password</label>
                        <a href="#" class="label-link">Lupa password?</a>
                    </div>
                    <div class="input-wrapper" style="margin-top:5px">
                        <i class="ti ti-lock input-icon"></i>
                        <input type="password" class="form-input has-icon has-icon-right" id="password" placeholder="••••••••">
                        <button type="button" class="input-icon-right" onclick="togglePassword('password', this)" tabindex="-1">
                            <i class="ti ti-eye"></i>
                        </button>
                    </div>
                    <div class="field-error" id="err-password"></div>
                </div>
                <button type="submit" class="btn-p" style="width:100%;justify-content:center;margin-top:20px;padding:10px" id="btnSubmit">Masuk</button>
            </form>

            <div class="auth-form-footer">
                Belum punya akun? <a href="/auth/register">Daftar sekarang</a>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?>
<script src="/js/auth.js"></script>
<?= $this->endSection() ?>
