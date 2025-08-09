export function AlertDialog({ children }) { return children }
export function AlertDialogTrigger({ asChild, children }) { return children }
export function AlertDialogContent({ children }) { return <div className="p-4">{children}</div> }
export function AlertDialogHeader({ children }) { return <div className="mb-2">{children}</div> }
export function AlertDialogFooter({ children }) { return <div className="mt-3 flex justify-end gap-2">{children}</div> }
export function AlertDialogTitle({ children }) { return <h3 className="font-semibold">{children}</h3> }
export function AlertDialogDescription({ children }) { return <p className="text-sm text-slate-600">{children}</p> }
export function AlertDialogAction({ children, onClick, className='' }) { return <button className={`px-3 py-1.5 rounded bg-red-600 text-white ${className}`} onClick={onClick}>{children}</button> }
export function AlertDialogCancel({ children }) { return <button className="px-3 py-1.5 rounded border">{children}</button> }
export default AlertDialog