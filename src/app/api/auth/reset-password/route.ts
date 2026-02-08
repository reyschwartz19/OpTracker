import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Verify token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        })

        if (!verificationToken) {
            return new NextResponse("Invalid or expired token", { status: 400 })
        }

        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({ where: { token } })
            return new NextResponse("Token has expired", { status: 400 })
        }

        const { identifier } = verificationToken

        // Update user password
        const hashedPassword = await hash(password, 12)

        await prisma.user.update({
            where: { email: identifier },
            data: { password: hashedPassword },
        })

        // Delete used token
        await prisma.verificationToken.delete({
            where: { token },
        })

        return new NextResponse("Password reset successfully", { status: 200 })
    } catch (error) {
        console.error("[RESET_PASSWORD]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
