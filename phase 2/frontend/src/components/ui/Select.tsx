// src/components/ui/Select.tsx
// Base select component for the application

import React from 'react';
import { cn } from '../../lib/utils';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: string;
}

const Select = ({ children, value, onValueChange }: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              ...child.props,
              selectedValue,
              setOpen,
              open,
            } as any);
          }
          if (child.type === SelectContent) {
            return React.cloneElement(child, {
              ...child.props,
              open,
              onValueChange: handleSelect,
            } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps & {
    selectedValue?: string;
    open?: boolean;
    setOpen?: (open: boolean) => void;
  }
>(({ className, children, selectedValue, open, setOpen, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => setOpen && setOpen(!open)}
      type="button"
      {...props}
    >
      <span>{selectedValue || children}</span>
      <svg
        className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="6,9 12,15 18,9" />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps & {
    open?: boolean;
    onValueChange?: (value: string) => void;
  }
>(({ className, children, open, onValueChange, ...props }, ref) => {
  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, {
            ...child.props,
            onSelect: onValueChange,
          } as any);
        }
        return child;
      })}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps & {
    onSelect?: (value: string) => void;
  }
>(({ className, children, value, onSelect, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={() => onSelect && onSelect(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <svg
          className="h-4 w-4"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="9,11 12,14 22,4" />
        </svg>
      </span>
      {children}
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <span>{placeholder}</span>;
};

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
};