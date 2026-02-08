'use client'

import { useSession } from 'next-auth/react'

interface TopNavProps {
    title?: string
}

export function TopNav({ title }: TopNavProps) {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
            <div className="flex items-center gap-4">
                {title && (
                    <h1 className="font-heading text-xl font-semibold text-[#0F172A]">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* User Avatar - Mobile */}
                <div className="flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-[#1E3A8A] text-white text-sm font-medium">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </div>
            </div>
        </header>
    )
}
