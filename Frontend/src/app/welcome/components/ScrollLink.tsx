"use client";

interface ScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function ScrollLink({ to, children, className, onClick }: ScrollLinkProps) {
  const scrollTo = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Call additional onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={scrollTo} className={className} type="button">
      {children}
    </button>
  );
}
