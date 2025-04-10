// import "@/app/globals.css";
import UniversityLayout from "./mainComponents/UniversityLayout";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UniversityLayout />
        {children}
      </body>
    </html>
  );
}
