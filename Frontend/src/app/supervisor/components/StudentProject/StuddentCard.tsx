
import { AcademicCapIcon, BuildingOfficeIcon, ChevronDownIcon, EnvelopeIcon, PhoneIcon,MapPinIcon, ChatBubbleLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import ProjectDetails from "./ProjectDetails";
import type { Student } from "../../types/types";
interface StudentCardProps {
  student: Student;
  isExpanded: boolean;
  onToggle: () => void;
  onViewProject: () => void;
}

function ContactInfo({ email, phoneNumber, address }: ContactInfoProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Contact Information
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-300">
          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          <a
            href={`mailto:${email}`}
            className="text-teal-500 hover:text-teal-400 transition-colors"
          >
            {email}
          </a>
        </div>
        {phoneNumber && (
          <div className="flex items-center gap-3 text-gray-300">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
            <span>{phoneNumber}</span>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-3 text-gray-300">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  );
}


interface ContactInfoProps {
  email: string;
  phoneNumber?: string;
  address?: string;
}

export default function StudentCard({
  student,
  isExpanded,
  onToggle,
  onViewProject,
}: StudentCardProps) {
  const router = useRouter();

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/supervisor/chat?studentId=${student.studentId}`);
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 
                   hover:border-teal-500/50 transition-all duration-300"
    >
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-100 mb-1">
              {student.fullName}
            </h3>
            {/* Project Title */}
            {student.project?.projectTitle && (
              <p className="text-sm text-teal-400 font-medium mb-2 flex items-center gap-1">
                <DocumentTextIcon className="h-4 w-4" />
                {student.project.projectTitle}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <AcademicCapIcon className="h-4 w-4" />
                {student.level}
              </span>
              <span className="flex items-center gap-1">
                <BuildingOfficeIcon className="h-4 w-4" />
                {student.department}
              </span>
            </div>
          </div>
          <ChevronDownIcon
            className={`h-6 w-6 text-gray-400 transition-transform duration-300
                      ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="p-6 pt-0 border-t border-gray-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ContactInfo
              email={student.universityEmail}
              phoneNumber={student.phoneNumber}
              address={student.address}
            />
            <div className="lg:col-span-2">
              <ProjectDetails project={student.project ?? undefined} />
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={handleChatClick}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 
                       text-white rounded-lg transition-colors duration-200 
                       flex items-center justify-center gap-2"
            >
              <ChatBubbleLeftIcon className="h-4 w-4" />
              Chat
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProject();
              }}
              className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 
                       text-white rounded-lg transition-colors duration-200"
            >
              View Project Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}