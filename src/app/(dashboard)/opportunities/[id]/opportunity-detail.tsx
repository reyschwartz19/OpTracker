'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, ExternalLink, Trash2, Save, Plus, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StatusTimeline } from '@/components/features/opportunities/status-timeline'
import { fadeSlideIn } from '@/lib/motion/presets'

interface ChecklistItem {
    id: string
    label: string
    done: boolean
}

interface Opportunity {
    id: string
    title: string
    organization: string | null
    description: string | null
    sourceUrl: string | null
    status: string
    opportunityType: string
    deadline: Date | null
    checklistItems: string | null
    tags: string | null
    createdAt: Date
    timelineSteps: any[]
}

interface OpportunityDetailProps {
    opportunity: Opportunity
}

export function OpportunityDetail({ opportunity }: OpportunityDetailProps) {
    const router = useRouter()
    const [status, setStatus] = useState(opportunity.status)
    const [isLoading, setIsLoading] = useState(false)
    const [checklist, setChecklist] = useState<ChecklistItem[]>(
        opportunity.checklistItems ? JSON.parse(opportunity.checklistItems) : []
    )
    const [newItemText, setNewItemText] = useState('')
    const [notes, setNotes] = useState(opportunity.description || '')

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus)
        try {
            await fetch(`/api/opportunities/${opportunity.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            router.refresh()
        } catch (error) {
            console.error('Failed to update status:', error)
        }
    }

    const saveChanges = async () => {
        setIsLoading(true)
        try {
            await fetch(`/api/opportunities/${opportunity.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: notes,
                    checklistItems: checklist,
                }),
            })
            router.refresh()
        } catch (error) {
            console.error('Failed to save changes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addChecklistItem = () => {
        if (!newItemText.trim()) return
        const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            label: newItemText,
            done: false,
        }
        setChecklist([...checklist, newItem])
        setNewItemText('')
    }

    const toggleChecklistItem = (id: string) => {
        setChecklist(
            checklist.map((item) =>
                item.id === id ? { ...item, done: !item.done } : item
            )
        )
    }

    const deleteChecklistItem = (id: string) => {
        setChecklist(checklist.filter((item) => item.id !== id))
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this opportunity?')) return
        try {
            await fetch(`/api/opportunities/${opportunity.id}`, {
                method: 'DELETE',
            })
            router.push('/opportunities')
            router.refresh()
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    return (
        <motion.div {...fadeSlideIn} className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <Link
                        href="/opportunities"
                        className="inline-flex items-center text-sm text-[#64748B] hover:text-[#0F172A] mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Opportunities
                    </Link>
                    <h1 className="font-heading text-3xl font-bold text-[#0F172A]">
                        {opportunity.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[#64748B] font-medium text-lg">
                            {opportunity.organization}
                        </span>
                        {opportunity.sourceUrl && (
                            <a
                                href={opportunity.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2563EB] hover:underline inline-flex items-center text-sm"
                            >
                                Visit Source <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button onClick={saveChanges} isLoading={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                        <span className="text-xs text-[#64748B] uppercase font-semibold">Status</span>
                        <div className="mt-1">
                            <Badge variant={status as any} className="text-sm">
                                {status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                        <span className="text-xs text-[#64748B] uppercase font-semibold">Type</span>
                        <div className="mt-1 font-medium capitalize">{opportunity.opportunityType}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                        <span className="text-xs text-[#64748B] uppercase font-semibold">Deadline</span>
                        <div className="mt-1 font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#64748B]" />
                            {opportunity.deadline ? format(new Date(opportunity.deadline), 'MMM d, yyyy') : 'No deadline'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                        <span className="text-xs text-[#64748B] uppercase font-semibold">Tags</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {opportunity.tags && JSON.parse(opportunity.tags).map((tag: string) => (
                                <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    {tag}
                                </span>
                            ))}
                            {!opportunity.tags && <span className="text-sm text-gray-400">-</span>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatusTimeline
                        currentStatus={status}
                        steps={opportunity.timelineSteps}
                        onStatusChange={handleStatusChange}
                    />
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Checklist */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Requirements Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add item..."
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                            />
                            <Button size="icon" onClick={addChecklistItem}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {checklist.length === 0 && (
                                <p className="text-sm text-center text-gray-400 py-4">No items yet</p>
                            )}
                            {checklist.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 group">
                                    <button
                                        onClick={() => toggleChecklistItem(item.id)}
                                        className={cn(
                                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                            item.done ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 hover:border-blue-500"
                                        )}
                                    >
                                        {item.done && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                    <span className={cn("flex-1 text-sm", item.done && "text-gray-400 line-through")}>
                                        {item.label}
                                    </span>
                                    <button
                                        onClick={() => deleteChecklistItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Notes & Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[300px] resize-none"
                            placeholder="Add details, requirements, or notes here..."
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Documents Upload Hint */}
            <Card>
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-lg">Documents</h3>
                        <p className="text-sm text-gray-500">Manage your application documents in the Vault</p>
                    </div>
                    <Link href="/documents">
                        <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Go to Document Vault
                        </Button>
                    </Link>
                </CardContent>
            </Card>

        </motion.div>
    )
}
