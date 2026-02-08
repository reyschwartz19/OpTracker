import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { DashboardContent } from './dashboard-content'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    // Fetch dashboard data
    const [opportunities, recentOpportunities, upcomingDeadlines] = await Promise.all([
        // Count total opportunities
        prisma.opportunity.count({
            where: { createdByUserId: session.user.id },
        }),
        // Recent opportunities
        prisma.opportunity.findMany({
            where: { createdByUserId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
        // Upcoming deadlines (next 30 days)
        prisma.opportunity.findMany({
            where: {
                createdByUserId: session.user.id,
                deadline: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                status: { notIn: ['archived', 'rejected', 'accepted'] },
            },
            orderBy: { deadline: 'asc' },
            take: 5,
        }),
    ])

    // Count by status
    const statusCounts = await prisma.opportunity.groupBy({
        by: ['status'],
        where: { createdByUserId: session.user.id },
        _count: true,
    })

    const stats = {
        total: opportunities,
        interested: statusCounts.find(s => s.status === 'interested')?._count || 0,
        inProgress: statusCounts.find(s => s.status === 'in_progress')?._count || 0,
        submitted: statusCounts.find(s => s.status === 'submitted')?._count || 0,
        accepted: statusCounts.find(s => s.status === 'accepted')?._count || 0,
    }

    return (
        <DashboardLayout title="Dashboard">
            <DashboardContent
                stats={stats}
                recentOpportunities={recentOpportunities}
                upcomingDeadlines={upcomingDeadlines}
                userName={session.user.name || 'there'}
            />
        </DashboardLayout>
    )
}
