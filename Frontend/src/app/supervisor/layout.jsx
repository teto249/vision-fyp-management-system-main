// import "@/app/globals.css";
import UniversityLayout from "./components/MainLayut/UniversityLayout";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        <UniversityLayout >{children}</UniversityLayout>
        
      </body>
    </html>
  );
}
