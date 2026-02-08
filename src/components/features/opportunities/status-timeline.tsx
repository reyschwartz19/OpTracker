'use client'

import { motion } from 'framer-motion'
import { Check, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineStep {
    id?: string
    stepType: string
    label: string
    createdAt: Date
}

interface StatusTimelineProps {
    currentStatus: string
    steps: TimelineStep[]
    onStatusChange: (status: string) => void
}

const STATUS_FLOW = [
    { id: 'interested', label: 'Interested' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'interview', label: 'Interview' },
    { id: 'accepted', label: 'Accepted' },
]

export function StatusTimeline({ currentStatus, steps, onStatusChange }: StatusTimelineProps) {
    // Determine active index
    const activeIndex = STATUS_FLOW.findIndex((s) => s.id === currentStatus)
    const isRejected = currentStatus === 'rejected'
    const isArchived = currentStatus === 'archived'

    return (
        <div className="w-full py-4">
            {/* Visual Timeline */}
            <div className="relative flex items-center justify-between mb-8">
                {/* Background Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />

                {/* Active Line */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
                    style={{ width: `${(activeIndex / (STATUS_FLOW.length - 1)) * 100}%` }}
                />

                {STATUS_FLOW.map((status, index) => {
                    const isActive = index <= activeIndex
                    const isCurrent = index === activeIndex

                    return (
                        <button
                            key={status.id}
                            onClick={() => onStatusChange(status.id)}
                            className="group relative flex flex-col items-center"
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? '#2563EB' : '#E5E7EB',
                                    borderColor: isActive ? '#2563EB' : '#E5E7EB',
                                }}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-200",
                                    isActive ? "text-white" : "text-gray-400"
                                )}
                            >
                                {isActive ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4 fill-white" />}
                            </motion.div>
                            <span className={cn(
                                "absolute top-10 text-xs font-medium whitespace-nowrap transition-colors",
                                isCurrent ? "text-blue-700" : "text-gray-500"
                            )}>
                                {status.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Rejection/Archive Controls */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-dashed">
                <button
                    onClick={() => onStatusChange('rejected')}
                    className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-colors",
                        isRejected
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-700"
                    )}
                >
                    Mark as Rejected
                </button>
                <button
                    onClick={() => onStatusChange('archived')}
                    className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-colors",
                        isArchived
                            ? "bg-gray-200 text-gray-800 border-gray-300"
                            : "text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-800"
                    )}
                >
                    Archive
                </button>
            </div>
        </div>
    )
}
