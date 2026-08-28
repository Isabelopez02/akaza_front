import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;
};

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  type = "button",
  title,
}: ButtonProps) {
  const baseClasses = "flex items-center gap-2 font-bold rounded-xl transition-all shadow-sm";

  const variantClasses = {
    primary: "bg-akaza-marron text-white hover:bg-black disabled:opacity-50",
    secondary: "bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-[11px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
