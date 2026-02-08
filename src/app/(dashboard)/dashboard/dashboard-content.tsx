'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate, parseJsonArray } from '@/lib/utils'
import { fadeSlideIn, staggerContainer, staggerItem } from '@/lib/motion/presets'
import {
    Briefcase,
    Clock,
    CheckCircle2,
    Target,
    Plus,
    ArrowRight,
    Calendar,
    TrendingUp,
} from 'lucide-react'

interface Opportunity {
    id: string
    title: string
    organization: string | null
    opportunityType: string
    status: string
    deadline: Date | null
    tags: string | null
}

interface DashboardContentProps {
    stats: {
        total: number
        interested: number
        inProgress: number
        submitted: number
        accepted: number
    }
    recentOpportunities: Opportunity[]
    upcomingDeadlines: Opportunity[]
    userName: string
}

export function DashboardContent({
    stats,
    recentOpportunities,
    upcomingDeadlines,
    userName,
}: DashboardContentProps) {
    const statCards = [
        {
            title: 'Total Tracked',
            value: stats.total,
            icon: Briefcase,
            color: 'bg-[#1E3A8A]',
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: Clock,
            color: 'bg-[#4338CA]',
        },
        {
            title: 'Submitted',
            value: stats.submitted,
            icon: Target,
            color: 'bg-[#14B8A6]',
        },
        {
            title: 'Accepted',
            value: stats.accepted,
            icon: CheckCircle2,
            color: 'bg-emerald-600',
        },
    ]

    return (
        <motion.div {...fadeSlideIn} className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#0F172A]">
                        Welcome back, {userName}!
                    </h1>
                    <p className="text-[#64748B] mt-1">
                        Here&apos;s what&apos;s happening with your opportunities.
                    </p>
                </div>
                <Link href="/opportunities/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Opportunity
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {statCards.map((stat) => (
                    <motion.div key={stat.title} variants={staggerItem}>
                        <Card className="relative overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-[#64748B] mb-1">{stat.title}</p>
                                        <p className="text-3xl font-semibold text-[#0F172A]">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`${stat.color} p-2 rounded-lg`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Upcoming Deadlines */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#1E3A8A]" />
                            Upcoming Deadlines
                        </CardTitle>
                        <Link href="/calendar">
                            <Button variant="ghost" size="sm">
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingDeadlines.length === 0 ? (
                            <p className="text-[#64748B] text-sm text-center py-6">
                                No upcoming deadlines in the next 30 days
                            </p>
                        ) : (
                            upcomingDeadlines.map((opp) => (
                                <Link
                                    key={opp.id}
                                    href={`/opportunities/${opp.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#0F172A] truncate">
                                            {opp.title}
                                        </p>
                                        {opp.organization && (
                                            <p className="text-sm text-[#64748B] truncate">
                                                {opp.organization}
                                            </p>
                                        )}
                                    </div>
                                    <Badge
                                        variant={
                                            opp.deadline && new Date(opp.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                                ? 'danger'
                                                : 'secondary'
                                        }
                                    >
                                        {formatRelativeDate(opp.deadline)}
                                    </Badge>
                                </Link>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Recent Opportunities */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#1E3A8A]" />
                            Recent Opportunities
                        </CardTitle>
                        <Link href="/opportunities">
                            <Button variant="ghost" size="sm">
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOpportunities.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-[#64748B] text-sm mb-4">
                                    No opportunities tracked yet
                                </p>
                                <Link href="/opportunities/new">
                                    <Button size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            recentOpportunities.map((opp) => (
                                <Link
                                    key={opp.id}
                                    href={`/opportunities/${opp.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#0F172A] truncate">
                                            {opp.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {opp.opportunityType}
                                            </Badge>
                                            <Badge
                                                variant={opp.status as 'interested' | 'in_progress' | 'submitted' | 'accepted'}
                                            >
                                                {opp.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
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
