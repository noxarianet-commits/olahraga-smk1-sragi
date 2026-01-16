import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Users, ClipboardList, CheckCircle, Clock, BookOpen, ChevronRight, Trash2, Download, Eye, Activity } from 'lucide-react';
import { cn } from '../utils/cn';
import { downloadFile } from '../utils/downloadHelper';

const StatCard = ({ title, value, icon: Icon, color, className }) => (
    <Card className={cn("relative overflow-hidden group", className)}>
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={20} className={color.replace('bg-', 'text-')} />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </Card>
);

const TeacherDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleHardDelete = async (activityId, e) => {
        e.stopPropagation();
        if (!confirm(`HAPUS PERMANEN: Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini tidak dapat dibatalkan.`)) return;

        try {
            await api.delete(`/activities/${activityId}`);
            alert('Aktivitas dihapus secara permanen.');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete activity', error);
            alert('Gagal menghapus: Backend mungkin tidak mendukung penghapusan.');
        }
    };

    const handleExportClass = async (classId, e) => {
        e.stopPropagation();
        try {
            const response = await api.get(`/export/class-report/${classId}`, { responseType: 'blob' });
            downloadFile(response, `class-report-${classId}.xlsx`);
        } catch (error) {
            console.error('Failed to export class report', error);
            alert('Gagal mengekspor laporan.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/teacher');
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshTrigger]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    const stats = data?.todayStats || {};
    const pendingReports = data?.pendingReports || { total: 0, reports: [] };
    const classes = data?.classes || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name} 👨‍🏫</h1>
                <p className="text-slate-500">Overview of your classes and activity reports.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Students"
                    value={data?.totalStudents || 0}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending Reviews"
                    value={pendingReports.total}
                    icon={Clock}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Today's Reports"
                    value={stats.totalReports || 0}
                    icon={ClipboardList}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Verified Today"
                    value={stats.verified || 0}
                    icon={CheckCircle}
                    color="bg-violet-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Verification List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Pending Verifications</h2>
                        {pendingReports.total > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/verification')}>
                                View All ({pendingReports.total})
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {pendingReports.reports.map((report) => (
                            <Card key={report._id} className="flex flex-col sm:flex-row gap-4 hover:border-primary-200 transition-colors">
                                <div className="w-24 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                    <img
                                        src={report.image_url}
                                        alt="Proof"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/150?text=No+Image'; }}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{report.student_name}</h3>
                                                <p className="text-sm text-slate-500">{report.student_nis} • {report.class_name}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleHardDelete(report._id, e)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <Badge variant="warning">Pending</Badge>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                                            <span className="font-medium capitalize">{report.activity_type}</span>
                                            <span>•</span>
                                            <span>{report.count} reps</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => navigate(`/verification?id=${report._id}`)}>
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {pendingReports.reports.length === 0 && (
                            <Card className="p-8 text-center text-slate-500 bg-slate-50 border-dashed">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400 opacity-50" />
                                <p>All caught up! No pending reports.</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* My Classes */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">My Classes</h2>
                    </div>

                    <div className="space-y-3">
                        {classes.map((cls) => (
                            <Card key={cls._id} className="group hover:border-primary-200 transition-all p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{cls.class_name}</h4>
                                            <p className="text-sm text-slate-500">{cls.student_count} Students</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-50 gap-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => navigate(`/activities?class_id=${cls._id}`)}
                                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                                            title="View Activities"
                                        >
                                            <Activity size={16} />
                                            Activities
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/classes/${cls._id}/students`)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                                            title="View Students"
                                        >
                                            <Users size={16} />
                                            Students
                                        </button>
                                    </div>
                                    <button
                                        onClick={(e) => handleExportClass(cls._id, e)}
                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                                        title="Download Report"
                                    >
                                        <Download size={16} />
                                        Report
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
