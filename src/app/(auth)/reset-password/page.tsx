"use client"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    })

    // Redirect if no token
    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center p-6">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
                    <p className="text-slate-600">This password reset link is invalid or has expired.</p>
                    <Button className="mt-4" onClick={() => router.push("/forgot-password")}>
                        Request New Link
                    </Button>
                </Card>
            </div>
        )
    }

    const onSubmit = async (data: ResetPasswordValues) => {
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password }),
            })

            if (!response.ok) {
                const msg = await response.text()
                throw new Error(msg || "Something went wrong")
            }

            setSuccess(true)
            toast.success("Password reset successfully!")
            setTimeout(() => router.push("/login"), 3000)
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Set New Password</CardTitle>
                    <CardDescription>
                        Create a new password for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
                                Your password has been successfully reset.
                            </div>
                            <p className="text-sm text-slate-500">
                                Redirecting to login...
                            </p>
                            <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2 relative">
                                <Input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Input
                                    {...register("confirmPassword")}
                                    type="password"
                                    placeholder="Confirm Password"
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md p-6 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    <p className="text-slate-500 text-sm">Loading...</p>
                </Card>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
