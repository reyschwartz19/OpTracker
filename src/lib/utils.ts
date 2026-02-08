import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'No date'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
    if (!date) return 'No date'
    const d = new Date(date)
    const now = new Date()
    const diffTime = d.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays <= 7) return `In ${diffDays} days`
    if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`
    return formatDate(date)
}

export function parseJsonArray(json: string | null | undefined): string[] {
    if (!json) return []
    try {
        return JSON.parse(json)
    } catch {
        return []
    }
}

export function stringifyJsonArray(arr: string[]): string {
    return JSON.stringify(arr)
}
