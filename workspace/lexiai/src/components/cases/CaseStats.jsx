import { Card, CardContent } from '@/components/ui/card'
import { FileText, Scale, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function CaseStats({ cases, documents, messages, isLoading }) {
  const activeCases = cases.filter(c => c.status === 'active').length
  const urgentCases = cases.filter(c => {
    if (!c.deadline) return false
    const deadline = new Date(c.deadline)
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return deadline <= weekFromNow
  }).length

  const stats = [
    { title: 'Total Cases', value: cases.length, icon: Scale, color: 'from-blue-500 to-blue-600' },
    { title: 'Active Cases', value: activeCases, icon: FileText, color: 'from-green-500 to-green-600' },
    { title: 'Documents', value: documents.length, icon: FileText, color: 'from-purple-500 to-purple-600' },
    { title: 'Urgent Deadlines', value: urgentCases, icon: Clock, color: 'from-red-500 to-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-[var(--navy)] mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}