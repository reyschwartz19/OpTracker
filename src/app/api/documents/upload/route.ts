import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

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

        // Generate unique filename
        const ext = file.name.split('.').pop() || ''
        const uniqueFilename = `${nanoid()}.${ext}`

        // Save file to local storage (for development)
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })

        const buffer = Buffer.from(await file.arrayBuffer())
        const filePath = join(uploadDir, uniqueFilename)
        await writeFile(filePath, buffer)

        const fileUrl = `/uploads/${uniqueFilename}`

        // Create document record (no virus scanning per user request)
        const document = await prisma.document.create({
            data: {
                userId: session.user.id,
                filename: file.name,
                fileUrl,
                fileSize: file.size,
                mimeType: file.type,
                category,
                opportunityId: opportunityId || null,
            },
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error('Upload failed:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
