export function Input({ className = '', ...props }) {
  return <input className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${className}`} {...props} />
}
export default Input