import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { CalendarContent } from './calendar-content'

export default async function CalendarPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    // Fetch opportunities with deadlines
    const opportunities = await prisma.opportunity.findMany({
        where: {
            createdByUserId: session.user.id,
            deadline: { not: null },
            status: { notIn: ['archived', 'rejected'] },
        },
        orderBy: { deadline: 'asc' },
    })

    return (
        <DashboardLayout title="Calendar">
            <CalendarContent opportunities={opportunities} />
        </DashboardLayout>
    )
}
