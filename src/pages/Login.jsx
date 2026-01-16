import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoSmk from '../assets/logosmk.png';

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Default for demo
    const [password, setPassword] = useState(''); // Default for demo
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(identifier, password);

        if (result.success) {
            const userRole = result.data.user.role;
            if (userRole === 'teacher') {
                navigate('/dashboard/teacher');
            } else if (userRole === 'admin') {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/student');
            }
        } else {
            setError(result.message);
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col transition-colors duration-300">
            {/* Top Navigation Bar (iOS Style) */}
            <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="text-[#111813] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </div>
                <h2 className="text-[#111813] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    Login Siswa
                </h2>
            </div>

            <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">
                {/* School Logo */}
                <div className="flex justify-center mb-10">
                    <div className="w-24 h-24 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center border-4 border-white/30 dark:border-white/10 shadow-lg backdrop-blur-sm overflow-hidden p-3">
                        <img src={logoSmk} alt="Logo SMK" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Headline & Body */}
                <div className="text-center mb-8">
                    <h1 className="text-[#111813] dark:text-white text-3xl font-bold tracking-tight mb-2">Selamat Datang</h1>
                    <p className="text-[#61896f] dark:text-gray-400 text-base font-normal">
                        Silahkan masuk untuk melihat aktivitas harianmu.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* NIS Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#111813] dark:text-gray-200 text-sm font-semibold px-1">NIS / Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                            <input
                                className="form-input w-full rounded-xl text-[#111813] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbe6df] dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary h-14 pl-12 pr-4 placeholder:text-gray-400 text-base font-normal transition-all"
                                placeholder="Masukkan NIS atau Email Anda"
                                type="text"
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#111813] dark:text-gray-200 text-sm font-semibold px-1">Kata Sandi</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                className="form-input w-full rounded-xl text-[#111813] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbe6df] dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary h-14 pl-12 pr-12 placeholder:text-gray-400 text-base font-normal transition-all"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}

                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Login Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:brightness-105 active:scale-[0.98] transition-all text-background-dark font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Memproses...' : 'Masuk'}
                            {!isLoading && <span className="material-symbols-outlined">login</span>}
                        </button>

                        <div className="pt-4 border-t border-slate-100 mt-6"> {/* Added mt-6 for spacing */}
                            <a
                                href="https://developer-aplikasi-smk.netlify.app/"
                                className="block w-full text-center py-2.5 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all text-sm"
                            >
                                Tentang Pengembang Aplikasi
                            </a>
                        </div>
                    </div>
                </form>

                {/* Footer Help - Added from template */}
                <div className="mt-auto pt-10 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                        Belum punya akun?{' '}
                        <a className="text-primary font-bold" href="https://wa.me/6285936603517">
                            Hubungi Admin Sekolah
                        </a>
                    </p>
                </div>

            </main>
        </div>
    );
};

export default Login;