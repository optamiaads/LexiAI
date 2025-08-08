export function DropdownMenu({ children }) { return <div className="relative inline-block">{children}</div> }
export function DropdownMenuTrigger({ asChild, children }) { return children }
export function DropdownMenuContent({ children, align = 'start' }) { return <div className="border rounded-md bg-white shadow p-2 mt-1">{children}</div> }
export function DropdownMenuItem({ children, onSelect, ...props }) { return <div className="px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded" onClick={onSelect} {...props}>{children}</div> }
export default DropdownMenu