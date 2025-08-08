export function Label({ className = '', ...props }) {
  return <label className={`block mb-1 text-sm font-medium text-slate-700 ${className}`} {...props} />
}
export default Label