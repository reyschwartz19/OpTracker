'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Sparkles,
    Shield,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Discovery', href: '/discovery', icon: Sparkles },
]

const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'curator'

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-white border-r border-[#E2E8F0]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1E3A8A]">
                    <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-lg font-semibold text-[#0F172A]">
                    OpTracker
                </span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150',
                                isActive
                                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}

                {/* Admin Section */}
                {isAdmin && (
                    <>
                        <div className="pt-6 pb-2">
                            <p className="px-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                                Admin
                            </p>
                        </div>
                        <Link
                            href="/admin/opportunities"
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150',
                                pathname.startsWith('/admin')
                                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                            )}
                        >
                            <Shield className="w-5 h-5" />
                            Curation Queue
                        </Link>
                    </>
                )}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-4 py-4 border-t border-[#E2E8F0]">
                {bottomNavigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150',
                                isActive
                                    ? 'bg-[#F1F5F9] text-[#0F172A]'
                                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}

                {/* User & Logout */}
                {session?.user && (
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                        <div className="px-4 py-2">
                            <p className="text-sm font-medium text-[#0F172A] truncate">
                                {session.user.name || session.user.email}
                            </p>
                            <p className="text-xs text-[#64748B] truncate">
                                {session.user.email}
                            </p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-150"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}
