import { HTMLAttributes, forwardRef } from 'react';

export const ResponsiveLineContainer = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { width?: string; height?: string }
>(({ children, width = '100%', height = '100%', ...props }, ref) => (
  <div
    ref={ref}
    style={{ position: 'absolute', width: width, height: height }}
    {...props}
  >
    {children}
  </div>
));
