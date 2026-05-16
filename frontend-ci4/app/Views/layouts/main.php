<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'MMO User Management' ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <?php if (isset($token)): ?>
    <meta name="jwt-token" content="<?= esc($token) ?>">
    <?php endif; ?>
    <style>
        :root{--primary:#18181b;--primary-hover:#2d2d30;--bg:#fff;--surface:#f9f9f8;--border:#e4e4e3;--border-hover:#c4c4c2;--text-primary:#18181b;--text-secondary:#6b7280;--text-tertiary:#9ca3af;--success-bg:#E1F5EE;--success-text:#085041;--success-border:#9FE1CB;--danger-bg:#FCEBEB;--danger-text:#791F1F;--danger-border:#F7C1C1}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif;color:var(--text-primary);background:var(--bg)}

        /* TOPBAR */
        .topbar{height:52px;background:#fff;border-bottom:.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:100}
        .topbar-left{display:flex;align-items:center;gap:10px}
        .hamburger{display:none;background:none;border:none;font-size:20px;color:var(--text-primary);cursor:pointer}
        .topbar-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary)}
        .topbar-brand-icon{width:30px;height:30px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px}
        .topbar-brand span{font-size:14px;font-weight:500}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .topbar-user-name{font-size:13px;color:var(--text-secondary)}
        .topbar-avatar{width:30px;height:30px;background:var(--primary);border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:500}

        /* SIDEBAR */
        .sidebar{width:200px;background:var(--surface);border-right:.5px solid var(--border);padding:16px 12px;min-height:calc(100vh - 52px);display:flex;flex-direction:column;position:fixed;top:52px;left:0;z-index:90}
        .sidebar-section-label{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);padding:0 8px;margin-bottom:6px}
        .sidebar-nav{display:flex;flex-direction:column;gap:2px}
        .sidebar-item{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:7px;font-size:13px;color:var(--text-secondary);cursor:pointer;text-decoration:none;border:none;background:none;width:100%;font-family:inherit}
        .sidebar-item:hover{background:#f3f3f2}
        .sidebar-item.active{background:#f3f3f2;color:var(--text-primary);font-weight:500}
        .sidebar-item i{font-size:16px}
        .sidebar-item .nav-badge{margin-left:auto;background:var(--primary);color:#fff;font-size:10px;font-weight:500;padding:1px 6px;border-radius:999px}
        .sidebar-bottom{margin-top:auto}
        .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:89}

        /* APP LAYOUT */
        .app-shell{display:flex;min-height:calc(100vh - 52px)}
        .app-main{margin-left:200px;flex:1;padding:28px 32px;min-height:calc(100vh - 52px)}

        /* BUTTONS */
        .btn-p{background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:inherit}
        .btn-p:hover{background:var(--primary-hover)}
        .btn-p:disabled{opacity:.6;cursor:not-allowed}
        .btn-s{background:transparent;color:var(--text-secondary);border:.5px solid var(--border);border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:inherit}
        .btn-s:hover{border-color:var(--border-hover)}
        .icon-btn{width:28px;height:28px;border-radius:6px;border:.5px solid var(--border);background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-secondary)}
        .icon-btn:hover{border-color:var(--border-hover)}
        .icon-btn-danger{background:var(--danger-bg);border-color:var(--danger-border);color:#A32D2D}

        /* FORMS */
        .form-label-c{display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:5px}
        .form-input{width:100%;height:36px;padding:8px 12px;border:.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text-primary);background:#fff}
        .form-input:focus{outline:none;border:1px solid var(--primary)}
        .form-input.has-icon{padding-left:34px}
        .form-input.input-error{border:1px solid #E24B4A}
        .input-wrapper{position:relative}
        .input-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--text-tertiary)}
        .input-icon-right{position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:16px;color:var(--text-tertiary);cursor:pointer;background:none;border:none;padding:0;display:flex;align-items:center;justify-content:center}
        .input-icon-right:hover{color:var(--text-secondary)}
        .form-input.has-icon-right{padding-right:34px}
        textarea.form-input{height:auto;min-height:80px;resize:vertical}
        select.form-input{appearance:auto}
        .field-error{font-size:11px;color:#E24B4A;margin-top:3px}
        .form-group{margin-bottom:14px}
        .form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}

        /* BADGE */
        .badge-role{display:inline-block;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:500}
        .badge-admin{background:var(--primary);color:#fff}
        .badge-user{background:var(--surface);border:.5px solid var(--border);color:var(--text-secondary)}

        /* ALERT */
        .alert-box{padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px}
        .alert-success{background:var(--success-bg);color:var(--success-text);border:.5px solid var(--success-border)}
        .alert-error{background:var(--danger-bg);color:var(--danger-text);border:.5px solid var(--danger-border)}

        /* TABLE */
        .data-card{background:#fff;border:.5px solid var(--border);border-radius:12px;overflow:hidden}
        .data-table{width:100%;border-collapse:collapse}
        .data-table thead{background:var(--surface)}
        .data-table th{padding:10px 16px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);text-align:left}
        .data-table td{padding:13px 16px;border-bottom:.5px solid var(--border);font-size:13px;vertical-align:middle}
        .data-table tr:last-child td{border-bottom:none}
        .data-table tbody tr:hover{background:var(--surface)}
        .user-cell{display:flex;align-items:center;gap:10px}
        .user-avatar{width:32px;height:32px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;flex-shrink:0}
        .user-info-name{font-size:13px;font-weight:500}
        .user-info-sub{font-size:11px;color:var(--text-tertiary)}
        .actions-cell{display:flex;gap:4px}
        .avatar-blue{background:#E6F1FB;color:#0C447C}
        .avatar-green{background:#EAF3DE;color:#27500A}
        .avatar-pink{background:#FBEAF0;color:#72243E}

        /* SKELETON */
        .skeleton{background:#f3f3f2;border-radius:4px;animation:pulse 1.5s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

        /* PAGINATION */
        .pagination-wrapper{display:flex;justify-content:space-between;align-items:center;margin-top:16px;flex-wrap:wrap;gap:8px}
        .pagination-info{font-size:12px;color:var(--text-tertiary)}
        .pagination-btns{display:flex;gap:4px}
        .page-btn{width:32px;height:32px;border-radius:7px;border:.5px solid var(--border);background:#fff;color:var(--text-secondary);font-size:13px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-family:inherit}
        .page-btn:hover:not(:disabled):not(.active){border-color:var(--border-hover)}
        .page-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}
        .page-btn:disabled{opacity:.35;cursor:not-allowed}

        /* TOAST */
        .toast-container{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px}
        .toast-item{background:#fff;border:.5px solid var(--border);border-radius:10px;padding:12px 16px;min-width:280px;display:flex;align-items:flex-start;gap:10px;box-shadow:0 4px 16px rgba(0,0,0,.08);animation:toastIn .25s ease}
        .toast-item.toast-success{border-left:3px solid #1D9E75}
        .toast-item.toast-error{border-left:3px solid #E24B4A}
        .toast-icon{font-size:16px;margin-top:1px}
        .toast-success .toast-icon{color:#1D9E75}
        .toast-error .toast-icon{color:#E24B4A}
        .toast-body{flex:1}
        .toast-title{font-size:13px;font-weight:500}
        .toast-sub{font-size:12px;color:var(--text-secondary)}
        @keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        /* EMPTY */
        .empty-state{text-align:center;padding:48px 16px}
        .empty-state .empty-icon{font-size:48px;color:var(--text-tertiary);margin-bottom:12px}
        .empty-state .empty-title{font-size:15px;font-weight:500}
        .empty-state .empty-sub{font-size:13px;color:var(--text-tertiary);margin-top:4px}

        /* AUTH SPLIT */
        .auth-split{display:flex;min-height:100vh}
        .auth-dark{flex:1;background:var(--primary);padding:32px;display:flex;flex-direction:column;justify-content:space-between;color:#fff}
        .auth-dark-logo{display:flex;align-items:center;gap:10px}
        .auth-dark-logo-icon{width:30px;height:30px;background:rgba(255,255,255,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
        .auth-dark-logo span{font-size:14px;font-weight:500}
        .auth-dark-heading{font-size:22px;font-weight:500;line-height:1.4;margin-bottom:10px}
        .auth-dark-sub{font-size:13px;color:rgba(255,255,255,.5)}
        .auth-features{display:flex;flex-direction:column;gap:10px;margin-top:32px}
        .auth-feature{display:flex;align-items:center;gap:10px}
        .auth-feature-icon{width:24px;height:24px;background:rgba(255,255,255,.08);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(255,255,255,.6)}
        .auth-feature span{font-size:12px;color:rgba(255,255,255,.5)}
        .auth-dark-footer{font-size:11px;color:rgba(255,255,255,.2)}
        .auth-form-side{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 40px}
        .auth-form-inner{width:100%;max-width:380px}
        .auth-form-title{font-size:20px;font-weight:500;margin-bottom:4px}
        .auth-form-sub{font-size:13px;color:var(--text-secondary);margin-bottom:28px}
        .auth-form-footer{text-align:center;margin-top:20px;font-size:12px;color:var(--text-tertiary)}
        .auth-form-footer a{color:var(--text-primary);font-weight:500;text-decoration:none}
        .auth-form-footer a:hover{text-decoration:underline}
        .label-row{display:flex;justify-content:space-between;align-items:center}
        .label-link{font-size:12px;color:var(--text-tertiary);text-decoration:none}

        /* MODAL */
        .modal-content{border-radius:14px;border:none}
        .modal-header-c{padding:18px 22px;border-bottom:.5px solid var(--border);display:flex;justify-content:space-between;align-items:center}
        .modal-header-c h5{font-size:15px;font-weight:500;margin:0}
        .modal-body-c{padding:22px}
        .modal-footer-c{padding:16px 22px;background:var(--surface);border-top:.5px solid var(--border);display:flex;justify-content:flex-end;gap:8px;border-radius:0 0 14px 14px}
        .section-label{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);margin-bottom:10px;margin-top:18px}
        .section-label:first-child{margin-top:0}
        .role-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .role-card{padding:12px;border-radius:8px;border:.5px solid var(--border);cursor:pointer;display:flex;align-items:flex-start;gap:10px;transition:border-color .15s}
        .role-card:hover{border-color:var(--border-hover)}
        .role-card.selected{border-color:var(--primary)}
        .role-card-icon{width:28px;height:28px;background:var(--surface);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-secondary);flex-shrink:0}
        .role-card.selected .role-card-icon{background:var(--primary);color:#fff}
        .role-card-name{font-size:13px;font-weight:500}
        .role-card-desc{font-size:11px;color:var(--text-tertiary)}
        .detail-header{display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:20px;border-bottom:.5px solid var(--border)}
        .detail-avatar-lg{width:56px;height:56px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:500}
        .detail-row{display:flex;padding:10px 0;border-bottom:.5px solid var(--border);align-items:flex-start}
        .detail-row:last-child{border-bottom:none}
        .detail-row-label{width:140px;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);flex-shrink:0}
        .detail-row-label i{font-size:16px;color:var(--text-tertiary)}
        .detail-row-value{font-size:13px;flex:1}
        .delete-modal-body{text-align:center;padding:28px}
        .delete-icon-circle{width:52px;height:52px;background:var(--danger-bg);border-radius:999px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}
        .delete-icon-circle i{font-size:22px;color:#E24B4A}
        .delete-title{font-size:16px;font-weight:500}
        .delete-desc{font-size:13px;color:var(--text-secondary);line-height:1.6;margin-top:8px}
        .delete-actions{display:flex;gap:8px;margin-top:24px}
        .delete-actions button{flex:1}
        .btn-del-confirm{background:#E24B4A;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit}
        .btn-del-confirm:disabled{opacity:.6}

        @media(max-width:768px){
            .auth-dark{display:none}
            .auth-form-side{padding:24px}
            .sidebar{transform:translateX(-100%);position:fixed;top:52px;z-index:90;transition:transform .2s}
            .sidebar.open{transform:translateX(0)}
            .sidebar-overlay.show{display:block}
            .app-main{margin-left:0}
            .hamburger{display:block}
            .topbar-user-name{display:none}
            .toolbar .btn-text{display:none}
        }
    </style>
</head>
<body>
    <?= $this->renderSection('content') ?>
    <div class="toast-container" id="toastContainer"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="/js/common.js"></script>
    <script>
        const API_BASE = 'http://localhost:8080/api';
        function showToast(title, sub, type) {
            const ic = type === 'success' ? 'ti ti-check' : 'ti ti-alert-circle';
            const el = document.createElement('div');
            el.className = 'toast-item toast-' + type;
            el.innerHTML = '<i class="toast-icon '+ic+'"></i><div class="toast-body"><div class="toast-title">'+title+'</div>'+(sub?'<div class="toast-sub">'+sub+'</div>':'')+'</div>';
            document.getElementById('toastContainer').appendChild(el);
            setTimeout(()=>el.remove(), 3000);
        }
        function toggleSidebar(){
            document.querySelector('.sidebar')?.classList.toggle('open');
            document.querySelector('.sidebar-overlay')?.classList.toggle('show');
        }
    </script>
    <?= $this->renderSection('scripts') ?>
</body>
</html>
