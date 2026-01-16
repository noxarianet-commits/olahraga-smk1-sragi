import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Activity, TrendingUp, Clock, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types, no-unused-vars
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={20} className={color.replace('bg-', 'text-')} />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            {trend && (
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </Card>
);

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleDelete = async (activityId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus aktivitas tertunda ini?')) return;

        try {
            await api.delete(`/activities/${activityId}`);
            alert('Aktivitas berhasil dihapus.');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete activity', error);
            // If error 403 or specific message about only pending can be deleted, show it
            const msg = error.response?.data?.message || 'Gagal menghapus. Anda hanya dapat menghapus aktivitas yang tertunda.';
            alert(msg);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/student');
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshTrigger]);

    if (loading) return <div>Loading dashboard...</div>;

    const stats = data?.weeklyStats;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Halo, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500">Ini ringkasan aktivitasmu minggu ini.</p>
                </div>
                <Button size="lg" className="shadow-lg shadow-primary-500/20" onClick={() => navigate('/activities/new')}>
                    <Plus className="mr-2" size={20} />
                    Catat Aktivitas
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Aktivitas"
                    value={stats?.totalActivities || 0}
                    icon={Activity}
                    color="bg-primary-500"
                    trend="+12% dari minggu lalu"
                />
                <StatCard
                    title="Terverifikasi"
                    value={stats?.verifiedCount || 0}
                    icon={CheckCircle}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Menunggu"
                    value={stats?.pendingCount || 0}
                    icon={Clock}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Total Pushup"
                    value={stats?.totalPushup || 0}
                    icon={TrendingUp}
                    color="bg-violet-500"
                />
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/activities')}>Lihat Semua</Button>
                    </div>

                    <div className="space-y-4">
                        {data?.todayActivities
                            ?.map((activity, index) => (
                                <Card key={activity._id || index} className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary-100 transition-colors group pr-12">
                                    {activity.status === 'pending' && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleDelete(activity._id); }}
                                            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Hapus Aktivitas Pending"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <Activity className="text-slate-500" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 capitalize">{activity.activity_type}</h4>
                                        <p className="text-sm text-slate-500">{activity.count} reps • Hari Ini</p>
                                    </div>
                                    <Badge variant={activity.status === 'verified' ? 'success' : 'warning'}>
                                        {activity.status === 'verified' ? 'Terverifikasi' : activity.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                                    </Badge>
                                </Card>
                            ))}

                        {data?.todayActivities?.length === 0 && (
                            <p className="text-slate-500 text-center py-8">Belum ada aktivitas hari ini.</p>
                        )}
                    </div>
                </div>

                {/* Announcements Preview */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Pengumuman</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/announcements')}>Lihat Semua</Button>
                    </div>

                    <div className="space-y-4">
                        {data?.recentAnnouncements?.map((announcement) => (
                            <Card key={announcement._id} className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-lg shadow-primary-500/20">
                                <div className="mb-3 flex items-start justify-between">
                                    <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">Baru</span>
                                    <span className="text-xs text-primary-100">Hari Ini</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 leading-tight">{announcement.title}</h3>
                                <p className="text-primary-100 text-sm line-clamp-2 mb-4">
                                    {announcement.content}
                                </p>
                                <button
                                    onClick={() => navigate('/announcements')}
                                    className="text-sm font-medium hover:text-white transition-colors flex items-center gap-1"
                                >
                                    Baca selengkapnya &rarr;
                                </button>
                            </Card>
                        ))}
                        {(!data?.recentAnnouncements || data.recentAnnouncements.length === 0) && (
                            <p className="text-slate-500 text-sm">Tidak ada pengumuman terbaru.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
