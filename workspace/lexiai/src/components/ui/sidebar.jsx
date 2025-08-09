export function Sidebar({ children }) { return <aside className="w-64">{children}</aside> }
export function SidebarProvider({ children }) { return children }
export function SidebarContent({ children }) { return <div>{children}</div> }
export function SidebarGroup({ children }) { return <div>{children}</div> }
export function SidebarGroupContent({ children }) { return <div>{children}</div> }
export function SidebarGroupLabel({ children }) { return <div className="text-xs uppercase tracking-wide text-slate-500">{children}</div> }
export function SidebarMenu({ children }) { return <div>{children}</div> }
export function SidebarMenuItem({ children }) { return <div>{children}</div> }
export function SidebarMenuButton({ children }) { return <button className="w-full text-left">{children}</button> }
export function SidebarHeader({ children }) { return <div>{children}</div> }
export function SidebarFooter({ children }) { return <div>{children}</div> }
export function SidebarTrigger({ children }) { return <button>{children}</button> }
export default Sidebar