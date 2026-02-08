import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-[#1E3A8A] text-white',
                secondary: 'bg-[#4338CA]/10 text-[#4338CA]',
                outline: 'border border-[#E2E8F0] text-[#0F172A]',
                success: 'bg-[#14B8A6]/10 text-[#0D9488]',
                warning: 'bg-amber-100 text-amber-800',
                danger: 'bg-red-100 text-red-700',
                // Status badges
                interested: 'bg-blue-100 text-blue-700',
                in_progress: 'bg-purple-100 text-purple-700',
                submitted: 'bg-indigo-100 text-indigo-700',
                interview: 'bg-cyan-100 text-cyan-700',
                accepted: 'bg-emerald-100 text-emerald-700',
                rejected: 'bg-red-100 text-red-700',
                archived: 'bg-gray-100 text-gray-600',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
