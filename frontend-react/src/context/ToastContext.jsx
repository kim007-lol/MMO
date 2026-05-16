import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((title, sub = '', type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, sub, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast-item toast-${t.type}`}>
                        <i className={`toast-icon ${t.type === 'success' ? 'ti ti-check' : 'ti ti-alert-circle'}`}></i>
                        <div className="toast-body">
                            <div className="toast-title">{t.title}</div>
                            {t.sub && <div className="toast-sub">{t.sub}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
