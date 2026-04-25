"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--surface, #fff)",
          "--normal-text": "var(--text, #1E293B)",
          "--normal-border": "var(--border, #E2E8F0)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
