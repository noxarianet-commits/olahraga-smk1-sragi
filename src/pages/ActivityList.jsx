import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Plus, Filter, Calendar, MessageCircle, Trash2, User, X } from 'lucide-react';
import { getProperImageUrl } from '../utils/imageUrl';

const ActivityList = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activities, setActivities] = useState([]);
    const [hiddenActivities, setHiddenActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const classIdParam = searchParams.get('class_id');
    const studentIdParam = searchParams.get('student_id');

    const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

    useEffect(() => {
        if (user?._id && !isAdminOrTeacher) {
            const storedHidden = JSON.parse(localStorage.getItem(`hiddenActivities_${user._id}`)) || [];
            setHiddenActivities(storedHidden);
        }
    }, [user, isAdminOrTeacher]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = {};
            if (classIdParam) params.class_id = classIdParam;
            if (studentIdParam) params.student_id = studentIdParam;

            const response = await api.get('/activities', { params });
            setActivities(response.data.data);
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [classIdParam, studentIdParam]); // Re-fetch when URL params change

    const handleDelete = async (activityId) => {
        const isStudent = user?.role === 'student';
        const confirmMessage = isStudent
            ? 'Are you sure you want to delete this pending activity?'
            : 'Are you sure you want to PERMANENTLY delete this activity?';

        if (!confirm(confirmMessage)) return;

        try {
            await api.delete(`/activities/${activityId}`);
            setActivities(prev => prev.filter(a => a._id !== activityId));
            alert('Activity deleted successfully');
        } catch (error) {
            console.error('Failed to delete activity', error);
            const msg = error.response?.data?.message || 'Failed to delete activity.';
            alert(msg);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'success';
            case 'rejected': return 'danger';
            default: return 'warning';
        }
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const displayedActivities = activities.filter(a => !hiddenActivities.includes(a._id));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isAdminOrTeacher ? 'Aktivitas Siswa' : 'Aktivitas Saya'}
                    </h1>
                    <p className="text-slate-500">
                        {classIdParam ? 'Melihat aktivitas kelas' : studentIdParam ? 'Melihat aktivitas siswa' : isAdminOrTeacher ? 'Melihat dan mengelola aktivitas siswa.' : 'Melacak dan mengelola aktivitas harian Anda.'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {(classIdParam || studentIdParam) && (
                        <Button variant="outline" onClick={clearFilters} className="text-slate-500 border-slate-300">
                            <X size={16} className="mr-2" />
                            Clear Filters
                        </Button>
                    )}
                    {user?.role === 'student' && (
                        <Link to="/activities/new">
                            <Button>
                                <Plus className="mr-2" size={20} />
                                Tambahkan Aktivitas Baru
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Filters (Mock UI) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['All', 'Pending', 'Verified', 'Rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status.toLowerCase())}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === status.toLowerCase()
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading activities...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedActivities.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                            No activities found.
                        </div>
                    ) : displayedActivities
                        .filter(activity => filter === 'all' || activity.status === filter)
                        .map((activity) => (
                            <Card key={activity._id} className="flex flex-col h-full hover:border-primary-200 transition-colors group relative">
                                {(isAdminOrTeacher || (user?.role === 'student' && activity.status === 'pending')) && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleDelete(activity._id); }}
                                        className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                                        title={isAdminOrTeacher ? "Permanently Delete" : "Delete Activity"}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden mb-4">
                                    <img
                                        src={getProperImageUrl(activity.image_url)}
                                        alt={activity.activity_type}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={getStatusColor(activity.status)} className="shadow-sm">
                                            {activity.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    {isAdminOrTeacher && activity.student_id && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {activity.student_id.name?.charAt(0)}
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-slate-900">{activity.student_id.name}</p>
                                                <p className="text-xs text-slate-500">{activity.student_id.class_id?.class_name || activity.student_id.nis}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg text-slate-900 capitalize">{activity.activity_type}</h3>
                                        <span className="text-lg font-bold text-primary-600">{activity.count} <span className="text-sm font-medium text-slate-400">reps</span></span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                        <Calendar size={14} />
                                        <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>

                                    {activity.notes && (
                                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                            <p className="text-xs font-semibold text-yellow-700 flex items-center gap-1 mb-1">
                                                <MessageCircle size={12} />
                                                Feedback from Teacher:
                                            </p>
                                            <p className="text-sm text-yellow-800 italic">
                                                "{activity.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ActivityList;
