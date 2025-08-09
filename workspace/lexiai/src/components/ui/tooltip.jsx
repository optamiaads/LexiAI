export function TooltipProvider({ children }) { return children }
export function Tooltip({ children }) { return children }
export function TooltipTrigger({ asChild, children }) { return children }
export function TooltipContent({ children }) { return <div className="text-xs text-slate-500">{children}</div> }
export default Tooltip