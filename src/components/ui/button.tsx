import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    const baseStyles =
      "animation-standard font-medium rounded-lg inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
      tertiary: "bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover",
      outline: "border-2 border-border bg-transparent hover:bg-muted",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
