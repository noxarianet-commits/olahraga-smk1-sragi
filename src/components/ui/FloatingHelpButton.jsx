import React from 'react';
import { FileText } from 'lucide-react';

const FloatingHelpButton = () => {
    const guideUrl = "https://drive.google.com/file/d/1m-UB_KyIL0MaKf8weUzSGXfWhmI869qh/view?usp=drive_link";

    return (
        <a
            href={guideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 md:bottom-8 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
            aria-label="Panduan Pengguna"
            title="Panduan Pengguna"
        >
            <FileText size={28} strokeWidth={2} />
            {/* Tooltip for desktop */}
            <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                Panduan Pengguna
            </span>
        </a>
    );
};

export default FloatingHelpButton;
