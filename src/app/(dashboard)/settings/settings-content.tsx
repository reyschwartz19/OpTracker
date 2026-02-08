'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { fadeSlideIn } from '@/lib/motion/presets'
import { User, Clock, Bell, Save, Check } from 'lucide-react'
import { PasswordForm } from '@/components/features/settings/password-form'

interface UserSettings {
    id: string
    name: string | null
    email: string
    timezone: string
    defaultReminderCadence: string
    emailPreferences: string | null
}

interface SettingsContentProps {
    user: UserSettings
}

const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Chicago', label: 'Central Time (US)' },
    { value: 'America/Denver', label: 'Mountain Time (US)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
]

const reminderOptions = [
    { value: '7,3,1', label: '7, 3, and 1 days before' },
    { value: '14,7,3,1', label: '14, 7, 3, and 1 days before' },
    { value: '3,1', label: '3 and 1 days before' },
    { value: '7,1', label: '7 and 1 days before' },
    { value: '1', label: '1 day before only' },
]

export function SettingsContent({ user }: SettingsContentProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const [name, setName] = useState(user.name || '')
    const [timezone, setTimezone] = useState(user.timezone)
    const [reminderCadence, setReminderCadence] = useState(user.defaultReminderCadence)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    timezone,
                    defaultReminderCadence: reminderCadence,
                }),
            })

            if (response.ok) {
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 2000)
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to save settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div {...fadeSlideIn} className="max-w-2xl mx-auto space-y-6">
            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#1E3A8A]" />
                        Profile
                    </CardTitle>
                    <CardDescription>
                        Manage your account information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Input
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <Input
                            label="Email"
                            value={user.email}
                            disabled
                            className="bg-[#F1F5F9]"
                        />
                        <p className="text-xs text-[#64748B] mt-1">
                            Email cannot be changed
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#1E3A8A]" />
                        Preferences
                    </CardTitle>
                    <CardDescription>
                        Customize your experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select
                        label="Timezone"
                        options={timezoneOptions}
                        value={timezone}
                        onChange={setTimezone}
                    />
                </CardContent>
            </Card>

            {/* Reminders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#1E3A8A]" />
                        Reminders
                    </CardTitle>
                    <CardDescription>
                        Configure when you receive deadline reminders
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select
                        label="Default Reminder Schedule"
                        options={reminderOptions}
                        value={reminderCadence}
                        onChange={setReminderCadence}
                    />
                    <p className="text-sm text-[#64748B]">
                        You&apos;ll receive reminders before each deadline at these intervals.
                    </p>
                </CardContent>
            </Card>

            {/* Password Settings */}
            <PasswordForm />

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    isLoading={isLoading}
                    className={isSaved ? 'bg-[#14B8A6] hover:bg-[#0D9488]' : ''}
                >
                    {isSaved ? (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    )
}
