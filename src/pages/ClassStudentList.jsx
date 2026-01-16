import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, User, ArrowLeft, BookOpen } from 'lucide-react';

const ClassStudentList = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Fetch students for this class
                const response = await api.get('/users', {
                    params: {
                        class_id: classId,
                        role: 'student'
                    }
                });
                setStudents(response.data.data);

                // Ideally we'd get the class name from the response or a separate fetch
                // For now, let's try to infer or fetch class details if possible
                // If the user API returns populated class info, we can use that from the first student
                // Or we can fetch the class details separately
                try {
                    const classRes = await api.get(`/classes/${classId}`); // Assuming this endpoint exists or similar
                    setClassName(classRes.data.data.class_name);
                } catch (err) {
                    // Fallback or ignore if endpoint doesn't exist
                    console.log("Could not fetch class details directly");
                    if (response.data.data.length > 0 && response.data.data[0].class_id) {
                        setClassName(response.data.data[0].class_id.class_name);
                    }
                }

            } catch (error) {
                console.error('Failed to fetch students', error);
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchStudents();
        }
    }, [classId]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.nis && student.nis.includes(searchQuery))
    );

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
                    Total: <span className="font-semibold text-slate-900">{filteredStudents.length}</span> students
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
        </div>
    );
};

export default ClassStudentList;
