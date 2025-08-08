import { useEffect } from 'react'

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onOpenChange?.(false) }
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange?.(false)}>
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
export function DialogContent(props) { return <div className="p-6" {...props} /> }
export function DialogHeader(props) { return <div className="px-6 pt-6" {...props} /> }
export function DialogTitle(props) { return <h3 className="text-lg font-semibold" {...props} /> }
export default Dialog