"use client";

export default function ScrollLink({ to, children, className, onClick }) {
  const scrollTo = (e) => {
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