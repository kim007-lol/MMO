/**
 * auth.js — Handler form login & register untuk CI4 frontend.
 * Depends on: jQuery, common.js (togglePassword), API_BASE & showToast dari layout.
 */
(function($) {
    'use strict';

    // =============================
    // LOGIN FORM
    // =============================
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        $('.field-error').text('');
        $('.form-input').removeClass('input-error');
        $('#globalError').hide().text('');

        var u = $('#username').val().trim();
        var p = $('#password').val();
        var ok = true;

        if (!u) { $('#err-username').text('Username wajib diisi'); $('#username').addClass('input-error'); ok = false; }
        if (!p) { $('#err-password').text('Password wajib diisi'); $('#password').addClass('input-error'); ok = false; }
        if (!ok) return;

        var btn = $('#btnSubmit');
        btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Memproses...');

        $.ajax({
            url: API_BASE + '/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: u, password: p }),
            success: function(res) {
                if (res.status) {
                    // Simpan token ke PHP session via callback
                    $.ajax({
                        url: '/auth/save-token',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({ token: res.data.token, user: res.data.user }),
                        success: function() { window.location.href = '/users'; }
                    });
                } else {
                    $('#globalError').text(res.message).show();
                }
            },
            error: function(xhr) {
                $('#globalError').text(xhr.responseJSON?.message || 'Username atau password salah').show();
            },
            complete: function() {
                btn.prop('disabled', false).html('Masuk');
            }
        });
    });

    // =============================
    // REGISTER FORM
    // =============================
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        $('.field-error').text('');
        $('.form-input').removeClass('input-error');
        $('#globalError').hide().text('');

        var d = {
            nama: $('#nama').val().trim(),
            username: $('#username').val().trim(),
            email: $('#email').val().trim(),
            password: $('#password').val(),
            no_hp: $('#no_hp').val().trim(),
            alamat: $('#alamat').val().trim(),
            role: $('#role').val()
        };

        var ok = true;
        if (!d.nama)     { $('#err-nama').text('Nama wajib diisi'); $('#nama').addClass('input-error'); ok = false; }
        if (!d.username || d.username.indexOf(' ') >= 0) { $('#err-username').text('Username wajib diisi, tanpa spasi'); $('#username').addClass('input-error'); ok = false; }
        if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { $('#err-email').text('Format email tidak valid'); $('#email').addClass('input-error'); ok = false; }
        if (!d.password || d.password.length < 6) { $('#err-password').text('Password minimal 6 karakter'); $('#password').addClass('input-error'); ok = false; }
        if (!d.no_hp)    { $('#err-no_hp').text('No. HP wajib diisi'); $('#no_hp').addClass('input-error'); ok = false; }
        if (!d.alamat)   { $('#err-alamat').text('Alamat wajib diisi'); $('#alamat').addClass('input-error'); ok = false; }
        if (!ok) return;

        var btn = $('#btnSubmit');
        btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Mendaftar...');

        $.ajax({
            url: API_BASE + '/auth/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(d),
            success: function(res) {
                if (res.status) {
                    showToast('Akun berhasil dibuat', 'Silakan login', 'success');
                    setTimeout(function() { window.location.href = '/auth/login'; }, 1500);
                } else {
                    $('#globalError').text(res.message).show();
                }
            },
            error: function(xhr) {
                $('#globalError').text(xhr.responseJSON?.message || 'Terjadi kesalahan').show();
            },
            complete: function() {
                btn.prop('disabled', false).html('Daftar');
            }
        });
    });

})(jQuery);
