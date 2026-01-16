import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { Search, User, ArrowLeft, BookOpen } from 'lucide-react';

const ClassStudentList = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(9);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Fetch students for this class
            const params = {
                class_id: classId,
                role: 'student',
                page: currentPage,
                limit: itemsPerPage
            };
            if (searchQuery) params.search = searchQuery;

            const response = await api.get('/users', { params });
            setStudents(response.data.data);
            if (response.data.pagination) {
                setTotalPages(response.data.pagination.totalPages);
            }

            // Fetch class details if not already set (or we can just fetch it once)
            // We can optimistically try to get it from the first student if available, 
            // but fetching it directly is safer if the list is empty.
            if (!className) {
                try {
                    const classRes = await api.get(`/classes/${classId}`);
                    setClassName(classRes.data.data.class_name);
                } catch (err) {
                    console.error("Could not fetch class details");
                    // Fallback to first student's class name if available
                    if (response.data.data.length > 0 && response.data.data[0].class_id) {
                        setClassName(response.data.data[0].class_id.class_name);
                    }
                }
            }

        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) {
            fetchStudents();
        }
    }, [classId, currentPage]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (classId) {
                setCurrentPage(1); // Reset to page 1
                // If we are already at page 1, we need to trigger fetch explicitly 
                // or add a dependency. 
                // Since fetchStudents uses currentPage, altering it triggers fetch.
                // But if it is ALREADY 1, it won't trigger. 
                // So we should depend on searchQuery in the main effect?
                // Or call fetchStudents here? calling here is safer for debounce.
                if (currentPage === 1) fetchStudents();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Server-side filtered
    const filteredStudents = students;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {className ? `Students in ${className}` : 'Class Students'}
                    </h1>
                    <p className="text-slate-500">View all students registered in this class.</p>
                </div>
            </div>

            <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500">
                    Showing: <span className="font-semibold text-slate-900">{filteredStudents.length}</span> students
                </div>
            </Card>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading students...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500 p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No students found in this class.
                        </div>
                    ) : (
                        filteredStudents.map(student => (
                            <Card key={student._id} className="flex items-center gap-4 p-4 hover:border-primary-200 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{student.name}</h3>
                                    <p className="text-sm text-slate-500">NIS: {student.nis}</p>
                                </div>
                            </Card>
                        ))
                    )}
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

export default ClassStudentList;
