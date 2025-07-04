// import "@/app/globals.css";
import UniversityLayout from "./components/MainLayut/UniversityLayout";
import { StudentsProvider } from "./store/StudentsContext";

export default function RootLayout({ children }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="relative min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <UniversityLayout>
            <StudentsProvider>
              {children}
            </StudentsProvider>
          </UniversityLayout>
        </div>
      </div>
    </div>
  );
}
