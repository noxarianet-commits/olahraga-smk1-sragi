import React from 'react';
import { cn } from '../../utils/cn';

function Card({ className, children, glass = false, hover = false, ...props }) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-slate-100 bg-white shadow-sm p-6",
                glass && "glass-card",
                hover && "hover:shadow-md hover:border-slate-200 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
