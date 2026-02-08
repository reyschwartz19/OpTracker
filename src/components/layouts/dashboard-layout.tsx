'use client'

import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'
import { TopNav } from './top-nav'

interface DashboardLayoutProps {
    children: React.ReactNode
    title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="md:ml-64">
                <TopNav title={title} />

                <main className="p-6 pb-24 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    )
}
