import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, Shield, Key, LogOut, Lock, Save } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error('Failed to change password', err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-20 md:pb-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Profile Saya</h1>
                <p className="text-slate-500">Kelola informasi akun dan keamanan anda</p>
            </div>

            {/* User Info Card */}
            <Card className="p-6 bg-white shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <User className="text-slate-400" size={20} />
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Username / NIS / NIP</p>
                            <p className="text-slate-900 font-medium">{user?.nis || user?.username || '-'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="text-slate-400" size={20} />
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Email</p>
                            <p className="text-slate-900 font-medium">{user?.email || '-'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Shield className="text-slate-400" size={20} />
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Role</p>
                            <p className="text-slate-900 font-medium capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Change Password Card */}
            <Card className="p-6 bg-white shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Ganti Kata Sandi</h2>
                        <p className="text-sm text-slate-500">Amankan akun anda dengan kata sandi yang kuat</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input
                        label="Kata Sandi Saat Ini"
                        type="password"
                        placeholder="Masukkan kata sandi saat ini"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Kata Sandi Baru"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            required
                        />
                        <Input
                            label="Konfirmasi Kata Sandi Baru"
                            type="password"
                            placeholder="Ulangi kata sandi baru"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={loading} className="w-full md:w-auto flex items-center gap-2 justify-center">
                            <Save size={18} />
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Logout Section */}
            <Card className="p-6 bg-white shadow-sm border border-red-100">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Keluar Sesi</h2>
                        <p className="text-sm text-slate-500">Akhiri sesi anda di perangkat ini</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={logout}
                        className="w-full md:w-auto flex items-center gap-2 justify-center text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200"
                    >
                        <LogOut size={18} />
                        Keluar Aplikasi
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;
