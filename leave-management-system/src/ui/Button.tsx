import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "white" | "gold";

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
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 shadow-sm hover:shadow-md",
        {
          "text-white bg-gradient-to-r from-[#1a237e] to-[#303f9f] hover:from-[#283593] hover:to-[#3949ab]": variant === "primary",
          "text-[#1a237e] bg-[#c5a200] hover:bg-[#d4af00]": variant === "gold",
          "text-white bg-gradient-to-r from-[#138808] to-[#0d6b06] hover:from-[#15990a] hover:to-[#0f7d08]": variant === "success",
          "text-white bg-gradient-to-r from-[#c62828] to-[#b71c1c] hover:from-[#d32f2f] hover:to-[#c62828]": variant === "danger",
          "text-[#1a237e] bg-white border-2 border-[#1a237e] hover:bg-[#e8eaf6]": variant === "white",
          "text-[#1a237e] bg-[#C2B280] hover:bg-[#b5a370]": variant === "secondary",
          "w-full": fullWidth,
        },
        className
      )}
      {...props}
    />
  );
};

export default Button;
