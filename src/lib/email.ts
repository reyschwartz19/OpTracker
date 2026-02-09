import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
    to,
    subject,
    react,
}: {
    to: string
    subject: string
    react: React.ReactElement
}) => {
    try {
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Opportunity Manager <onboarding@resend.dev>',
            to,
            subject,
            react,
        })

        return { success: true, data }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}
