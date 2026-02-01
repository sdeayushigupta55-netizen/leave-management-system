import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const Button = ({
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "btn-base",
       
        {
          "text-white": variant !== "white",
          "btn-primary": variant === "primary",
          "btn-secondary": variant === "secondary",
          "btn-success": variant === "success",
          "btn-danger": variant === "danger",
          "w-full": fullWidth,
          "btn-white": variant === "white",
          "text-primary": variant === "white",
          "border border-primary": variant === "white",
        },
        className
      )}
      {...props}
    />
  );
};

export default Button;
