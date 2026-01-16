import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Pagination from '../components/ui/Pagination';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Check, X, Search, Filter, Calendar, User, UserCheck, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { getProperImageUrl } from '../utils/imageUrl';

const VerificationList = () => {
    const [searchParams] = useSearchParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedId = searchParams.get('id');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);

    const handleHardDelete = async (activity, e) => {
        e.stopPropagation();
        if (!confirm(`PERMANENT DELETE: Are you sure you want to delete this activity? This cannot be undone.`)) return;

        try {
            await api.delete(`/activities/${activity._id}`);
            alert('Activity deleted permanently.');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete activity', error);
            alert('Failed to delete: Backend might not support delete.');
        }
    };

    useEffect(() => {
        const fetchPending = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: itemsPerPage
                };
                // Assuming backend supports search, if not, this param might be ignored
                if (searchQuery) params.search = searchQuery;

                const response = await api.get('/activities/pending', { params });
                setActivities(response.data.data);
                if (response.data.pagination) {
                    setTotalPages(response.data.pagination.totalPages);
                }
            } catch (error) {
                console.error('Failed to fetch pending activities', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPending();
    }, [refreshTrigger, currentPage]); // Added currentPage dependency

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            setRefreshTrigger(prev => prev + 1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);



    // Server-side filtered activities
    const filteredActivities = activities;

    /* 
    // OLD Client side
    const filteredActivities = activities.filter(activity => {
        const studentName = activity.student_id?.name || '';
        const studentNis = activity.student_id?.nis || '';
        const className = activity.student_id?.class_id?.class_name || '';

        const q = searchQuery.toLowerCase();
        return studentName.toLowerCase().includes(q) ||
            studentNis.includes(q) ||
            className.toLowerCase().includes(q);
    });
    */

    // State for modal
    const [reviewModal, setReviewModal] = useState({ show: false, activity: null, action: null });
    const [reviewNote, setReviewNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const openReview = (activity, action) => {
        setReviewModal({ show: true, activity, action });
        setReviewNote('');
    };

    const confirmReview = async () => {
        if (!reviewModal.activity) return;

        setProcessing(true);
        try {
            await api.put(`/activities/${reviewModal.activity._id}/verify`, {
                status: reviewModal.action,
                notes: reviewNote
            });
            setRefreshTrigger(prev => prev + 1);
            setReviewModal({ show: false, activity: null, action: null });
        } catch (error) {
            console.error(`Failed to ${reviewModal.action} activity`, error);
            alert(`Failed to ${reviewModal.action} activity`);
        } finally {
            setProcessing(false);
        }
    };

    const sortedActivities = [...filteredActivities].sort((a, b) => {
        if (a._id === selectedId) return -1;
        if (b._id === selectedId) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    return (
        <div className="space-y-6 relative">
            {/* Modal Overlay */}
            {reviewModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900">
                                {reviewModal.action === 'verified' ? 'Verify Activity' : 'Reject Activity'}
                            </h3>
                            <button onClick={() => setReviewModal({ show: false, activity: null, action: null })} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-sm font-medium text-slate-900">
                                    {reviewModal.activity?.student_id?.name}
                                </p>
                                <p className="text-xs text-slate-500 capitalize">
                                    {reviewModal.activity?.activity_type} • {reviewModal.activity?.count} reps
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Add Note (Optional)
                                </label>
                                <textarea
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-h-[100px]"
                                    placeholder={reviewModal.action === 'verified' ? "Good job! Keep it up." : "Please check your form and try again."}
                                    value={reviewNote}
                                    onChange={(e) => setReviewNote(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setReviewModal({ show: false, activity: null, action: null })}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={cn(
                                        "flex-1 text-white shadow-lg",
                                        reviewModal.action === 'verified'
                                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                            : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                                    )}
                                    onClick={confirmReview}
                                    isLoading={processing}
                                >
                                    Confirm {reviewModal.action === 'verified' ? 'Verification' : 'Rejection'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Activity Verification</h1>
                    <p className="text-slate-500">Review and approve student activity reports.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading pending activities...</div>
            ) : sortedActivities.length === 0 ? (
                <Card className="p-12 text-center text-slate-500 bg-slate-50 border-dashed">
                    <UserCheck className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">All Caught Up!</h3>
                    <p>There are no pending activities to review.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {sortedActivities.map((activity) => (
                        <Card
                            key={activity._id}
                            className={cn(
                                "overflow-hidden transition-all duration-300",
                                activity._id === selectedId ? "ring-2 ring-primary-500 shadow-xl shadow-primary-500/10" : "hover:shadow-md"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Image Proof */}
                                <div className="md:w-1/3 flex-shrink-0">
                                    <div className="rounded-lg overflow-hidden bg-slate-100 h-64 md:h-full relative group cursor-pointer" onClick={() => window.open(activity.image_url, '_blank')}>
                                        <img
                                            src={getProperImageUrl(activity.image_url)}
                                            alt="Proof"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                            Click to Expand
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                                                    {activity.student_id?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">{activity.student_id?.name}</h3>
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                        <span>{activity.student_id?.nis}</span>
                                                        <span>•</span>
                                                        <span className="font-medium text-slate-700">{activity.student_id?.class_id?.class_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleHardDelete(activity, e)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <Badge variant="warning">Pending Review</Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Activity</p>
                                                <p className="font-medium capitalize text-slate-900 flex items-center gap-2">
                                                    {activity.activity_type}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Count</p>
                                                <p className="font-medium text-slate-900">{activity.count} Reps</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg col-span-2">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Submitted At</p>
                                                <p className="font-medium text-slate-900 flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(activity.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            onClick={() => openReview(activity, 'rejected')}
                                        >
                                            <X size={18} className="mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                                            onClick={() => openReview(activity, 'verified')}
                                        >
                                            <Check size={18} className="mr-2" />
                                            Verify (Approve)
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default VerificationList;
