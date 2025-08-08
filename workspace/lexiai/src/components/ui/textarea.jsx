export function Textarea({ className = '', ...props }) {
  return <textarea className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${className}`} {...props} />
}
export default Textarea