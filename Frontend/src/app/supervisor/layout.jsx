// import "@/app/globals.css";
import UniversityLayout from "./components/MainLayut/UniversityLayout";
import { StudentsProvider } from "./store/StudentsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 min-h-screen">
        <UniversityLayout >
          <StudentsProvider>
            {children}
          </StudentsProvider>
        </UniversityLayout>

      </body>
    </html>
  );
}
