import { useState } from 'react';

interface UserCardProps {
  name: string;
  email: string;
  phone?: string;
  role: 'uniAdmin' | 'Supervisor' | 'Student';
  profilePhoto?: string;
}

export default function UserCard() {
  const demoUsers: UserCardProps[] = [
    {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+60 12-345 6789",
      role: "uniAdmin",
      profilePhoto: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Prof. Michael Chen",
      email: "m.chen@university.edu",
      phone: "+60 12-345 6790",
      role: "Supervisor",
      profilePhoto: "https://i.pravatar.cc/150?u=michael"
    },
    {
      name: "Dr. Lisa Wong",
      email: "l.wong@university.edu",
      phone: "+60 12-345 6791",
      role: "Supervisor",
      profilePhoto: "https://i.pravatar.cc/150?u=lisa"
    },
    {
      name: "Ahmad Bin Abdullah",
      email: "ahmad@university.edu",
      phone: "+60 12-345 6792",
      role: "Student",
      profilePhoto: "https://i.pravatar.cc/150?u=ahmad"
    },
    {
      name: "Maria Santos",
      email: "m.santos@university.edu",
      phone: "+60 12-345 6793",
      role: "Student",
      profilePhoto: "https://i.pravatar.cc/150?u=maria"
    }
  ];

  const getRoleColor = (role: UserCardProps['role']) => {
    switch (role) {
      case 'uniAdmin':
        return 'bg-primary text-primary-content';
      case 'Supervisor':
        return 'bg-secondary text-secondary-content';
      case 'Student':
        return 'bg-accent text-accent-content';
      default:
        return 'bg-neutral text-neutral-content';
    }
  };

  const getRoleIcon = (role: UserCardProps['role']) => {
    switch (role) {
      case 'uniAdmin':
        return '👑';
      case 'Supervisor':
        return '👨‍🏫';
      case 'Student':
        return '👨‍🎓';
      default:
        return '👤';
    }
  };

  const getRoleLabel = (role: UserCardProps['role']) => {
    switch (role) {
      case 'uniAdmin':
        return 'University Administrator';
      case 'Supervisor':
        return 'Supervisor';
      case 'Student':
        return 'Student';
      default:
        return 'Unknown Role';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.currentTarget.alt)}&background=random`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* University Administrators */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-200 mb-6 px-4">
          University Administrators
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {demoUsers.filter(user => user.role === 'uniAdmin').map((user, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-gray-800 overflow-hidden">
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-200 truncate flex items-center gap-2">
                  {user.name}
                  <span className="text-base" role="img" aria-label={getRoleLabel(user.role)}>
                    {getRoleIcon(user.role)}
                  </span>
                </h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p className="truncate">{user.email}</p>
                  {user.phone && <p className="truncate">{user.phone}</p>}
                </div>
              </div>
              <div className="hidden sm:block">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supervisors - Use the same structure as above */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-200 mb-6 px-4">
          Supervisors
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {demoUsers.filter(user => user.role === 'Supervisor').map((user, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-gray-800 overflow-hidden">
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-200 truncate flex items-center gap-2">
                  {user.name}
                  <span className="text-base" role="img" aria-label={getRoleLabel(user.role)}>
                    {getRoleIcon(user.role)}
                  </span>
                </h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p className="truncate">{user.email}</p>
                  {user.phone && <p className="truncate">{user.phone}</p>}
                </div>
              </div>
              <div className="hidden sm:block">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students - Use the same structure as above */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-200 mb-6 px-4">
          Students
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {demoUsers.filter(user => user.role === 'Student').map((user, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-gray-800 overflow-hidden">
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-200 truncate flex items-center gap-2">
                  {user.name}
                  <span className="text-base" role="img" aria-label={getRoleLabel(user.role)}>
                    {getRoleIcon(user.role)}
                  </span>
                </h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p className="truncate">{user.email}</p>
                  {user.phone && <p className="truncate">{user.phone}</p>}
                </div>
              </div>
              <div className="hidden sm:block">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}