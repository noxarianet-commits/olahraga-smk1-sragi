import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isVisible, message = 'Memproses...' }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-fade-in">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary-100"></div>
                </div>
                <p className="text-slate-700 font-medium text-center">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
