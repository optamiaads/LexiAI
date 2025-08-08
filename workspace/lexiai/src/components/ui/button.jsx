export function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] focus:ring-[var(--gold)]',
    outline: 'border border-slate-300 text-[var(--navy)] bg-white hover:bg-slate-50 focus:ring-[var(--gold)]',
    ghost: 'text-[var(--navy)] hover:bg-slate-100',
  }
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
    icon: 'h-10 w-10',
  }
  return <button className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`} {...props} />
}
export default Button