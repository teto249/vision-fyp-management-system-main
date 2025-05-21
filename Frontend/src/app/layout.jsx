
import "./globals.css";


export const metadata = {
  title: "V Management System",
  description: "Final Year Project Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-900">
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
