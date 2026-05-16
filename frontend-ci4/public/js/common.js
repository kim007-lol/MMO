/**
 * common.js — Fungsi utilitas global untuk CI4 frontend.
 * Di-include di layouts/main.php agar tersedia di semua halaman.
 */

/**
 * Toggle visibility password input field.
 * @param {string} inputId - ID dari input element
 * @param {HTMLElement} btn - Button element yang diklik
 */
function togglePassword(inputId, btn) {
    var input = document.getElementById(inputId);
    var icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ti ti-eye-off';
    } else {
        input.type = 'password';
        icon.className = 'ti ti-eye';
    }
}

/**
 * Escape HTML entities untuk mencegah XSS saat render string ke DOM.
 * @param {string} str - String yang akan di-escape
 * @returns {string} Escaped string
 */
function escHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Format ISO date string ke format Indonesia (contoh: "16 Mei 2026").
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    var d = new Date(dateStr);
    var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

// Avatar helpers
var avatarColors = ['avatar-blue', 'avatar-green', 'avatar-pink'];

function getInitials(name) {
    return (name || '').split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
}

function getAvatarClass(id) {
    return avatarColors[id % 3];
}
