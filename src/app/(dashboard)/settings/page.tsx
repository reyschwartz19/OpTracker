import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { SettingsContent } from './settings-content'

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            timezone: true,
            defaultReminderCadence: true,
            emailPreferences: true,
        },
    })

    return (
        <DashboardLayout title="Settings">
            <SettingsContent user={user!} />
        </DashboardLayout>
    )
}
