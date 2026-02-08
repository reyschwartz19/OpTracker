'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fadeSlideIn } from '@/lib/motion/presets'
import {
    Link2,
    Loader2,
    ArrowLeft,
    Calendar,
    Building,
    FileText,
    Tag,
} from 'lucide-react'
import Link from 'next/link'

const opportunitySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().optional(),
    description: z.string().optional(),
    sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    opportunityType: z.enum(['scholarship', 'internship', 'fellowship', 'job']),
    deadline: z.string().optional(),
    tags: z.string().optional(),
})

type OpportunityFormData = z.infer<typeof opportunitySchema>

const typeOptions = [
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'internship', label: 'Internship' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'job', label: 'Job' },
]

export function NewOpportunityForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isExtracting, setIsExtracting] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OpportunityFormData>({
        resolver: zodResolver(opportunitySchema),
        defaultValues: {
            opportunityType: 'scholarship',
        },
    })

    const sourceUrl = watch('sourceUrl')

    const handleExtractFromUrl = async () => {
        if (!sourceUrl) return

        setIsExtracting(true)
        try {
            const response = await fetch('/api/opportunities/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: sourceUrl }),
            })

            if (response.ok) {
                const data = await response.json()
                if (data.title) setValue('title', data.title)
                if (data.organization) setValue('organization', data.organization)
                if (data.description) setValue('description', data.description)
                if (data.deadline) setValue('deadline', data.deadline)
            }
        } catch (error) {
            console.error('Failed to extract:', error)
        } finally {
            setIsExtracting(false)
        }
    }

    const onSubmit = async (data: OpportunityFormData) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
                    tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create opportunity')
            }

            const opportunity = await response.json()
            router.push(`/opportunities/${opportunity.id}`)
            router.refresh()
        } catch (error) {
            console.error('Failed to create opportunity:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div {...fadeSlideIn} className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Opportunities
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* URL Extraction */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#0F172A]">
                                <Link2 className="inline w-4 h-4 mr-1.5" />
                                Source URL (optional)
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    {...register('sourceUrl')}
                                    placeholder="https://example.com/opportunity"
                                    error={errors.sourceUrl?.message}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleExtractFromUrl}
                                    disabled={!sourceUrl || isExtracting}
                                >
                                    {isExtracting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Extract'
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-[#64748B]">
                                Paste a URL and click Extract to auto-fill details
                            </p>
                        </div>

                        {/* Title */}
                        <div>
                            <Input
                                {...register('title')}
                                label="Title"
                                placeholder="e.g., Google Software Engineering Internship"
                                error={errors.title?.message}
                            />
                        </div>

                        {/* Organization */}
                        <div className="relative">
                            <Building className="absolute left-3 top-11 w-4 h-4 text-[#94A3B8]" />
                            <Input
                                {...register('organization')}
                                label="Organization"
                                placeholder="e.g., Google"
                                className="pl-10"
                            />
                        </div>

                        {/* Opportunity Type */}
                        <Select
                            label="Type"
                            options={typeOptions}
                            value={watch('opportunityType')}
                            onChange={(value) => setValue('opportunityType', value as OpportunityFormData['opportunityType'])}
                        />

                        {/* Deadline */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-11 w-4 h-4 text-[#94A3B8]" />
                            <Input
                                type="date"
                                {...register('deadline')}
                                label="Deadline"
                                className="pl-10"
                            />
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <Textarea
                                {...register('description')}
                                label="Description"
                                placeholder="Brief description of the opportunity..."
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Tags */}
                        <div className="relative">
                            <Tag className="absolute left-3 top-11 w-4 h-4 text-[#94A3B8]" />
                            <Input
                                {...register('tags')}
                                label="Tags"
                                placeholder="tech, summer 2024, remote (comma-separated)"
                                className="pl-10"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Link href="/opportunities">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" isLoading={isLoading}>
                                Create Opportunity
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}
