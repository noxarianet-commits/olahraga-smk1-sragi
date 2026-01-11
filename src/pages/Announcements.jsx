import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Bell, Calendar, Plus, X, Megaphone, Users, Globe, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

const Announcements = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target_type: 'all', // 'all' or 'class'
        target_class_id: ''
    });
    const [classes, setClasses] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            // Adjust endpoint based on role if necessary, but doc says /for-student is for login student.
            // Teachers might need a different endpoint to see *their* created announcements or all?
            // Assuming /announcements exists for teachers or reusing /for-student with different response context.
            // Let's try /announcements for teacher if /for-student is restrictive.
            // Based on DOC, /announcements POST exists. GET ? likely exists generally.
            // For now, let's use /announcements/for-student or fallback to likely /announcements if teacher.

            // Determine endpoint based on role
            const endpoint = isTeacher ? '/announcements' : '/announcements/for-student';
            const response = await api.get(endpoint);
            setAnnouncements(response.data.data);
        } catch (error) {
            console.error('Failed to fetch announcements', error);
            // Fallback for demo if endpoint fails
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        if (!isTeacher) return;
        try {
            const response = await api.get('/classes');
            setClasses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAnnouncements();
            if (isTeacher) {
                fetchClasses();
            }
        }
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                target_type: formData.target_type,
            };
            if (formData.target_type === 'class') {
                payload.target_class_id = formData.target_class_id;
            }

            await api.post('/announcements', payload);

            setShowForm(false);
            setFormData({ title: '', content: '', target_type: 'all', target_class_id: '' });
            fetchAnnouncements(); // Refresh list
        } catch (error) {
            console.error('Failed to create announcement', error);
            alert('Failed to create announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            console.error('Failed to delete announcement', error);
            alert('Failed to delete announcement');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                    <p className="text-slate-500">Updates, news, and important information.</p>
                </div>
                {isTeacher && (
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? <X className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
                        {showForm ? 'Cancel' : 'New Announcement'}
                    </Button>
                )}
            </div>

            {/* Creation Form (Teacher Only) */}
            {showForm && isTeacher && (
                <Card className="border-2 border-primary-100 shadow-xl shadow-primary-500/5">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-primary-50 pb-2 mb-4">
                            <Megaphone size={20} />
                            <h2>Create New Announcement</h2>
                        </div>

                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Weekly Activity Schedule"
                            required
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Content</label>
                            <textarea
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[100px]"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your announcement here..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Target Audience</label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={formData.target_type}
                                    onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                                >
                                    <option value="all">All Students</option>
                                    <option value="class">Specific Class</option>
                                </select>
                            </div>

                            {formData.target_type === 'class' && (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Select Class</label>
                                    <select
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        value={formData.target_class_id}
                                        onChange={(e) => setFormData({ ...formData, target_class_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Select Class --</option>
                                        {classes.map(cls => (
                                            <option key={cls._id} value={cls._id}>{cls.class_name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button type="submit" isLoading={submitting}>
                                Publish Announcement
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading announcements...</div>
            ) : announcements.length === 0 ? (
                <Card className="p-12 text-center text-slate-500 bg-slate-50 border-dashed">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-primary-300" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No Announcements</h3>
                    <p>Stay tuned! Updates will appear here.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <Card key={announcement._id} className="hover:border-primary-200 transition-all group">
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                    announcement.target_type === 'all' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                                )}>
                                    {announcement.target_type === 'all' ? <Globe size={24} /> : <Users size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                                            {announcement.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar size={14} />
                                            <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                                            {announcement.is_new && <Badge>New</Badge>}
                                            {isTeacher && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
                                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                                                    title="Delete Announcement"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed mb-3">
                                        {announcement.content}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                        <span className="font-medium">By: {announcement.author_id?.name || announcement.author_name || 'Admin'}</span>
                                        <div className="flex items-center gap-2">
                                            {announcement.target_type === 'all' ? (
                                                <Badge variant="secondary" size="sm">All Students</Badge>
                                            ) : (
                                                <Badge variant="outline" size="sm" className="border-blue-200 bg-blue-50 text-blue-700">
                                                    {announcement.target_class_id?.class_name || 'Class'}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div >
            )}
        </div >
    );
};

export default Announcements;
