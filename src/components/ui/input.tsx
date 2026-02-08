import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-12 w-full rounded-[10px] border bg-white px-4 py-2 text-base transition-all duration-150',
                        'placeholder:text-[#94A3B8]',
                        'focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-0 focus:border-[#14B8A6]',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F1F5F9]',
                        error
                            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                            : 'border-[#E2E8F0]',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500 animate-slide-in">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
