export function Badge({ className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border border-slate-200',
    outline: 'border border-slate-300 text-slate-700',
  }
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${variants[variant] || variants.default} ${className}`} {...props} />
}
export default Badge