<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<!-- Topbar -->
<div class="topbar">
    <div class="topbar-left">
        <button class="hamburger" onclick="toggleSidebar()"><i class="ti ti-menu-2"></i></button>
        <a href="/users" class="topbar-brand"><div class="topbar-brand-icon"><i class="ti ti-users-group"></i></div><span>MMO User Management</span></a>
    </div>
    <div class="topbar-right">
        <span class="topbar-user-name"><?= esc((string)($user['nama'] ?? $user['username'] ?? 'User')) ?></span>
        <div class="topbar-avatar"><?= strtoupper(substr($user['nama'] ?? $user['username'] ?? 'U', 0, 2)) ?></div>
    </div>
</div>

<div class="sidebar-overlay" onclick="toggleSidebar()"></div>

<div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div style="flex:1">
            <div class="sidebar-section-label">Menu</div>
            <div class="sidebar-nav">
                <a href="/users" class="sidebar-item active">
                    <i class="ti ti-users"></i>Manajemen User<span class="nav-badge" id="sidebarCount">0</span>
                </a>
            </div>
        </div>
        <div class="sidebar-bottom">
            <div class="sidebar-section-label">Akun</div>
            <div class="sidebar-nav">
                <a href="/auth/logout" class="sidebar-item"><i class="ti ti-logout"></i>Keluar</a>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="app-main">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
            <div>
                <div style="font-size:18px;font-weight:500">Manajemen User</div>
                <div style="font-size:13px;color:var(--text-secondary)">Daftar semua pengguna terdaftar</div>
            </div>
            <button class="btn-p" onclick="UsersModule.openAddModal()"><i class="ti ti-plus" style="font-size:15px"></i><span class="btn-text">Tambah User</span></button>
        </div>

        <!-- Toolbar -->
        <div style="margin-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px" class="toolbar">
            <div style="display:flex;align-items:center;background:var(--surface);border:.5px solid var(--border);border-radius:8px;padding:0 12px;width:300px;max-width:100%">
                <i class="ti ti-search" style="font-size:15px;color:var(--text-tertiary)"></i>
                <input type="text" id="searchInput" placeholder="Cari nama, username, atau email..." style="border:none;background:transparent;padding:8px;font-size:13px;width:100%;outline:none;font-family:inherit;color:var(--text-primary)">
            </div>
        </div>

        <!-- Table -->
        <div class="data-card" style="margin-top:16px">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width:48px">No.</th>
                        <th>Nama</th>
                        <th style="width:140px">Username</th>
                        <th style="width:180px">Email</th>
                        <th style="width:130px">No. HP</th>
                        <th style="width:90px">Role</th>
                        <th style="width:100px">Aksi</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <tr><td colspan="7"><div class="empty-state"><div class="empty-icon"><i class="ti ti-loader"></i></div><div class="empty-title">Memuat data...</div></div></td></tr>
                </tbody>
            </table>
        </div>

        <div class="pagination-wrapper" id="paginationWrapper"></div>
    </main>
</div>

<!-- Modal Tambah/Edit -->
<div class="modal fade" id="userModal" tabindex="-1"><div class="modal-dialog" style="max-width:460px"><div class="modal-content">
    <div class="modal-header-c"><h5 id="modalTitle">Tambah pengguna baru</h5><button type="button" class="icon-btn" data-bs-dismiss="modal"><i class="ti ti-x" style="font-size:14px"></i></button></div>
    <form id="userForm">
    <div class="modal-body-c">
        <div id="modalGlobalError" class="alert-box alert-error" style="display:none;margin-bottom:16px;"></div>
        <input type="hidden" id="formUserId">
        <div class="section-label" style="margin-top:0">Informasi Akun</div>
        <div class="form-row-2">
            <div class="form-group"><label class="form-label-c">Username</label><input type="text" class="form-input" id="formUsername" placeholder="johndoe"><div class="field-error" id="fe-username"></div></div>
            <div class="form-group">
                <label class="form-label-c" id="lblPwd">Password</label>
                <div class="input-wrapper">
                    <input type="password" class="form-input has-icon-right" id="formPassword" placeholder="Min. 6 karakter">
                    <button type="button" class="input-icon-right" onclick="togglePassword('formPassword', this)" tabindex="-1">
                        <i class="ti ti-eye"></i>
                    </button>
                </div>
                <div class="field-error" id="fe-password"></div>
            </div>
        </div>
        <div class="form-group"><label class="form-label-c">Email</label><input type="email" class="form-input" id="formEmail" placeholder="john@email.com"><div class="field-error" id="fe-email"></div></div>

        <div class="section-label">Data Diri</div>
        <div class="form-group"><label class="form-label-c">Nama lengkap</label><input type="text" class="form-input" id="formNama" placeholder="John Doe"><div class="field-error" id="fe-nama"></div></div>
        <div class="form-group"><label class="form-label-c">No. handphone</label><input type="text" class="form-input" id="formNoHp" placeholder="0812xxxx"></div>
        <div class="form-group"><label class="form-label-c">Alamat</label><textarea class="form-input" id="formAlamat" placeholder="Jl. ..."></textarea></div>

        <div class="section-label">Role</div>
        <div class="role-cards">
            <div class="role-card selected" data-role="user" onclick="UsersModule.selectRole(this)">
                <div class="role-card-icon"><i class="ti ti-user"></i></div>
                <div><div class="role-card-name">User</div><div class="role-card-desc">Akses standar</div></div>
            </div>
            <div class="role-card" data-role="admin" onclick="UsersModule.selectRole(this)">
                <div class="role-card-icon"><i class="ti ti-shield"></i></div>
                <div><div class="role-card-name">Admin</div><div class="role-card-desc">Akses penuh</div></div>
            </div>
        </div>
        <input type="hidden" id="formRole" value="user">
    </div>
    <div class="modal-footer-c">
        <button type="button" class="btn-s" data-bs-dismiss="modal">Batal</button>
        <button type="submit" class="btn-p" id="formBtn"><i class="ti ti-check" style="font-size:15px"></i><span id="formBtnText">Simpan</span></button>
    </div>
    </form>
</div></div></div>

<!-- Modal Detail -->
<div class="modal fade" id="detailModal" tabindex="-1"><div class="modal-dialog" style="max-width:420px"><div class="modal-content">
    <div class="modal-header-c"><h5>Detail pengguna</h5><button type="button" class="icon-btn" data-bs-dismiss="modal"><i class="ti ti-x" style="font-size:14px"></i></button></div>
    <div class="modal-body-c" id="detailBody"><div style="text-align:center;padding:32px"><div class="spinner-border spinner-border-sm"></div></div></div>
    <div class="modal-footer-c">
        <button type="button" class="btn-s" style="flex:1" data-bs-dismiss="modal">Tutup</button>
        <button type="button" class="btn-p" style="flex:1" id="detailEditBtn">Edit</button>
    </div>
</div></div></div>

<!-- Modal Hapus -->
<div class="modal fade" id="deleteModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered" style="max-width:360px"><div class="modal-content">
    <div class="delete-modal-body">
        <div class="delete-icon-circle"><i class="ti ti-trash"></i></div>
        <div class="delete-title">Hapus pengguna?</div>
        <div class="delete-desc">Akun <strong id="deleteUserName"></strong> akan dihapus secara permanen dan tidak dapat dikembalikan.</div>
        <div class="delete-actions">
            <button class="btn-s" data-bs-dismiss="modal">Batal</button>
            <button class="btn-del-confirm" id="confirmDelBtn" onclick="UsersModule.confirmDelete()">Hapus</button>
        </div>
    </div>
</div></div></div>
<?= $this->endSection() ?>

<?= $this->section('scripts') ?>
<script src="/js/users.js"></script>
<?= $this->endSection() ?>
