import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateUserSchema = z.object({
    name: z.string().optional(),
    timezone: z.string().optional(),
    defaultReminderCadence: z.string().optional(),
    emailPreferences: z.object({}).passthrough().optional(),
})

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validated = updateUserSchema.parse(body)

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...validated,
                emailPreferences: validated.emailPreferences
                    ? JSON.stringify(validated.emailPreferences)
                    : undefined,
            },
        })

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            timezone: user.timezone,
            defaultReminderCadence: user.defaultReminderCadence,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Failed to update user:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}
