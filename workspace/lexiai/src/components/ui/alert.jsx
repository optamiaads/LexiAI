export function Alert({ className = '', ...props }) {
  return <div className={`rounded-md border border-amber-200 bg-amber-50 p-3 ${className}`} {...props} />
}
export function AlertDescription(props) { return <p className="text-sm text-amber-800" {...props} /> }
export default Alert