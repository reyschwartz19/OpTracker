'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    Settings,
    MoreHorizontal,
    LogOut,
    X,
    Sparkles,
    FileText,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function MobileNav() {
    const pathname = usePathname()
    const [showMore, setShowMore] = useState(false)

    return (
        <>
            {/* More Menu Overlay */}
            {showMore && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowMore(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-8 animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading font-semibold text-[#0F172A]">More Options</h3>
                            <button
                                onClick={() => setShowMore(false)}
                                className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Additional Navigation Links */}
                        <div className="space-y-1 mb-4">
                            <Link
                                href="/discovery"
                                onClick={() => setShowMore(false)}
                                className={cn(
                                    'flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150',
                                    pathname.startsWith('/discovery')
                                        ? 'bg-[#F1F5F9] text-[#1E3A8A]'
                                        : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                                )}
                            >
                                <Sparkles className="w-5 h-5" />
                                Discovery
                            </Link>
                            <Link
                                href="/documents"
                                onClick={() => setShowMore(false)}
                                className={cn(
                                    'flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150',
                                    pathname.startsWith('/documents')
                                        ? 'bg-[#F1F5F9] text-[#1E3A8A]'
                                        : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                                )}
                            >
                                <FileText className="w-5 h-5" />
                                Documents
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#E2E8F0] my-2" />

                        <button
                            onClick={() => {
                                setShowMore(false)
                                signOut({ callbackUrl: '/' })
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-150"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] md:hidden">
                <div className="flex items-center justify-around px-2 py-2">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 min-w-[60px] relative',
                                    isActive
                                        ? 'text-[#1E3A8A]'
                                        : 'text-[#64748B]'
                                )}
                            >
                                <item.icon className={cn('w-5 h-5', isActive && 'text-[#1E3A8A]')} />
                                <span>{item.name}</span>
                                {isActive && (
                                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#1E3A8A] rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                    {/* More Button */}
                    <button
                        onClick={() => setShowMore(true)}
                        className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 min-w-[60px] text-[#64748B]"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                        <span>More</span>
                    </button>
                </div>
            </nav>
        </>
    )
}
