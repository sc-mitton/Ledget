

export const ExpandableContainer = ({ expanded = true, className = '', children, ...rest }: {
  expanded?: boolean,
  className?: string,
  children: React.ReactNode
}) => (
  <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'} ${className}`} {...rest}>
    {children}
  </div>
)
