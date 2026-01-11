import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, CheckSquare, Bell, User, LogOut, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../features/ChangePasswordModal';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Define links based on role (simplified for now)
    const links = [
        { icon: LayoutDashboard, label: 'Dashboard', to: `/dashboard/${user?.role}` },
        { icon: Activity, label: 'Activities', to: '/activities' },
        { icon: Bell, label: 'Announcements', to: '/announcements' },
    ];

    if (user?.role === 'teacher') {
        links.push({ icon: CheckSquare, label: 'Verification', to: '/verification' });
    }

    // Profile link
    // links.push({ icon: User, label: 'Profile', to: '/profile' });

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-20">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            A
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 text-lg leading-tight">Activity</h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">TRACKER</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-50 text-primary-700 font-medium"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        size={20}
                                        className={cn("transition-colors", isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")}
                                    />
                                    <span>{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                    >
                        <Lock size={20} />
                        <span className="font-medium">Change Password</span>
                    </button>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}

            {/* Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-4 pb-safe">
                <nav className="flex justify-around items-center">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center justify-center p-3 transition-colors",
                                isActive ? "text-primary-600" : "text-slate-400"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] font-medium mt-1">{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                    <button
                        onClick={logout}
                        className="flex flex-col items-center justify-center p-3 text-slate-400"
                    >
                        <LogOut size={24} />
                        <span className="text-[10px] font-medium mt-1">Exit</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
