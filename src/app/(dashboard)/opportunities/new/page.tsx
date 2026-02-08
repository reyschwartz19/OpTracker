import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { NewOpportunityForm } from './new-opportunity-form'

export default async function NewOpportunityPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    return (
        <DashboardLayout title="Add Opportunity">
            <NewOpportunityForm />
        </DashboardLayout>
    )
}
