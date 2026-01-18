import axios from 'axios';
import { mockUsers, mockActivities, mockAnnouncements, mockStats } from './mockData';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return `http://${window.location.hostname}:5000/api`;
};

const API_URL = getBaseUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock Adapter Logic (Simple interceptor for now)
// Toggle this to false to use real backend
const USE_MOCK = false;

api.interceptors.request.use(async (config) => {
    if (import.meta.env.VITE_ENABLE_API_LOGS === 'true') {
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
    }

    if (USE_MOCK) {
        // ... existing mock logic ...
        await new Promise(resolve => setTimeout(resolve, 800));
        return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        if (import.meta.env.VITE_ENABLE_API_LOGS === 'true') {
            console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error) => {
        console.error('[API Error]', error);
        if (USE_MOCK && error.config) {
            // ... existing mock error handling ...
            // (Keeping the existing fallback logic, but adding logging above)

            const { url, method, data } = error.config;
            if (import.meta.env.VITE_ENABLE_API_LOGS === 'true') {
                console.log(`[Mock API] ${method.toUpperCase()} ${url}`, data ? JSON.parse(data) : '');
            }

            // Auth
            if (url.includes('/auth/login')) {
                const body = JSON.parse(data);
                const user = mockUsers.find(u => (u.nis === body.identifier || u.email === body.identifier));

                if (user) {
                    if (body.password === 'siswa123' || body.password === 'guru123' || body.password === 'admin123') {
                        return Promise.resolve({
                            data: {
                                success: true,
                                data: { token: 'mock-jwt-token', user }
                            }
                        });
                    }
                }
                return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
            }

            // Check Token (Profile)
            if (url.includes('/auth/profile')) {
                // Default to student for now, or check token if we implemented a smarter mock
                return Promise.resolve({ data: { success: true, data: { user: mockUsers[0] } } });
            }

            // Dashboard
            if (url.includes('/dashboard/student')) {
                return Promise.resolve({
                    data: {
                        success: true,
                        data: {
                            ...mockStats,
                            todayActivities: mockActivities.slice(0, 2),
                            recentAnnouncements: mockAnnouncements
                        }
                    }
                });
            }

            // Activities
            if (url.includes('/activities') && method === 'get') {
                // Filter pending if requested
                if (url.includes('pending')) {
                    return Promise.resolve({ data: { success: true, data: mockActivities.filter(a => a.status === 'pending') } });
                }
                return Promise.resolve({ data: { success: true, data: mockActivities } });
            }

            if (url.includes('/activities') && method === 'post') {
                const newActivity = JSON.parse(data);
                return Promise.resolve({
                    data: {
                        success: true,
                        data: {
                            activity: {
                                ...newActivity,
                                _id: Date.now().toString(),
                                status: 'pending',
                                created_at: new Date().toISOString()
                            }
                        }
                    }
                });
            }

            // Announcements
            if (url.includes('/announcements')) {
                return Promise.resolve({ data: { success: true, data: mockAnnouncements } });
            }

            // Users (Mock Management)
            if (url.includes('/users')) {
                if (method === 'get') {
                    // Filter by role if needed
                    // const role = new URLSearchParams(url.split('?')[1]).get('role');
                    return Promise.resolve({ data: { success: true, data: mockUsers, pagination: { totalItems: mockUsers.length } } });
                }
                if (method === 'post') {
                    const newUser = JSON.parse(data);
                    const userObj = { ...newUser, _id: Date.now().toString() };
                    mockUsers.push(userObj);
                    return Promise.resolve({ data: { success: true, data: userObj } });
                }
                if (method === 'delete') {
                    // In-memory delete simulation
                    return Promise.resolve({ data: { success: true } });
                }
            }

            // Classes (Mock Management)
            if (url.includes('/classes')) {
                if (method === 'get') {
                    const { mockClasses } = await import('./mockData'); // Dynamic import to avoid circular dependency issues if any, or just rely on top level
                    return Promise.resolve({ data: { success: true, data: mockClasses || [], pagination: { totalItems: (mockClasses || []).length } } });
                }
                if (method === 'post') {
                    return Promise.resolve({ data: { success: true } });
                }
                if (method === 'delete') {
                    return Promise.resolve({ data: { success: true } });
                }
            }

        }
        return Promise.reject(error);
    }
);

export default api;
