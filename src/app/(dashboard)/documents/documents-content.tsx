'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fadeSlideIn, staggerContainer, staggerItem } from '@/lib/motion/presets'
import { formatDate } from '@/lib/utils'
import {
    Upload,
    FileText,
    File,
    Search,
    Download,
    Trash2,
    MoreVertical,
    FolderOpen,
} from 'lucide-react'

interface Document {
    id: string
    filename: string
    fileUrl: string
    fileSize: number
    mimeType: string
    category: string | null
    createdAt: Date
}

interface DocumentsContentProps {
    documents: Document[]
}

const categoryColors: Record<string, string> = {
    cv: 'bg-blue-100 text-blue-700',
    essay: 'bg-purple-100 text-purple-700',
    transcript: 'bg-green-100 text-green-700',
    recommendation: 'bg-amber-100 text-amber-700',
    other: 'bg-gray-100 text-gray-600',
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(mimeType: string) {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('image')) return '🖼️'
    return '📎'
}

export function DocumentsContent({ documents: initialDocuments }: DocumentsContentProps) {
    const [documents, setDocuments] = useState(initialDocuments)
    const [search, setSearch] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const filteredDocuments = documents.filter((doc) =>
        doc.filename.toLowerCase().includes(search.toLowerCase())
    )

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', files[0])
            formData.append('category', 'other')

            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const newDoc = await response.json()
                setDocuments([newDoc, ...documents])
            }
        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setDocuments(documents.filter(d => d.id !== id))
            }
        } catch (error) {
            console.error('Delete failed:', error)
        }
    }

    return (
        <motion.div {...fadeSlideIn} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
                        Document Vault
                    </h1>
                    <p className="text-[#64748B] mt-1">
                        {documents.length} documents stored
                    </p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={isUploading}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <Input
                            placeholder="Search documents..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Documents Grid */}
            {filteredDocuments.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FolderOpen className="w-12 h-12 mx-auto text-[#CBD5E1] mb-4" />
                        <h3 className="font-heading text-lg font-semibold text-[#0F172A] mb-2">
                            {documents.length === 0
                                ? 'No documents yet'
                                : 'No documents match your search'}
                        </h3>
                        <p className="text-[#64748B] mb-6">
                            {documents.length === 0
                                ? 'Upload your first document to get started.'
                                : 'Try adjusting your search.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredDocuments.map((doc) => (
                        <motion.div key={doc.id} variants={staggerItem}>
                            <Card className="hover:shadow-lg transition-all duration-200">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">{getFileIcon(doc.mimeType)}</div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-[#0F172A] truncate mb-1">
                                                {doc.filename}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs text-[#64748B]">
                                                    {formatFileSize(doc.fileSize)}
                                                </span>
                                                <span className="text-[#CBD5E1]">•</span>
                                                <span className="text-xs text-[#64748B]">
                                                    {formatDate(doc.createdAt)}
                                                </span>
                                            </div>
                                            <Badge
                                                className={categoryColors[doc.category || 'other']}
                                            >
                                                {doc.category || 'Other'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                                        <a
                                            href={doc.fileUrl}
                                            download={doc.filename}
                                            className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
