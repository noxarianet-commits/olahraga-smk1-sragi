import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { School, Trash2, Users, Plus, X } from 'lucide-react';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ class_name: '', grade_level: '', school_year: '', teacher_id: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/classes');
            setClasses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/users', { params: { role: 'teacher' } });
            setTeachers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch teachers', error);
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/classes', formData);
            alert('Class created successfully!');
            setShowForm(false);
            setFormData({ class_name: '', grade_level: '', school_year: '', teacher_id: '' });
            fetchClasses();
        } catch (error) {
            console.error('Failed to create class', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Failed to create class: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this class? Users in this class might be affected.')) return;

        try {
            await api.delete(`/classes/${id}`);
            fetchClasses();
        } catch (error) {
            console.error('Failed to delete class', error);
            alert('Failed to delete class');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Class Management</h1>
                    <p className="text-slate-500">Manage school classes and their members.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Class'}
                </Button>
            </div>

            {showForm && (
                <Card className="p-6 border-2 border-emerald-100 bg-emerald-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Class</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Class Name"
                                placeholder="e.g. 10 IPA 1"
                                value={formData.class_name}
                                onChange={e => setFormData({ ...formData, class_name: e.target.value })}
                                required
                            />
                            <Input
                                label="Grade Level"
                                placeholder="e.g. 10"
                                value={formData.grade_level}
                                onChange={e => setFormData({ ...formData, grade_level: e.target.value })}
                                required
                            />
                            <Input
                                label="School Year"
                                placeholder="e.g. 2025/2026"
                                value={formData.school_year}
                                onChange={e => setFormData({ ...formData, school_year: e.target.value })}
                                required
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Home Room Teacher</label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 bg-white h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={formData.teacher_id}
                                    onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button type="submit" isLoading={submitting}>
                                <Plus className="mr-2" size={20} />
                                Create Class
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading classes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map(cls => (
                        <Card key={cls._id} className="relative group hover:border-primary-200 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <School size={24} />
                                </div>
                                <button
                                    onClick={() => handleDelete(cls._id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Class"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.class_name}</h3>
                            <div className="text-slate-500 text-sm mb-4 space-y-1">
                                <p>Grade: {cls.grade_level} • {cls.school_year}</p>
                                <p className="flex items-center gap-1">
                                    <span className="font-medium">Teacher:</span>
                                    {cls.teacher_id?.name || 'Unassigned'}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-600 text-sm">
                                <Users size={16} />
                                <span>{cls.students_count || 0} Students</span>
                            </div>
                        </Card>
                    ))}

                    {/* Add New Class Card Trigger */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary-300 hover:text-primary-600 transition-colors h-full min-h-[160px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-primary-50">
                            <span className="text-2xl">+</span>
                        </div>
                        <span className="font-medium">Add New Class</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
