'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fadeSlideIn } from '@/lib/motion/presets'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Download,
    ExternalLink,
} from 'lucide-react'
import { useState } from 'react'

interface Opportunity {
    id: string
    title: string
    organization: string | null
    opportunityType: string
    status: string
    deadline: Date | null
}

interface CalendarContentProps {
    opportunities: Opportunity[]
}

export function CalendarContent({ opportunities }: CalendarContentProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Group opportunities by date
    const opportunitiesByDate = useMemo(() => {
        const grouped: Record<string, Opportunity[]> = {}
        opportunities.forEach((opp) => {
            if (opp.deadline) {
                const dateKey = new Date(opp.deadline).toISOString().split('T')[0]
                if (!grouped[dateKey]) {
                    grouped[dateKey] = []
                }
                grouped[dateKey].push(opp)
            }
        })
        return grouped
    }, [opportunities])

    // Get upcoming deadlines
    const upcomingDeadlines = useMemo(() => {
        const now = new Date()
        return opportunities
            .filter((opp) => opp.deadline && new Date(opp.deadline) >= now)
            .slice(0, 10)
    }, [opportunities])

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentYear, currentMonth + direction, 1))
    }

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Generate calendar days
    const calendarDays = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day)
    }

    const exportIcal = () => {
        // Generate iCal file
        let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//OpTracker//EN\n'

        opportunities.forEach((opp) => {
            if (opp.deadline) {
                const date = new Date(opp.deadline)
                const dateStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

                ical += 'BEGIN:VEVENT\n'
                ical += `UID:${opp.id}@optracker\n`
                ical += `DTSTART:${dateStr}\n`
                ical += `SUMMARY:${opp.title} Deadline\n`
                ical += `DESCRIPTION:${opp.organization || ''} - ${opp.opportunityType}\n`
                ical += 'END:VEVENT\n'
            }
        })

        ical += 'END:VCALENDAR'

        const blob = new Blob([ical], { type: 'text/calendar' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'optracker-deadlines.ics'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <motion.div {...fadeSlideIn} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
                        Calendar
                    </h1>
                    <p className="text-[#64748B] mt-1">
                        {opportunities.length} upcoming deadlines
                    </p>
                </div>
                <Button variant="secondary" onClick={exportIcal}>
                    <Download className="w-4 h-4 mr-2" />
                    Export to iCal
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle>{monthName}</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateMonth(-1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateMonth(1)}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-[#64748B] py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                if (!day) {
                                    return <div key={index} className="p-2" />
                                }

                                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                const dayOpportunities = opportunitiesByDate[dateKey] || []
                                const isToday =
                                    day === new Date().getDate() &&
                                    currentMonth === new Date().getMonth() &&
                                    currentYear === new Date().getFullYear()

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[80px] p-2 rounded-lg border transition-colors ${isToday
                                                ? 'bg-[#1E3A8A]/5 border-[#1E3A8A]'
                                                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                                            }`}
                                    >
                                        <span
                                            className={`text-sm font-medium ${isToday ? 'text-[#1E3A8A]' : 'text-[#0F172A]'
                                                }`}
                                        >
                                            {day}
                                        </span>
                                        <div className="mt-1 space-y-1">
                                            {dayOpportunities.slice(0, 2).map((opp) => (
                                                <Link
                                                    key={opp.id}
                                                    href={`/opportunities/${opp.id}`}
                                                    className="block text-xs p-1 rounded bg-[#1E3A8A]/10 text-[#1E3A8A] truncate hover:bg-[#1E3A8A]/20"
                                                >
                                                    {opp.title}
                                                </Link>
                                            ))}
                                            {dayOpportunities.length > 2 && (
                                                <span className="text-xs text-[#64748B]">
                                                    +{dayOpportunities.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-[#1E3A8A]" />
                            Upcoming
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingDeadlines.length === 0 ? (
                            <p className="text-[#64748B] text-sm text-center py-6">
                                No upcoming deadlines
                            </p>
                        ) : (
                            upcomingDeadlines.map((opp) => (
                                <Link
                                    key={opp.id}
                                    href={`/opportunities/${opp.id}`}
                                    className="block p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
                                >
                                    <p className="font-medium text-[#0F172A] text-sm truncate">
                                        {opp.title}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-[#64748B]">
                                            {formatRelativeDate(opp.deadline)}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {opp.opportunityType}
                                        </Badge>
                                    </div>
                                </Link>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
