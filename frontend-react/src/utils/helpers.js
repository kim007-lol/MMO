/**
 * Shared helper utilities untuk komponen React.
 * Dipindahkan dari UserListPage & UserDetailPage agar tidak duplikat.
 */

// Warna avatar berdasarkan ID user
const avatarColors = ['avatar-blue', 'avatar-green', 'avatar-pink'];

/**
 * Mengembalikan CSS class avatar berdasarkan user ID.
 * @param {number} id - User ID
 * @returns {string} CSS class name
 */
export const getAvatarClass = (id) => avatarColors[id % 3];

/**
 * Mengambil inisial dari nama lengkap (maks 2 huruf).
 * @param {string} name - Nama lengkap
 * @returns {string} Inisial (uppercase)
 */
export const getInitials = (name) =>
    (name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

/**
 * Format tanggal ISO ke format Indonesia (contoh: "16 Mei 2026").
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};
