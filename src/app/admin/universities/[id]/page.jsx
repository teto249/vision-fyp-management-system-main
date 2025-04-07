"use client";
import { useState } from "react";
import UniversityRegistrationForm from "../../uniregistration/page";

export default function UniversityViewPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [universityData, setUniversityData] = useState({
    shortName: "UTM",
    name: "University Technology Malaysia",
    address: "47, Jalan Utama 38, Muttara Rini, Johor Bahru Skudai",
    contactEmail: "info@utm.my",
    phone: "0123456789",
    maxStudents: 1000,
    maxSupervisors: 200,
    description: "A leading technology university in Malaysia",
    adminName: "Altayeb Mustafa Ibrahim Abdelrasoul",
    adminEmail: "admin@graduate.utm.my",
    adminPhone: "0123456789",
    adminAddress: "43, Jalan Utama 38, Muttara Rini, Johor Bahru Skudai"
  });

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      shortName: formData.get("shortName"),
      name: formData.get("universityName"),
      address: formData.get("universityAddress"),
      contactEmail: formData.get("contactEmail"),
      phone: formData.get("phoneNumber"),
      maxStudents: Number(formData.get("maxStudents")),
      maxSupervisors: Number(formData.get("maxSupervisors")),
      description: formData.get("description"),
      adminName: formData.get("adminName"),
      adminEmail: formData.get("adminEmail"),
      adminPhone: formData.get("adminPhone"),
      adminAddress: formData.get("adminAddress")
    };
    setUniversityData(updatedData);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <UniversityForm
          initialData={universityData}
          onSave={handleSave}
          isEditMode={true}
        />
      ) : (
        <div className="flex justify-center items-start min-h-screen bg-base-100 py-10">
          <div className="w-full max-w-4xl mx-4 bg-base-200 rounded-2xl shadow-lg overflow-hidden">
            <h5 className="text-center bg-base-300/10 p-4 px-2 text-xl font-bold">
              University Information
            </h5>
            <div className="divider divider-neutral mx-auto mb-4 mt-2 max-w-50"></div>

            <div className="p-6">
              <form className="grid gap-y-2">
                {/* University Details */}
                <div className="m-2 divider text-xl">University Details</div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="label-text">Short Name</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.shortName}
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Full University Name</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.name}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="label-text">Address</label>
                  <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                    {universityData.address}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="label-text">Contact Email</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.contactEmail}
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Phone Number</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.phone}
                    </div>
                  </div>
                </div>

                {/* User Capacity */}
                <div className="m-2 divider text-xl">User Capacity</div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="label-text">Maximum Students Allowed</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.maxStudents}
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Maximum Supervisors Allowed</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.maxSupervisors}
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="m-2 divider text-xl">Additional Information</div>

                <div>
                  <label className="label-text">University Description</label>
                  <div className="textarea w-full min-h-32 bg-base-100 p-4">
                    {universityData.description}
                  </div>
                </div>

                {/* Admin Information */}
                <div className="m-2 divider text-xl">Admin Details</div>

                <div>
                  <label className="label-text">Admin Full Name</label>
                  <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                    {universityData.adminName}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="label-text">Admin Email</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.adminEmail}
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Admin Phone</label>
                    <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                      {universityData.adminPhone}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label-text">Admin Address</label>
                  <div className="input w-full bg-base-100 h-12 flex items-center px-4">
                    {universityData.adminAddress}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary w-full"
                  >
                    Edit Information
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}