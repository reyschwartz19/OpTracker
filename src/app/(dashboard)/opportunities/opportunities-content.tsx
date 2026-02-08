'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate, parseJsonArray } from '@/lib/utils'
import { fadeSlideIn, staggerContainer, staggerItem } from '@/lib/motion/presets'
import {
    Plus,
    Search,
    Calendar,
    Briefcase,
    ExternalLink,
    Filter,
} from 'lucide-react'

interface Opportunity {
    id: string
    title: string
    organization: string | null
    description: string | null
    sourceUrl: string | null
    opportunityType: string
    status: string
    deadline: Date | null
    tags: string | null
    createdAt: Date
}

interface OpportunitiesContentProps {
    opportunities: Opportunity[]
}

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'interested', label: 'Interested' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'interview', label: 'Interview' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'archived', label: 'Archived' },
]

const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'internship', label: 'Internship' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'job', label: 'Job' },
]

export function OpportunitiesContent({ opportunities }: OpportunitiesContentProps) {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')

    // Filter opportunities
    const filteredOpportunities = opportunities.filter((opp) => {
        const matchesSearch =
            !search ||
            opp.title.toLowerCase().includes(search.toLowerCase()) ||
            opp.organization?.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = !statusFilter || opp.status === statusFilter
        const matchesType = !typeFilter || opp.opportunityType === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    return (
        <motion.div {...fadeSlideIn} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
                        Opportunities
                    </h1>
                    <p className="text-[#64748B] mt-1">
                        {opportunities.length} total opportunities tracked
                    </p>
                </div>
                <Link href="/opportunities/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Opportunity
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <Input
                                placeholder="Search opportunities..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            options={statusOptions}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            className="sm:w-40"
                        />
                        <Select
                            options={typeOptions}
                            value={typeFilter}
                            onChange={setTypeFilter}
                            className="sm:w-40"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Opportunities List */}
            {filteredOpportunities.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Briefcase className="w-12 h-12 mx-auto text-[#CBD5E1] mb-4" />
                        <h3 className="font-heading text-lg font-semibold text-[#0F172A] mb-2">
                            {opportunities.length === 0
                                ? 'No opportunities yet'
                                : 'No opportunities match your filters'}
                        </h3>
                        <p className="text-[#64748B] mb-6">
                            {opportunities.length === 0
                                ? 'Start by adding your first opportunity to track.'
                                : 'Try adjusting your search or filters.'}
                        </p>
                        {opportunities.length === 0 && (
                            <Link href="/opportunities/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Opportunity
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                >
                    {filteredOpportunities.map((opp) => (
                        <motion.div key={opp.id} variants={staggerItem}>
                            <Link href={`/opportunities/${opp.id}`}>
                                <Card className="hover:shadow-lg cursor-pointer transition-all duration-200">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-heading text-lg font-semibold text-[#0F172A] truncate">
                                                        {opp.title}
                                                    </h3>
                                                    {opp.sourceUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                window.open(opp.sourceUrl!, '_blank', 'noopener,noreferrer')
                                                            }}
                                                            className="text-[#1E3A8A] hover:text-[#4338CA]"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                {opp.organization && (
                                                    <p className="text-[#64748B] mb-3">{opp.organization}</p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline">{opp.opportunityType}</Badge>
                                                    <Badge
                                                        variant={opp.status as 'interested' | 'in_progress' | 'submitted' | 'accepted' | 'rejected'}
                                                    >
                                                        {opp.status.replace('_', ' ')}
                                                    </Badge>
                                                    {parseJsonArray(opp.tags).slice(0, 2).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-[#64748B]">
                                                {opp.deadline && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatRelativeDate(opp.deadline)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
