"use client";

export default function ScrollLink({ to, children, className }) {
  const scrollTo = (e) => {
    e.preventDefault();
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button onClick={scrollTo} className={className}>
      {children}
    </button>
  );
}