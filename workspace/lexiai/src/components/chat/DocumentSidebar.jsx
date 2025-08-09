import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Image } from 'lucide-react'
import { format } from 'date-fns'

const categoryColors = {
  contract: 'bg-blue-100 text-blue-800',
  correspondence: 'bg-green-100 text-green-800',
  evidence: 'bg-red-100 text-red-800',
  court_filing: 'bg-purple-100 text-purple-800',
  research: 'bg-yellow-100 text-yellow-800',
  form: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
}

export default function DocumentSidebar({ documents }) {
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }
  return (
    <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-slate-200 p-4 overflow-auto">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold text-[var(--navy)]">Case Documents ({documents.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-500">No documents uploaded yet</p>
            </div>
          ) : (
            documents.map(document => (
              <Card key={document.id} className="p-3 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getFileIcon(document.file_type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-[var(--navy)] truncate">{document.title}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className={`text-xs ${categoryColors[document.document_category] || categoryColors.other}`}>{document.document_category?.replace(/_/g, ' ')}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{format(new Date(document.created_date), 'MMM d, yyyy')}</p>
                    {document.extracted_content && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{document.extracted_content.substring(0, 100)}...</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}