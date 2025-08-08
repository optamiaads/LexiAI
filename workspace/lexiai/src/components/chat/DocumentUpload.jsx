import { useState } from 'react'
import { Document } from '@/entities/all'
import { UploadFile, ExtractDataFromUploadedFile } from '@/integrations/Core'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const DOCUMENT_CATEGORIES = [
  { value: 'contract', label: 'Contract' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'evidence', label: 'Evidence' },
  { value: 'court_filing', label: 'Court Filing' },
  { value: 'research', label: 'Research' },
  { value: 'form', label: 'Form' },
  { value: 'other', label: 'Other' },
]

export default function DocumentUpload({ open, onOpenChange, caseId, onDocumentUploaded }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const MAX_FILE_SIZE = 10 * 1024 * 1024

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`File size (${(selectedFile.size / 1024 / 1024).toFixed(1)}MB) exceeds the 10MB limit.`)
        setFile(null); setTitle(''); return
      }
      const allowedTypes = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'txt']
      const ext = selectedFile.name.split('.').pop().toLowerCase()
      if (!allowedTypes.includes(ext)) {
        setError('File type not supported. Please use PDF, DOCX, TXT, or image files.')
        setFile(null); setTitle(''); return
      }
      setFile(selectedFile)
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      setError('')
    } else { setFile(null); setTitle(''); setError('') }
  }

  const handleUpload = async () => {
    if (!file || !title || !category) { setError('Please select a file, title, and category.'); return }
    setIsUploading(true)
    try {
      const { file_url } = await UploadFile({ file })
      const extract = await ExtractDataFromUploadedFile({ file_url, json_schema: { type: 'object', properties: { content: { type: 'string' } } } })
      const extracted_content = extract?.output?.content || ''
      await Document.create({ case_id: caseId, title, file_url, file_type: file.name.split('.').pop().toLowerCase(), extracted_content, document_category: category })
      onDocumentUploaded?.()
    } catch (e) {
      setError('Failed to upload or process document.')
    }
    setIsUploading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert className="mb-3"><AlertDescription>{error}</AlertDescription></Alert>
        )}
        <div className="space-y-3">
          <div>
            <Label className="text-sm">File</Label>
            <Input type="file" onChange={handleFileSelect} />
          </div>
          <div>
            <Label className="text-sm">Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <Button onClick={handleUpload} disabled={isUploading} className="w-full"><Upload className="w-4 h-4 mr-2" />{isUploading ? 'Uploading...' : 'Upload'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}