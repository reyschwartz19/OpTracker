import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createOpportunitySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    sourceUrl: z.string().url().optional().nullable().or(z.literal('')),
    opportunityType: z.enum(['scholarship', 'internship', 'fellowship', 'job']),
    deadline: z.string().datetime().optional().nullable(),
    tags: z.array(z.string()).optional(),
})

// GET - List opportunities
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const type = searchParams.get('type')

        const opportunities = await prisma.opportunity.findMany({
            where: {
                createdByUserId: session.user.id,
                ...(status && { status }),
                ...(type && { opportunityType: type }),
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(opportunities)
    } catch (error) {
        console.error('Failed to fetch opportunities:', error)
        return NextResponse.json(
            { error: 'Failed to fetch opportunities' },
            { status: 500 }
        )
    }
}

// POST - Create opportunity
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validated = createOpportunitySchema.parse(body)

        // Check for duplicates
        if (validated.sourceUrl) {
            const existing = await prisma.opportunity.findFirst({
                where: {
                    createdByUserId: session.user.id,
                    sourceUrl: validated.sourceUrl,
                },
            })

            if (existing) {
                return NextResponse.json(
                    { error: 'An opportunity with this URL already exists', existingId: existing.id },
                    { status: 400 }
                )
            }
        }

        const opportunity = await prisma.opportunity.create({
            data: {
                title: validated.title,
                organization: validated.organization || null,
                description: validated.description || null,
                sourceUrl: validated.sourceUrl || null,
                opportunityType: validated.opportunityType,
                deadline: validated.deadline ? new Date(validated.deadline) : null,
                tags: validated.tags ? JSON.stringify(validated.tags) : null,
                createdByUserId: session.user.id,
                status: 'interested',
            },
        })

        // Create initial timeline step
        await prisma.timelineStep.create({
            data: {
                opportunityId: opportunity.id,
                stepType: 'saved',
                label: 'Saved opportunity',
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

        console.error('Failed to create opportunity:', error)
        return NextResponse.json(
            { error: 'Failed to create opportunity' },
            { status: 500 }
        )
    }
}
