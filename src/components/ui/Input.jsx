import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
    className,
    type = 'text',
    label,
    error,
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="text-sm font-medium text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        "flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all shadow-sm",
                        "placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none",
                        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                        Icon && "pl-11",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={20} />
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-500 ml-1 animate-in slide-in-from-top-1 fade-in">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
