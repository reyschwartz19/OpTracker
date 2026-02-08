'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    FileText,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Documents', href: '/documents', icon: FileText },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] md:hidden">
            <div className="flex items-center justify-around px-2 py-2">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 min-w-[60px]',
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
            </div>
        </nav>
    )
}
