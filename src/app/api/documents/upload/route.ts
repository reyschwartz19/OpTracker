import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
]

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const category = (formData.get('category') as string) || 'other'
        const opportunityId = formData.get('opportunityId') as string | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            )
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'File type not allowed' },
                { status: 400 }
            )
        }

        // Upload to Vercel Blob
        const blob = await put(`documents/${session.user.id}/${file.name}`, file, {
            access: 'public',
            addRandomSuffix: true,
        })

        // Create document record
        const document = await prisma.document.create({
            data: {
                userId: session.user.id,
                filename: file.name,
                fileUrl: blob.url,
                fileSize: file.size,
                mimeType: file.type,
                category,
                opportunityId: opportunityId || null,
            },
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error('Upload failed:', error)
        if ((error as any).code) {
            console.error('Error Code:', (error as any).code)
        }
        return NextResponse.json(
            { error: 'Failed to upload file', details: (error as Error).message },
            { status: 500 }
        )
    }
}

