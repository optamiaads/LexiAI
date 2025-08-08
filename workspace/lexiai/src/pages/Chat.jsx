import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LegalCase, Document, ChatMessage } from '@/entities/all'
import { InvokeLLM } from '@/integrations/Core'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Send, Upload, ArrowLeft, Loader2 } from 'lucide-react'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import ChatMessages from '@/components/chat/ChatMessages'
import DocumentUpload from '@/components/chat/DocumentUpload'
import DocumentSidebar from '@/components/chat/DocumentSidebar'

export default function ChatPage() {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const caseId = urlParams.get('caseId')

  const [legalCase, setLegalCase] = useState(null)
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (caseId) loadCaseData()
    else { setError('No case ID provided.'); setIsLoading(false) }
  }, [caseId])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const loadCaseData = async () => {
    setIsLoading(true); setError(null)
    try {
      const caseData = await LegalCase.get(caseId)
      if (!caseData) throw new Error('Case not found.')
      const [documentsData, messagesData] = [
        Document.filter({ case_id: caseId }, '-created_date'),
        ChatMessage.filter({ case_id: caseId }, 'created_date'),
      ]
      setLegalCase(caseData); setDocuments(documentsData); setMessages(messagesData)
    } catch (err) {
      console.error('Error loading case data:', err)
      setError(`Failed to load case data: ${err.message}`)
      setLegalCase(null)
    }
    setIsLoading(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return
    const userMessage = newMessage
    setNewMessage(''); setIsSending(true)

    const savedUserMessage = await ChatMessage.create({ case_id: caseId, message: userMessage, sender: 'user', message_type: 'text' })
    setMessages(prev => [...prev, savedUserMessage])

    try {
      const documentContext = documents.map(doc => `Document: ${doc.title}\nContent: ${doc.extracted_content || 'Content not extracted'}`).join('\n\n')

      const prompt = `You are a versatile and professional legal AI assistant.\n\nCASE INFORMATION:\nTitle: ${legalCase?.title}\nType: ${legalCase?.case_type}\nDescription: ${legalCase?.description}\nJurisdiction: ${legalCase?.jurisdiction}\n\nDocuments:\n${documentContext}\n\nUser's question: ${userMessage}`

      const responseSchema = {
        type: 'object',
        properties: {
          jurisdiction_analysis: { type: 'object', properties: { federal_indicators_found: { type: 'array', items: { type: 'string' } }, proper_jurisdiction: { type: 'string', enum: ['federal','state','uncertain'] }, reasoning: { type: 'string' } } },
          response_text: { type: 'string' },
          updated_case_data: { type: 'object', properties: { deadline: { type: 'string', format: 'date' }, priority: { type: 'string', enum: ['low','medium','high','urgent'] }, status: { type: 'string', enum: ['active','research','drafting','filing','completed','closed'] }, jurisdiction: { type: 'string' } } },
        },
        required: ['response_text'],
      }

      const aiResponseObject = await InvokeLLM({ prompt, add_context_from_internet: true, response_json_schema: responseSchema })
      let aiMessageContent = aiResponseObject.response_text

      if (aiResponseObject.jurisdiction_analysis?.reasoning) {
        const analysis = aiResponseObject.jurisdiction_analysis
        aiMessageContent += `\n\nJURISDICTION ANALYSIS:\nProper jurisdiction: ${analysis.proper_jurisdiction?.toUpperCase()}\nReasoning: ${analysis.reasoning}`
      }

      if (aiResponseObject.updated_case_data && Object.keys(aiResponseObject.updated_case_data).length > 0) {
        const updates = aiResponseObject.updated_case_data
        await LegalCase.update(caseId, updates)
        setLegalCase(prev => ({ ...prev, ...updates }))
        const updatedFields = Object.keys(updates).map(key => (key === 'deadline' && updates[key] ? `deadline to ${format(new Date(updates[key] + 'T00:00:00'), 'MMMM d, yyyy')}` : `${key} to "${updates[key]}"`)).join(', ')
        aiMessageContent += `\n\n*System Update: I've updated the case ${updatedFields}.*`
      }

      const savedAiMessage = await ChatMessage.create({ case_id: caseId, message: aiMessageContent, sender: 'assistant', message_type: 'text' })
      setMessages(prev => [...prev, savedAiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const savedErrorMessage = await ChatMessage.create({ case_id: caseId, message: "I apologize, but I'm having trouble processing your request right now. Please try again.", sender: 'assistant', message_type: 'text' })
      setMessages(prev => [...prev, savedErrorMessage])
    }
    setIsSending(false)
  }

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }
  const handleDocumentUploaded = () => { loadCaseData(); setShowUpload(false) }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--navy)]" />
          <p className="text-slate-600">Loading case data...</p>
        </div>
      </div>
    )
  }

  if (error || !legalCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-[var(--navy)] mb-2">Error Loading Case</h2>
          <p className="text-slate-600 mb-4">{error || 'The requested case could not be found.'}</p>
          <p className="text-sm text-slate-500 mb-4">Case ID: {caseId}</p>
          <Link to={createPageUrl('Cases')}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Cases</Button></Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Cases')}><Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
              <div>
                <h1 className="text-xl font-bold text-[var(--navy)]">{legalCase.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{legalCase.case_type?.replace(/_/g, ' ')}</Badge>
                  {legalCase.jurisdiction && (<span className="text-sm text-slate-500">{legalCase.jurisdiction}</span>)}
                </div>
              </div>
            </div>
            <Button onClick={() => setShowUpload(true)} variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" />Upload Document</Button>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto p-6">
              <ChatMessages messages={messages} />
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask your legal AI assistant anything..." className="min-h-[60px] resize-none" disabled={isSending} />
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending} className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy-light)] hover:shadow-lg transition-all duration-300 px-6">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DocumentSidebar documents={documents} />
        </div>
      </div>

      <DocumentUpload open={showUpload} onOpenChange={setShowUpload} caseId={caseId} onDocumentUploaded={handleDocumentUploaded} />
    </div>
  )
}