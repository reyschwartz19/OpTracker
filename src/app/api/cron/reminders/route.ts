import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import ReminderEmail from "@/emails/reminder"
import { Reminder } from "@prisma/client"
import { addDays, startOfDay, endOfDay, differenceInDays } from "date-fns"

// Vercel Cron will trigger this
export async function GET(req: Request) {
    // Check for specialized header or secret if needed
    // const authHeader = req.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 })
    // }

    try {
        const today = startOfDay(new Date())
        const reminderOffsets = [1, 3, 7]
        let sentCount = 0

        for (const offset of reminderOffsets) {
            const targetDate = addDays(today, offset)
            const start = startOfDay(targetDate)
            const end = endOfDay(targetDate)

            // Find opportunities due on this target date
            const opportunities = await prisma.opportunity.findMany({
                where: {
                    deadline: {
                        gte: start,
                        lte: end,
                    },
                    status: {
                        in: ['interested', 'in_progress', 'decision_pending']
                    }
                },
                include: {
                    createdBy: true,
                    reminders: true, // Include existing reminders to check duplicates
                }
            })

            for (const opportunity of opportunities) {
                // Check if we already sent a reminder for this offset
                const alreadySent = opportunity.reminders.some(
                    (r: Reminder) => r.offsetDays === offset && r.status === 'sent'
                )

                if (alreadySent) continue

                // Send email
                const user = opportunity.createdBy
                if (!user.email) continue

                const emailResult = await sendEmail({
                    to: user.email,
                    subject: `Reminder: ${opportunity.title} is due in ${offset} days`,
                    react: ReminderEmail({
                        opportunityTitle: opportunity.title,
                        deadline: opportunity.deadline ? opportunity.deadline.toLocaleDateString() : 'Unknown',
                        opportunityLink: `${process.env.NEXT_PUBLIC_APP_URL}/opportunities/${opportunity.id}`,
                        daysLeft: offset,
                    }),
                })

                if (emailResult.success) {
                    // Log the reminder
                    await prisma.reminder.create({
                        data: {
                            userId: user.id,
                            opportunityId: opportunity.id,
                            scheduledAt: new Date(), // It was "scheduled" for now effectively
                            offsetDays: offset,
                            channel: 'email',
                            status: 'sent',
                            sentAt: new Date(),
                        }
                    })
                    sentCount++
                } else {
                    console.error(`Failed to send reminder for ${opportunity.id}:`, emailResult.error)
                }
            }
        }

        return NextResponse.json({ success: true, sent: sentCount })
    } catch (error) {
        console.error("[CRON_REMINDERS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
