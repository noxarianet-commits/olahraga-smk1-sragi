import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { Search, Trash2, User, UserCheck, Shield, Filter, Plus, X } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', nis: '', password: '', role: 'student', class_id: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Remove class_id if it is empty string to avoid validation error if backend expects valid ID or null
            const payload = { ...formData };

            // Clean up payload based on role
            if (payload.role === 'student') {
                delete payload.email;
            } else {
                delete payload.nis;
                delete payload.class_id;
            }

            if (!payload.class_id) {
                delete payload.class_id;
            }

            await api.post('/auth/register', payload);
            alert('User created successfully!');
            setShowForm(false);
            setFormData({ name: '', email: '', nis: '', password: '', role: 'student', class_id: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to create user', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Failed to create user: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterRole !== 'all') params.role = filterRole;
            // Note: search might be client-side if API doesn't support it, but let's try purely client-side filtering for simplicity first or use API params if documented.
            // Assuming full list fetch for now for simplicity in management view.

            const response = await api.get('/users', { params });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole]);

    useEffect(() => {
        if (showForm) {
            fetchClasses();
        }
    }, [showForm]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield size={16} />;
            case 'teacher': return <UserCheck size={16} />;
            default: return <User size={16} />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'teacher': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage students, teachers, and administrators.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? <X className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
                    {showForm ? 'Cancel' : 'Add New User'}
                </Button>
            </div>

            {/* Create User Form */}
            {showForm && (
                <Card className="border-2 border-primary-100 p-6 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Register New User</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Role</label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 bg-white h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {formData.role === 'student' ? (
                                <Input
                                    label="NIS"
                                    placeholder="Nomor Induk Siswa"
                                    value={formData.nis}
                                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                                    required
                                />
                            ) : (
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            )}

                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        {formData.role === 'student' && (
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Class (Optional)</label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 bg-white h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={formData.class_id}
                                    onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.class_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1 ml-1">You can assign class later in Class Management.</p>
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <Button type="submit" isLoading={submitting}>Create User</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Controls */}
            <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <Filter size={18} className="text-slate-400" />
                    {['all', 'student', 'teacher', 'admin'].map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filterRole === role
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </Card>

            {/* User List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading users...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No users found.
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <Card key={user._id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 hover:border-primary-200 transition-colors group">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor(user.role)}`}>
                                        {getRoleIcon(user.role)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">
                                            {user.class_id?.class_name || user.role}
                                        </Badge>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
