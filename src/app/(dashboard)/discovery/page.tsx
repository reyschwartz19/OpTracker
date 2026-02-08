'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Rocket, Bell } from 'lucide-react'
import { fadeSlideIn } from '@/lib/motion/presets'

export default function DiscoveryPage() {
    return (
        <DashboardLayout title="Discovery">
            <motion.div {...fadeSlideIn} className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="py-12 px-6 text-center">
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#4338CA]"
                        >
                            <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="font-heading text-2xl font-semibold text-[#0F172A] mb-3"
                        >
                            Coming Soon
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-[#64748B] mb-8"
                        >
                            We're building an AI-powered opportunity discovery feature that will help you find scholarships, internships, and jobs tailored to your profile.
                        </motion.p>

                        {/* Features Preview */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] text-left">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E3A8A]/10">
                                    <Rocket className="w-4 h-4 text-[#1E3A8A]" />
                                </div>
                                <span className="text-sm text-[#0F172A]">Personalized recommendations</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] text-left">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#14B8A6]/10">
                                    <Bell className="w-4 h-4 text-[#14B8A6]" />
                                </div>
                                <span className="text-sm text-[#0F172A]">New opportunity alerts</span>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </DashboardLayout>
    )
}
