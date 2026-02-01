import * as React from "react";
import clsx from "clsx";

type BaseProps = {
  label?: string;
  tooltip?: string;
  error?: string;
  required?: boolean;
  as?: "input" | "textarea";
};

type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type InputFieldProps = InputProps | TextareaProps;

export const InputField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>((props, ref) => {
  const {
    label,
    tooltip,
    required,
    error,
    className,
    as = "input",
    id,
    ...rest
  } = props;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={id} className="label-base">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
          {tooltip && (
            <span className="ml-1 text-xs text-muted-foreground">
              {tooltip}
            </span>
          )}
        </label>
      )}

      {as === "textarea" ? (
        <textarea
          id={id}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={clsx(
            "input-base",
            error &&
              "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          ref={ref as React.Ref<HTMLInputElement>}
          className={clsx(
            "input-base",
            error &&
              "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p className="text-xs text-danger animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;