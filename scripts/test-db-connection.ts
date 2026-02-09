import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Connecting to database...')
    try {
        await prisma.$connect()
        console.log('Connected successfully.')

        console.log('Counting users...')
        const userCount = await prisma.user.count()
        console.log(`Users: ${userCount}`)

        console.log('Counting documents...')
        const docCount = await prisma.document.count()
        console.log(`Documents: ${docCount}`)

        // Try to create a dummy document if possible, or just checking existing ones is enough to verify table exists.
        // If table doesn't exist, count() will fail.

    } catch (e) {
        console.error('Database error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
