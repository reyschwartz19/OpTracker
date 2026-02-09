
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Testing upload logic...')

    // 1. Test nanoid
    console.log('Testing nanoid...')
    const id = nanoid()
    console.log(`Generated ID: ${id}`)

    // 2. Test file write
    console.log('Testing file write...')
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filePath = join(uploadDir, `test-${id}.txt`)
    await writeFile(filePath, 'Hello World')
    console.log(`Written to ${filePath}`)

    // 3. Test DB create
    console.log('Testing DB create...')
    // Need a valid user ID. 
    // I'll cheat and fetch the first user.
    const user = await prisma.user.findFirst()
    if (!user) {
        console.error('No user found to test ownership.')
        return
    }

    const doc = await prisma.document.create({
        data: {
            userId: user.id,
            filename: `test-${id}.txt`,
            fileUrl: `/uploads/test-${id}.txt`,
            fileSize: 11,
            mimeType: 'text/plain',
            category: 'other',
            opportunityId: null,
        }
    })
    console.log('Document created:', doc)

    // Cleanup
    await prisma.document.delete({ where: { id: doc.id } })
    console.log('Cleanup done.')
}

main()
    .catch(e => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
