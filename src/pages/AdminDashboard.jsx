import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Users, GraduationCap, School, Activity, Shield, FileSpreadsheet } from 'lucide-react';
import { downloadFile } from '../utils/downloadHelper';

const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link to={link || '#'} className="block h-full">
        <Card className="relative overflow-hidden group hover:border-primary-200 transition-all cursor-pointer h-full">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            </div>
        </Card>
    </Link>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        activities: 0
    });
    const [loading, setLoading] = useState(true);

    const handleExportStudents = async () => {
        try {
            const response = await api.get('/export/students', { responseType: 'blob' });
            downloadFile(response, 'students-data.xlsx');
        } catch (error) {
            console.error('Failed to export students', error);
            alert('Failed to export students data.');
        }
    };

    const handleExportActivities = async () => {
        try {
            const response = await api.get('/export/activities', { responseType: 'blob' });
            downloadFile(response, 'activity-logs.xlsx');
        } catch (error) {
            console.error('Failed to export activities', error);
            alert('Failed to export activity logs.');
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/admin');
                const data = response.data.data;

                setStats({
                    students: data.overview.totalStudents,
                    teachers: data.overview.totalTeachers,
                    classes: data.overview.totalClasses,
                    activities: data.overview.totalActivities
                });

            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading admin dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard 🛡️</h1>
                <p className="text-slate-500">System overview and management.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={GraduationCap}
                    color="bg-blue-500"
                    link="/admin/users"
                />
                <StatCard
                    title="Total Teachers"
                    value={stats.teachers}
                    icon={Users}
                    color="bg-purple-500"
                    link="/admin/users"
                />
                <StatCard
                    title="Active Classes"
                    value={stats.classes}
                    icon={School}
                    color="bg-emerald-500"
                    link="/admin/classes"
                />
                <StatCard
                    title="Total Activities"
                    value={stats.activities}
                    icon={Activity}
                    color="bg-amber-500"
                    link="/admin/activities"
                />
            </div>

            {/* Quick Actions (Mock) */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/admin/users">
                        <Card className="hover:border-primary-200 transition-colors cursor-pointer group h-full">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Manage Users</h3>
                                    <p className="text-sm text-slate-500">Add, edit, or remove users</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link to="/admin/classes">
                        <Card className="hover:border-primary-200 transition-colors cursor-pointer group h-full">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <School size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Manage Classes</h3>
                                    <p className="text-sm text-slate-500">Create classes and assign teachers</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link to="/admin/logs">
                        <Card className="hover:border-primary-200 transition-colors cursor-pointer group h-full">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">System Logs</h3>
                                    <p className="text-sm text-slate-500">View application activity logs</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
            {/* Data Export */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Data Export</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                        className="hover:border-primary-200 transition-colors cursor-pointer group"
                        onClick={handleExportStudents}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Export All Students</h3>
                                <p className="text-sm text-slate-500">Download student data as Excel</p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="hover:border-primary-200 transition-colors cursor-pointer group"
                        onClick={handleExportActivities}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Export Activity Logs</h3>
                                <p className="text-sm text-slate-500">Download full activity history</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
