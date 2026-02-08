import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { OpportunityDetail } from './opportunity-detail'

export default async function OpportunityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    const { id } = await params

    const opportunity = await prisma.opportunity.findFirst({
        where: {
            id,
            createdByUserId: session.user.id,
        },
        include: {
            timelineSteps: {
                orderBy: { createdAt: 'asc' },
            },
            attachments: true,
            reminders: true,
        },
    })

    if (!opportunity) {
        redirect('/opportunities')
    }

    return (
        <DashboardLayout title="Opportunity Details">
            <OpportunityDetail opportunity={opportunity} />
        </DashboardLayout>
    )
}
