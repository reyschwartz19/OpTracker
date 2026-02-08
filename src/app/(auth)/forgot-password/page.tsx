"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const [success, setSuccess] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordValues) => {
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Something went wrong")
            }

            setSuccess(true)
            toast.success("Reset link sent!")
        } catch (error) {
            toast.error("Failed to send reset link. Please try again.")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
                                If an account exists with that email, we've sent instructions to reset your password.
                            </div>
                            <p className="text-sm text-slate-500">
                                Check your spam folder if you don't see it within a few minutes.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="name@example.com"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link
                        href="/login"
                        className="flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
