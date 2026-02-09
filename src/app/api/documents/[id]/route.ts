import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { del } from '@vercel/blob'

// DELETE - Delete document
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
        const document = await prisma.document.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // Delete file from Vercel Blob
        try {
            await del(document.fileUrl)
        } catch {
            // File may already be deleted from blob storage
        }

        // Delete document record
        await prisma.document.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete failed:', error)
        return NextResponse.json(
            { error: 'Failed to delete document' },
            { status: 500 }
        )
    }
}

