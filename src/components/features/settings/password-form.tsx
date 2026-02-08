"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Lock, Eye, EyeOff } from "lucide-react"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type PasswordValues = z.infer<typeof passwordSchema>

export function PasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
    })

    const onSubmit = async (data: PasswordValues) => {
        try {
            const response = await fetch("/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            })

            if (!response.ok) {
                const msg = await response.text()
                throw new Error(msg || "Something went wrong")
            }

            toast.success("Password updated successfully")
            reset()
        } catch (error: any) {
            toast.error(error.message || "Failed to update password")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#1E3A8A]" />
                    Password
                </CardTitle>
                <CardDescription>
                    Update your password to keep your account secure
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2 relative">
                        <Input
                            {...register("currentPassword")}
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            className={errors.currentPassword ? "border-red-500" : ""}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        {errors.currentPassword && (
                            <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2 relative">
                        <Input
                            {...register("newPassword")}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            className={errors.newPassword ? "border-red-500" : ""}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="Confirm New Password"
                            className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
