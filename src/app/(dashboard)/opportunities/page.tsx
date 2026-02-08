import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { OpportunitiesContent } from './opportunities-content'

export default async function OpportunitiesPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    // Fetch opportunities
    const opportunities = await prisma.opportunity.findMany({
        where: { createdByUserId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <DashboardLayout title="Opportunities">
            <OpportunitiesContent opportunities={opportunities} />
        </DashboardLayout>
    )
}
