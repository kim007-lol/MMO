/**
 * users.js — Modul CRUD Users untuk CI4 frontend.
 * Depends on: jQuery, Bootstrap 5, common.js (escHtml, formatDate, getInitials, getAvatarClass), 
 *             API_BASE & showToast dari layout.
 *
 * Semua operasi CRUD berjalan via AJAX tanpa reload halaman.
 */
var UsersModule = (function($) {
    'use strict';

    // =============================
    // State
    // =============================
    var TOKEN = document.querySelector('meta[name="jwt-token"]')?.content || '';
    var currentPage = 1;
    var currentSearch = '';
    var deleteTargetId = null;
    var detailUserId = null;

    // Header default untuk request API
    function authHeaders() {
        return { 'Authorization': 'Bearer ' + TOKEN };
    }

    // =============================
    // Search (debounce 400ms)
    // =============================
    var searchTimer;
    $('#searchInput').on('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            currentSearch = $('#searchInput').val().trim();
            currentPage = 1;
            loadUsers();
        }, 400);
    });

    // =============================
    // Load Users (GET /api/users)
    // =============================
    function loadUsers() {
        var tb = $('#tableBody');

        // Skeleton loading
        var skeleton = '';
        for (var i = 0; i < 3; i++) {
            skeleton += '<tr><td colspan="7" style="padding:16px"><div class="skeleton" style="height:14px;width:' + (60 + Math.random() * 40) + '%"></div></td></tr>';
        }
        tb.html(skeleton);

        $.ajax({
            url: API_BASE + '/users',
            data: { page: currentPage, search: currentSearch },
            headers: authHeaders(),
            success: function(res) {
                if (!res.status || !res.data) return;

                var users = res.data.users || [];
                var d = res.data;
                $('#sidebarCount').text(d.total);

                if (users.length === 0) {
                    tb.html(
                        '<tr><td colspan="7"><div class="empty-state">' +
                        '<div class="empty-icon"><i class="ti ti-users"></i></div>' +
                        '<div class="empty-title">Belum ada pengguna</div>' +
                        '<div class="empty-sub">Klik tombol Tambah User untuk menambahkan pengguna pertama</div>' +
                        '</div></td></tr>'
                    );
                    $('#paginationWrapper').empty();
                    return;
                }

                var start = (d.page - 1) * d.limit;
                var html = '';
                users.forEach(function(u, i) {
                    var init = getInitials(u.nama);
                    var ac = getAvatarClass(u.id);
                    var rc = u.role === 'admin' ? 'badge-admin' : 'badge-user';
                    html += '<tr>' +
                        '<td>' + (start + i + 1) + '</td>' +
                        '<td><div class="user-cell"><div class="user-avatar ' + ac + '">' + init + '</div>' +
                        '<div><div class="user-info-name">' + escHtml(u.nama) + '</div>' +
                        '<div class="user-info-sub">' + escHtml(u.username) + '</div></div></div></td>' +
                        '<td>' + escHtml(u.username) + '</td>' +
                        '<td>' + escHtml(u.email) + '</td>' +
                        '<td>' + escHtml(u.no_hp || '-') + '</td>' +
                        '<td><span class="badge-role ' + rc + '">' + u.role + '</span></td>' +
                        '<td><div class="actions-cell">' +
                        '<button class="icon-btn" onclick="UsersModule.showDetail(' + u.id + ')"><i class="ti ti-eye"></i></button>' +
                        '<button class="icon-btn" onclick="UsersModule.openEditModal(' + u.id + ')"><i class="ti ti-edit"></i></button>' +
                        '<button class="icon-btn icon-btn-danger" onclick="UsersModule.openDeleteModal(' + u.id + ',\'' + escHtml(u.nama) + '\')"><i class="ti ti-trash"></i></button>' +
                        '</div></td></tr>';
                });
                tb.html(html);
                renderPagination(d);
            },
            error: function(xhr) {
                if (xhr.status === 401) window.location.href = '/auth/logout';
            }
        });
    }

    // =============================
    // Pagination
    // =============================
    function renderPagination(d) {
        var pw = $('#paginationWrapper');
        if (d.total_pages <= 1) { pw.empty(); return; }

        var start = (d.page - 1) * d.limit + 1;
        var end = Math.min(d.page * d.limit, d.total);
        var h = '<div class="pagination-info">Menampilkan ' + start + '–' + end + ' dari ' + d.total + ' pengguna</div>';
        h += '<div class="pagination-btns">';
        h += '<button class="page-btn" ' + (d.page <= 1 ? 'disabled' : '') + ' onclick="UsersModule.goPage(' + (d.page - 1) + ')"><i class="ti ti-chevron-left"></i></button>';

        var pages = [], tp = d.total_pages, cp = d.page;
        if (tp <= 5) {
            for (var i = 1; i <= tp; i++) pages.push(i);
        } else {
            pages = [1];
            if (cp > 3) pages.push('...');
            for (var i = Math.max(2, cp - 1); i <= Math.min(tp - 1, cp + 1); i++) pages.push(i);
            if (cp < tp - 2) pages.push('...');
            pages.push(tp);
        }
        pages.forEach(function(p) {
            if (p === '...') {
                h += '<span style="padding:0 4px;color:var(--text-tertiary);display:flex;align-items:center">...</span>';
            } else {
                h += '<button class="page-btn' + (p === cp ? ' active' : '') + '" onclick="UsersModule.goPage(' + p + ')">' + p + '</button>';
            }
        });

        h += '<button class="page-btn" ' + (d.page >= tp ? 'disabled' : '') + ' onclick="UsersModule.goPage(' + (d.page + 1) + ')"><i class="ti ti-chevron-right"></i></button></div>';
        pw.html(h);
    }

    function goPage(p) {
        currentPage = p;
        loadUsers();
    }

    // =============================
    // Role Card Selection
    // =============================
    function selectRole(el) {
        document.querySelectorAll('.role-card').forEach(function(c) { c.classList.remove('selected'); });
        el.classList.add('selected');
        document.getElementById('formRole').value = el.dataset.role;
    }

    // =============================
    // Modal: Tambah User
    // =============================
    function openAddModal() {
        $('#modalTitle').text('Tambah pengguna baru');
        $('#formUserId').val('');
        $('#userForm')[0].reset();
        $('#lblPwd').text('Password');
        $('#formPassword').attr('placeholder', 'Min. 6 karakter');
        $('#formBtnText').text('Simpan');
        $('.field-error').text('');
        $('.form-input').removeClass('input-error');
        $('#modalGlobalError').hide().text('');
        document.querySelectorAll('.role-card').forEach(function(c) { c.classList.remove('selected'); });
        document.querySelector('.role-card[data-role="user"]').classList.add('selected');
        $('#formRole').val('user');
        new bootstrap.Modal('#userModal').show();
    }

    // =============================
    // Modal: Edit User
    // =============================
    function openEditModal(id) {
        $.ajax({
            url: API_BASE + '/users/' + id,
            headers: authHeaders(),
            success: function(res) {
                if (!res.status) return;
                var u = res.data;
                $('#modalTitle').text('Edit pengguna');
                $('#formUserId').val(u.id);
                $('#formUsername').val(u.username);
                $('#formEmail').val(u.email);
                $('#formPassword').val('');
                $('#lblPwd').text('Password baru');
                $('#formPassword').attr('placeholder', 'Kosongkan jika tidak ingin ubah');
                $('#formNama').val(u.nama);
                $('#formNoHp').val(u.no_hp);
                $('#formAlamat').val(u.alamat);
                $('#formBtnText').text('Perbarui');
                $('.field-error').text('');
                $('#modalGlobalError').hide().text('');
                document.querySelectorAll('.role-card').forEach(function(c) { c.classList.remove('selected'); });
                document.querySelector('.role-card[data-role="' + u.role + '"]')?.classList.add('selected');
                $('#formRole').val(u.role);
                new bootstrap.Modal('#userModal').show();
            }
        });
    }

    // =============================
    // Form Submit (Create / Update)
    // =============================
    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        $('.field-error').text('');
        $('#modalGlobalError').hide().text('');

        var uid = $('#formUserId').val();
        var isEdit = !!uid;
        var p = {
            username: $('#formUsername').val().trim(),
            email: $('#formEmail').val().trim(),
            nama: $('#formNama').val().trim(),
            no_hp: $('#formNoHp').val().trim(),
            alamat: $('#formAlamat').val().trim(),
            role: $('#formRole').val()
        };
        var pwd = $('#formPassword').val();
        if (pwd) p.password = pwd;

        // Validasi client-side
        var ok = true;
        if (!p.username) { $('#fe-username').text('Username wajib diisi'); ok = false; }
        if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) { $('#fe-email').text('Format email tidak valid'); ok = false; }
        if (!isEdit && (!pwd || pwd.length < 6)) { $('#fe-password').text('Password minimal 6 karakter'); ok = false; }
        if (!p.nama) { $('#fe-nama').text('Nama wajib diisi'); ok = false; }
        if (!ok) return;

        var btn = $('#formBtn');
        btn.prop('disabled', true);
        $('#formBtnText').text(isEdit ? 'Memperbarui...' : 'Menyimpan...');

        $.ajax({
            url: API_BASE + '/users' + (isEdit ? '/' + uid : ''),
            method: isEdit ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: authHeaders(),
            data: JSON.stringify(p),
            success: function(res) {
                if (res.status) {
                    bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
                    showToast(isEdit ? 'Data berhasil diperbarui' : 'Pengguna berhasil ditambahkan', '', 'success');
                    loadUsers();
                } else {
                    $('#modalGlobalError').text(res.message).show();
                }
            },
            error: function(xhr) {
                $('#modalGlobalError').text(xhr.responseJSON?.message || 'Terjadi kesalahan').show();
            },
            complete: function() {
                btn.prop('disabled', false);
                $('#formBtnText').text($('#formUserId').val() ? 'Perbarui' : 'Simpan');
            }
        });
    });

    // =============================
    // Modal: Detail User
    // =============================
    function showDetail(id) {
        detailUserId = id;
        var m = new bootstrap.Modal('#detailModal');
        $('#detailBody').html('<div style="text-align:center;padding:32px"><div class="spinner-border spinner-border-sm"></div></div>');
        m.show();

        $.ajax({
            url: API_BASE + '/users/' + id,
            headers: authHeaders(),
            success: function(res) {
                if (!res.status) return;
                var u = res.data;
                var init = getInitials(u.nama);
                var ac = getAvatarClass(u.id);
                var rc = u.role === 'admin' ? 'badge-admin' : 'badge-user';

                $('#detailBody').html(
                    '<div class="detail-header"><div class="detail-avatar-lg user-avatar ' + ac + '" style="width:56px;height:56px;font-size:18px">' + init + '</div>' +
                    '<div><div style="font-size:16px;font-weight:500">' + escHtml(u.nama) + '</div>' +
                    '<span class="badge-role ' + rc + '" style="margin-top:4px">' + u.role + '</span></div></div>' +
                    '<div class="detail-row"><div class="detail-row-label"><i class="ti ti-at"></i>Username</div><div class="detail-row-value">' + escHtml(u.username) + '</div></div>' +
                    '<div class="detail-row"><div class="detail-row-label"><i class="ti ti-mail"></i>Email</div><div class="detail-row-value">' + escHtml(u.email) + '</div></div>' +
                    '<div class="detail-row"><div class="detail-row-label"><i class="ti ti-phone"></i>No. HP</div><div class="detail-row-value">' + escHtml(u.no_hp || '-') + '</div></div>' +
                    '<div class="detail-row"><div class="detail-row-label"><i class="ti ti-map-pin"></i>Alamat</div><div class="detail-row-value">' + escHtml(u.alamat || '-') + '</div></div>' +
                    '<div class="detail-row"><div class="detail-row-label"><i class="ti ti-clock"></i>Bergabung</div><div class="detail-row-value">' + formatDate(u.created_at) + '</div></div>'
                );
            }
        });
    }

    // Detail → Edit transition
    $('#detailEditBtn').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('detailModal')).hide();
        if (detailUserId) openEditModal(detailUserId);
    });

    // =============================
    // Modal: Hapus User
    // =============================
    function openDeleteModal(id, name) {
        deleteTargetId = id;
        $('#deleteUserName').text(name);
        new bootstrap.Modal('#deleteModal').show();
    }

    function confirmDelete() {
        if (!deleteTargetId) return;
        var btn = $('#confirmDelBtn');
        btn.prop('disabled', true).text('Menghapus...');

        $.ajax({
            url: API_BASE + '/users/' + deleteTargetId,
            method: 'DELETE',
            headers: authHeaders(),
            success: function(res) {
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                if (res.status) {
                    showToast('Pengguna berhasil dihapus', '', 'success');
                    loadUsers();
                } else {
                    showToast(res.message, '', 'error');
                }
            },
            error: function() {
                showToast('Gagal menghapus pengguna', '', 'error');
            },
            complete: function() {
                btn.prop('disabled', false).text('Hapus');
                deleteTargetId = null;
            }
        });
    }

    // =============================
    // Init: Load data saat halaman siap
    // =============================
    $(document).ready(function() {
        loadUsers();
    });

    // =============================
    // Public API — expose fungsi yang dipanggil dari onclick HTML
    // =============================
    return {
        goPage: goPage,
        selectRole: selectRole,
        openAddModal: openAddModal,
        openEditModal: openEditModal,
        showDetail: showDetail,
        openDeleteModal: openDeleteModal,
        confirmDelete: confirmDelete
    };

})(jQuery);
