import { Children } from 'react'

export function Select({ value, onValueChange, children, className = '' }) {
  // Extract items from SelectContent/SelectItem children
  const items = []
  Children.forEach(children, ch => {
    if (ch?.props?.children) {
      Children.forEach(ch.props.children, inner => {
        if (inner?.type?.displayName === 'SelectItem' || inner?.type?.name === 'SelectItem') {
          items.push(inner.props)
        }
      })
    }
  })
  return (
    <select className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 ${className}`} value={value} onChange={e => onValueChange?.(e.target.value)}>
      <option value="" disabled>Select…</option>
      {items.map(it => (
        <option key={it.value} value={it.value}>{it.children || it.label || it.value}</option>
      ))}
    </select>
  )
}
export function SelectTrigger({ children, className = '' }) { return <div className={className}>{children}</div> }
export function SelectValue(props) { return null }
export function SelectContent({ children }) { return <>{children}</> }
export function SelectItem({ children, value }) { return <option value={value}>{children}</option> }
SelectItem.displayName = 'SelectItem'

export default Select