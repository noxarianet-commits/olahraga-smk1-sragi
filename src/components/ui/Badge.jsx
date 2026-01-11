import React from 'react';
import { cn } from '../../utils/cn';

function Badge({ children, variant = 'primary', className, ...props }) {
    const variants = {
        primary: "bg-primary-50 text-primary-700 border-primary-200",
        success: "bg-secondary-50 text-secondary-700 border-secondary-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        danger: "bg-red-50 text-red-700 border-red-200",
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

export default Badge;
