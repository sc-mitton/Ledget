import { HTMLAttributes, forwardRef } from 'react';

export const ResponsiveLineContainer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ children, ...props }, ref) => (
    <div ref={ref} style={{ position: 'absolute', width: '100%', height: '70%' }}>
        {children}
    </div>
))
