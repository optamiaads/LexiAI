import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, User } from 'lucide-react'
import { format } from 'date-fns'

export default function ChatMessages({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-light)] rounded-2xl flex items-center justify-center">
            <Bot className="w-8 h-8 text-[var(--gold)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--navy)] mb-2">Start Your Legal Consultation</h3>
          <p className="text-slate-600 max-w-md">Ask me anything about your case. I can help analyze documents, research laws, draft legal documents, and provide guidance.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.map((message, index) => (
        <div key={message.id || index} className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-[var(--gold)] text-[var(--navy)]' : 'bg-gradient-to-br from-[var(--navy)] to-[var(--navy-light)] text-[var(--gold)]'}`}>
            {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <Card className={`max-w-3xl p-4 ${message.sender === 'user' ? 'bg-[var(--gold)]/10 border-[var(--gold)]/20' : 'bg-white/80 backdrop-blur-sm border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">{message.sender === 'user' ? 'You' : 'Legal AI'}</Badge>
              <span className="text-xs text-slate-500">{format(new Date(message.created_date), 'MMM d, h:mm a')}</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{message.message}</p>
            </div>
            {message.message_type !== 'text' && (
              <Badge variant="outline" className="mt-2 text-xs">{message.message_type?.replace(/_/g, ' ')}</Badge>
            )}
          </Card>
        </div>
      ))}
    </div>
  )
}