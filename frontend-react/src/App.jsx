import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserListPage from './pages/UserListPage';
import UserFormPage from './pages/UserFormPage';
import UserDetailPage from './pages/UserDetailPage';

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* protected routes */}
                        <Route path="/users" element={
                            <ProtectedRoute><Layout><UserListPage /></Layout></ProtectedRoute>
                        } />
                        <Route path="/users/create" element={
                            <ProtectedRoute><Layout><UserFormPage /></Layout></ProtectedRoute>
                        } />
                        <Route path="/users/:id" element={
                            <ProtectedRoute><Layout><UserDetailPage /></Layout></ProtectedRoute>
                        } />
                        <Route path="/users/:id/edit" element={
                            <ProtectedRoute><Layout><UserFormPage /></Layout></ProtectedRoute>
                        } />

                        {/* default redirect */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
