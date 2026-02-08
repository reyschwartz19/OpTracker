import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateOpportunitySchema = z.object({
    title: z.string().min(1).optional(),
    organization: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    sourceUrl: z.string().url().optional().nullable().or(z.literal('')),
    opportunityType: z.enum(['scholarship', 'internship', 'fellowship', 'job']).optional(),
    status: z.enum(['interested', 'in_progress', 'submitted', 'interview', 'accepted', 'rejected', 'archived']).optional(),
    deadline: z.string().datetime().optional().nullable(),
    tags: z.array(z.string()).optional(),
    checklistItems: z.array(z.object({
        label: z.string(),
        done: z.boolean(),
        optional: z.boolean().optional(),
        notes: z.string().optional(),
    })).optional(),
})

// GET - Get single opportunity
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const opportunity = await prisma.opportunity.findFirst({
            where: {
                id,
                createdByUserId: session.user.id,
            },
            include: {
                attachments: true,
                reminders: true,
                timelineSteps: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!opportunity) {
            return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
        }

        return NextResponse.json(opportunity)
    } catch (error) {
        console.error('Failed to fetch opportunity:', error)
        return NextResponse.json(
            { error: 'Failed to fetch opportunity' },
            { status: 500 }
        )
    }
}

// PATCH - Update opportunity
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const validated = updateOpportunitySchema.parse(body)

        // Check ownership
        const existing = await prisma.opportunity.findFirst({
            where: {
                id,
                createdByUserId: session.user.id,
            },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
        }

        // If status is changing, create a timeline step
        if (validated.status && validated.status !== existing.status) {
            await prisma.timelineStep.create({
                data: {
                    opportunityId: id,
                    stepType: validated.status,
                    label: `Status changed to ${validated.status.replace('_', ' ')}`,
                },
            })
        }

        const opportunity = await prisma.opportunity.update({
            where: { id },
            data: {
                ...validated,
                deadline: validated.deadline ? new Date(validated.deadline) : undefined,
                tags: validated.tags ? JSON.stringify(validated.tags) : undefined,
                checklistItems: validated.checklistItems ? JSON.stringify(validated.checklistItems) : undefined,
            },
        })

        return NextResponse.json(opportunity)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Failed to update opportunity:', error)
        return NextResponse.json(
            { error: 'Failed to update opportunity' },
            { status: 500 }
        )
    }
}

// DELETE - Delete opportunity
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Check ownership
        const existing = await prisma.opportunity.findFirst({
            where: {
                id,
                createdByUserId: session.user.id,
            },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
        }

        await prisma.opportunity.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete opportunity:', error)
        return NextResponse.json(
            { error: 'Failed to delete opportunity' },
            { status: 500 }
        )
    }
}
