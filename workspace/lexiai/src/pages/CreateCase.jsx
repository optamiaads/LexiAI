import { useState, useCallback } from 'react'
import { LegalCase, Document } from '@/entities/all'
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '@/integrations/Core'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload as UploadIcon, FileText } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import AIAnalysisProgress from '@/components/cases/AIAnalysisProgress'

export default function CreateCasePage() {
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisSteps, setAnalysisSteps] = useState([])
  const [fileErrors, setFileErrors] = useState([])
  const [processingError, setProcessingError] = useState('')
  const navigate = useNavigate()

  const MAX_FILE_SIZE = 10 * 1024 * 1024

  const validateFile = (file) => {
    const errors = []
    if (file.size > MAX_FILE_SIZE) errors.push(`${file.name}: File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 10MB limit`)
    const allowedTypes = ['pdf','png','jpg','jpeg','docx','txt']
    const ext = file.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(ext)) errors.push(`${file.name}: File type not supported. Please use PDF, DOCX, TXT, or image files`)
    return errors
  }

  const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover') }, [])
  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      const allErrors = []; const valid = []
      newFiles.forEach(f => { const errs = validateFile(f); if (errs.length === 0) valid.push(f); else allErrors.push(...errs) })
      setFiles(prev => [...prev, ...valid]); setFileErrors(allErrors)
    }
  }, [])

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files)
      const allErrors = []; const valid = []
      newFiles.forEach(f => { const errs = validateFile(f); if (errs.length === 0) valid.push(f); else allErrors.push(...errs) })
      setFiles(prev => [...prev, ...valid]); setFileErrors(allErrors); e.target.value = null
    }
  }

  const removeFile = (indexToRemove) => { setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove)); setFileErrors([]) }

  const handleCreateCase = async () => {
    if (!description.trim()) { setProcessingError('Please provide a description for the legal issue.'); return }
    setIsProcessing(true); setFileErrors([]); setProcessingError(''); setAnalysisSteps([])

    let stepIndex = -1
    const addStep = (title, status = 'processing') => { stepIndex++; setAnalysisSteps(prev => [...prev, { title, status }]) }
    const updateCurrentStepStatus = (status, errorMessage = '') => {
      setAnalysisSteps(prev => { const next = [...prev]; if (next[stepIndex]) { next[stepIndex].status = status; if (errorMessage) next[stepIndex].error = errorMessage } return next })
    }

    try {
      let uploadedFiles = []
      let documentContents = []

      if (files.length > 0) {
        addStep('Uploading documents...')
        try {
          uploadedFiles = await Promise.all(files.map(file => UploadFile({ file })))
          updateCurrentStepStatus('complete')
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          updateCurrentStepStatus('error', 'Failed to upload one or more files')
          setProcessingError('Failed to upload documents. Please try again with smaller files or check your internet connection.')
          setIsProcessing(false)
          return
        }

        addStep('Analyzing document contents...')
        documentContents = await Promise.all(uploadedFiles.map(async ({ file_url }, index) => {
          let extractedContent = ''
          try {
            const extractResult = await ExtractDataFromUploadedFile({ file_url, json_schema: { type: 'object', properties: { content: { type: 'string' } } } })
            if (extractResult.status === 'success' && extractResult.output?.content) extractedContent = extractResult.output.content
          } catch (e) {
            console.error('Extraction failed for file:', files[index].name, e)
            extractedContent = `[Content extraction failed for ${files[index].name}]`
          }
          return `Document ${index + 1} (${files[index].name}):\n${extractedContent}`
        }))
        updateCurrentStepStatus('complete')
      }

      addStep('AI is structuring your case...')
      let newCase
      try {
        const caseSchema = LegalCase.schema()
        const caseProperties = { ...caseSchema.properties }
        delete caseProperties.status
        const documentsContext = documentContents.length > 0 ? `Content from Uploaded Documents:\n---\n${documentContents.join('\n\n---\n\n')}\n---\n\n` : ''
        const prompt = `You are an expert legal AI assistant specializing in case intake and analysis. Based on the user's description${documentContents.length > 0 ? ' and the content of the provided documents' : ''}, analyze the information and structure it into a new legal case.\n\nUser's Description:\n---\n${description}\n---\n\n${documentsContext}Your task is to analyze all this information and generate a structured JSON object for the new legal case.`
        const aiResponse = await InvokeLLM({ prompt, response_json_schema: { type: 'object', properties: caseProperties } })
        if (!aiResponse || !aiResponse.title || !aiResponse.case_type) throw new Error('AI response is incomplete or invalid. Missing title or case_type.')
        updateCurrentStepStatus('complete')

        addStep('Creating the legal case...')
        newCase = await LegalCase.create({ ...aiResponse, status: 'active', title: aiResponse.title || 'Untitled Legal Case', case_type: aiResponse.case_type || 'other', description: aiResponse.description || description })
        if (!newCase || !newCase.id) throw new Error('Database error: Case was not created successfully, returned invalid ID.')

        if (uploadedFiles.length > 0) {
          await Promise.all(uploadedFiles.map((uploadedFile, index) => Document.create({ case_id: newCase.id, title: files[index].name.replace(/\.[^/.]+$/, ''), file_url: uploadedFile.file_url, file_type: files[index].name.split('.').pop().toLowerCase(), extracted_content: documentContents[index]?.split(':\n')[1] || '', document_category: 'other' })))
        }
        updateCurrentStepStatus('complete')
      } catch (processingLogicError) {
        console.error('AI structuring or Case Creation error:', processingLogicError)
        updateCurrentStepStatus('error', processingLogicError.message)
        setProcessingError(`Analysis failed: ${processingLogicError.message}. Please simplify your description or try again.`)
        setIsProcessing(false)
        return
      }

      addStep('Redirecting to your new case...')
      updateCurrentStepStatus('complete')
      setTimeout(() => navigate(createPageUrl(`Chat?caseId=${newCase.id}`)), 800)
    } catch (error) {
      console.error('General error creating case with AI:', error)
      setAnalysisSteps(prev => [...prev, { title: 'Process failed', status: 'error' }])
      setProcessingError(`An unexpected error occurred: ${error.message}. Please try again.`)
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return <AIAnalysisProgress steps={analysisSteps} error={processingError} onRetry={() => { setIsProcessing(false); setProcessingError(''); setAnalysisSteps([]) }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Cases')}><Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <h1 className="text-2xl font-bold text-[var(--navy)]">Create New Case</h1>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-700">Describe your legal issue *</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Provide a detailed description of your legal issue, relevant facts, and goals..." className="mt-2" />
            </div>

            <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={`rounded-lg border-2 border-dashed p-6 ${dragActive ? 'border-[var(--gold)] bg-[var(--gold)]/10' : 'border-slate-300'}`}>
              <div className="text-center">
                <p className="text-slate-600">Drag and drop files here, or</p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <input id="file-input" type="file" multiple className="hidden" onChange={handleFileSelect} />
                  <Button variant="outline" onClick={() => document.getElementById('file-input').click()}><UploadIcon className="w-4 h-4 mr-2" />Select Files</Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Supported: PDF, DOCX, TXT, JPG, PNG (max 10MB each)</p>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 rounded px-3 py-2">
                      <span>{f.name}</span>
                      <Button variant="outline" size="sm" onClick={() => removeFile(idx)}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
              {fileErrors.length > 0 && (
                <div className="mt-3 text-sm text-red-600 space-y-1">{fileErrors.map((e, i) => <div key={i}>• {e}</div>)}</div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreateCase} className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy-light)] hover:shadow-lg transition-all duration-300">
                <FileText className="w-5 h-5 mr-2" /> Analyze & Create Case
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}