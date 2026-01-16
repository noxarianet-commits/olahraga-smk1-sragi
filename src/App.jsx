import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ActivityList from './pages/ActivityList';
import SubmitActivity from './pages/SubmitActivity';
import VerificationList from './pages/VerificationList';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ClassManagement from './pages/ClassManagement';
import SystemLogs from './pages/SystemLogs';

import ClassStudentList from './pages/ClassStudentList';

// Placeholder components for routes not yet implemented
const Placeholder = ({ title }) => <div className="p-4"><h2 className="text-2xl font-bold">{title}</h2><p className="text-slate-500">Coming Soon...</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/dashboard/student" replace />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="student" element={<StudentDashboard />} />
            <Route path="teacher" element={<TeacherDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="classes/:classId/students" element={<ClassStudentList />} />
          </Route>

          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="classes" element={<ClassManagement />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="activities" element={<ActivityList />} />
          </Route>

          <Route path="/" element={<DashboardLayout />}>
            <Route path="activities" element={<ActivityList />} />
            <Route path="activities/new" element={<SubmitActivity />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="verification" element={<VerificationList />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
