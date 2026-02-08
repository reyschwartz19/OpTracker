import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
    value: string
    label: string
}

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: SelectOption[]
    error?: string
    label?: string
    placeholder?: string
    onChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, error, label, placeholder, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange?.(e.target.value)
        }

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            'flex h-12 w-full appearance-none rounded-[10px] border bg-white px-4 py-2 pr-10 text-base transition-all duration-150',
                            'focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-0 focus:border-[#14B8A6]',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F1F5F9]',
                            error
                                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                : 'border-[#E2E8F0]',
                            className
                        )}
                        ref={ref}
                        onChange={handleChange}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        )
    }
)
Select.displayName = 'Select'

export { Select }
