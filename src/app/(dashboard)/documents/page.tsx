import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { DocumentsContent } from './documents-content'

export default async function DocumentsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    const documents = await prisma.document.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <DashboardLayout title="Document Vault">
            <DocumentsContent documents={documents} />
        </DashboardLayout>
    )
}
