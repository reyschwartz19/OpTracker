import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { sendEmail } from "@/lib/email"
import ResetPasswordEmail from "@/emails/reset-password"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return new NextResponse("Email is required", { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Always return success even if user doesn't exist (security)
        if (!user) {
            return new NextResponse("Email sent", { status: 200 })
        }

        // Generate token
        const token = randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        // Store token
        // First, delete any existing tokens for this user/identifier
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        })

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        })

        // Send email
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

        await sendEmail({
            to: email,
            subject: "Reset your password",
            react: ResetPasswordEmail({ resetLink }),
        })

        return new NextResponse("Email sent", { status: 200 })
    } catch (error) {
        console.error("[FORGOT_PASSWORD]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
