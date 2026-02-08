'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Briefcase, Mail, Lock, AlertCircle } from 'lucide-react'
import { fadeSlideIn } from '@/lib/motion/presets'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
    const error = searchParams.get('error')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setLoginError('')

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setLoginError('Invalid email or password')
            } else {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch {
            setLoginError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl })
    }

    return (
        <motion.div {...fadeSlideIn} className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1E3A8A]">
                    <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="font-heading text-2xl font-semibold text-[#0F172A]">
                    OpTracker
                </span>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to continue tracking your opportunities
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {/* Error Messages */}
                    {(loginError || error) && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {loginError || 'Authentication failed. Please try again.'}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#1E3A8A] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#E2E8F0]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-[#94A3B8]">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-[#64748B]">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/signup"
                            className="text-[#1E3A8A] font-medium hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function LoginLoading() {
    return (
        <div className="w-full max-w-md animate-pulse">
            <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="h-8 w-32 bg-gray-200 rounded" />
            </div>
            <div className="bg-white rounded-[14px] p-6 shadow-lg">
                <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded-lg" />
                    <div className="h-12 bg-gray-200 rounded-lg" />
                    <div className="h-11 bg-gray-200 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
            <Suspense fallback={<LoginLoading />}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
