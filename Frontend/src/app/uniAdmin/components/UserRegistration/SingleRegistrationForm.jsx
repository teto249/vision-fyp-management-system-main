import { User, Mail, Phone, MapPin, Hash, Building, GraduationCap, Briefcase } from "lucide-react";

export default function SingleRegistrationForm({ role, formData, handleChange, fieldErrors }) {
  const inputClasses = (fieldName) => `
    w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border 
    ${fieldErrors[fieldName] ? 'border-red-500/50' : 'border-slate-700/50'} 
    rounded-xl text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50
    hover:border-slate-600/50 transition-all duration-300
  `;

  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Personal Information</h3>
            <p className="text-sm text-slate-400">Basic details about the user</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputClasses('fullName')}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-red-400 text-sm">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* University Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">University Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="universityEmail"
                type="email"
                placeholder="Enter university email"
                value={formData.universityEmail}
                onChange={handleChange}
                required
                className={inputClasses('universityEmail')}
              />
            </div>
            {fieldErrors.universityEmail && (
              <p className="text-red-400 text-sm">{fieldErrors.universityEmail}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={inputClasses('phoneNumber')}
              />
            </div>
            {fieldErrors.phoneNumber && (
              <p className="text-red-400 text-sm">{fieldErrors.phoneNumber}</p>
            )}
          </div>

          {/* ID Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">ID Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="idNumber"
                type="text"
                placeholder="Enter ID number"
                value={formData.idNumber}
                onChange={handleChange}
                required
                className={inputClasses('idNumber')}
              />
            </div>
            {fieldErrors.idNumber && (
              <p className="text-red-400 text-sm">{fieldErrors.idNumber}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Department</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="department"
                type="text"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
                required
                className={inputClasses('department')}
              />
            </div>
            {fieldErrors.department && (
              <p className="text-red-400 text-sm">{fieldErrors.department}</p>
            )}
          </div>

          {/* Level (Student only) */}
          {role === "Student" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Level</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className={inputClasses('level')}
                >
                  <option value="PSM-1">PSM-1</option>
                  <option value="PSM-2">PSM-2</option>
                </select>
              </div>
              {fieldErrors.level && (
                <p className="text-red-400 text-sm">{fieldErrors.level}</p>
              )}
            </div>
          )}

          {/* Address (Full Width) */}
          <div className="lg:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-slate-300">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
                         rounded-xl text-white placeholder-slate-500 resize-none
                         focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50
                         hover:border-slate-600/50 transition-all duration-300"
              />
            </div>
            {fieldErrors.address && (
              <p className="text-red-400 text-sm">{fieldErrors.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Supervisor Details Section */}
      {role === "Supervisor" && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Supervisor Details</h3>
              <p className="text-sm text-slate-400">Additional information for supervisors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter contact email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={inputClasses('contactEmail')}
                />
              </div>
              {fieldErrors.contactEmail && (
                <p className="text-red-400 text-sm">{fieldErrors.contactEmail}</p>
              )}
            </div>

            {/* Office Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Office Address</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="officeAddress"
                  type="text"
                  placeholder="Enter office address"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  className={inputClasses('officeAddress')}
                />
              </div>
              {fieldErrors.officeAddress && (
                <p className="text-red-400 text-sm">{fieldErrors.officeAddress}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}