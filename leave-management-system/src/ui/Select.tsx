import * as React from "react";
import clsx from "clsx";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  tooltip?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string; // new prop for responsive container
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      tooltip,
      error,
      required,
      className,
      id,
      children,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx("w-full space-y-1", containerClassName)}>
        {label && (
          <label htmlFor={id} className="label-base w-full block">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
            {tooltip && (
              <span className="ml-1 text-xs text-muted-foreground">
                {tooltip}
              </span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          className={clsx(
            "input-base w-full", // ensure select is full width
            error &&
              "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p className="text-xs text-danger animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;