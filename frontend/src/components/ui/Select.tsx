import * as React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full appearance-none items-center justify-between rounded-md border bg-transparent px-3 py-2 pr-8 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-3 right-3 h-4 w-4 opacity-50" />
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
