import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcryptjs"

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { currentPassword, newPassword } = await req.json()

        if (!currentPassword || !newPassword) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user || !user.password) {
            return new NextResponse("User not found or no password set", { status: 404 })
        }

        // Verify current password
        const isPasswordValid = await compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return new NextResponse("Incorrect current password", { status: 400 })
        }

        // Update to new password
        const hashedPassword = await hash(newPassword, 12)

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        })

        return new NextResponse("Password updated successfully", { status: 200 })
    } catch (error) {
        console.error("[UPDATE_PASSWORD]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
