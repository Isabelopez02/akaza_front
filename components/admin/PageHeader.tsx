import React from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
      <div>
        <h1 className="font-serif text-lg sm:text-xl font-bold text-akaza-marron tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}
