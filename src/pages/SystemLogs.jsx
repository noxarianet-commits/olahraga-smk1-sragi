import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Clock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

// Mock Logs Data (Since backend likely doesn't have a /logs endpoint yet)
const mockLogs = [
    { id: 1, action: 'User Login', user: 'Admin User', details: 'Successful login', time: '2 mins ago', status: 'success' },
    { id: 2, action: 'Delete Activity', user: 'Teacher Ahmad', details: 'Deleted activity ID #8821', time: '15 mins ago', status: 'warning' },
    { id: 3, action: 'Create Announcement', user: 'Teacher Ahmad', details: 'New announcement "Exam Schedule"', time: '1 hour ago', status: 'success' },
    { id: 4, action: 'User Registration', user: 'New Student', details: 'Failed attempt (Invalid Code)', time: '2 hours ago', status: 'error' },
    { id: 5, action: 'System Backup', user: 'System', details: 'Daily backup completed', time: '5 hours ago', status: 'success' },
];

const SystemLogs = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Logs</h1>
                <p className="text-slate-500">Monitor system activities and security events.</p>
            </div>

            <div className="space-y-4">
                {mockLogs.map(log => (
                    <Card key={log.id} className="flex items-center gap-4 p-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${log.status === 'success' ? 'bg-green-100 text-green-600' :
                                log.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-red-100 text-red-600'
                            }`}>
                            {log.status === 'success' ? <CheckCircle size={20} /> :
                                log.status === 'warning' ? <Shield size={20} /> :
                                    <AlertCircle size={20} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{log.action}</h4>
                            <p className="text-sm text-slate-500">by <span className="font-medium text-slate-700">{log.user}</span> • {log.details}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock size={14} />
                            <span>{log.time}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SystemLogs;
