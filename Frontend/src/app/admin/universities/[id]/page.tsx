"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUniversityById } from "../../../../api/admin/fetchUniversities";
import type { UniversityDetail } from "../../../../api/admin/fetchUniversities";
import TextDivider from "../../account/ui/TextDivider";
import TextArea from "../../components/uniregistration/TextArea";
import UserCard from "../../components/university/UserCard";

export default function UniversityViewPage() {
  const params = useParams();
  const [universityData, setUniversityData] = useState<UniversityDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUniversityData = async () => {
      try {
        const data = await fetchUniversityById(params.id as string);
        setUniversityData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch university data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadUniversityData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!universityData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">No university data found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-10  bg-gray-800">
      <div className="container mx-auto px-10 space-y-8 ">
        {/* University Information Card */}
        <div className="bg-gray-700 rounded-xl shadow-lg overflow-hidden border border-gray-600">
          <div className="my-5 mx-3 flex justify-center items-center text-center">
            <TextDivider>University Information</TextDivider>
          </div>

          <div className="space-y-8">
            {/* University Details Section */}
            <div className="space-y-6 m-5">
              <TextArea description="Basic information about the institution">
                University Details
              </TextArea>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Short Name
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.shortName}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.name}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Address
                </label>
                <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                  {universityData.address}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 m-5">
              <TextArea description="Official communication channels">
                Contact Information
              </TextArea>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.contactEmail}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Phone
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* System Capacity */}
            <div className="space-y-6 m-5">
              <TextArea description="User limits for the platform">
                System Capacity
              </TextArea>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Max Students
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.maxStudents}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Max Supervisors
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.maxSupervisors}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Details */}
            <div className="space-y-6 m-5">
              <TextArea description="Primary contact information">
                Administrator Details
              </TextArea>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                    {universityData.adminDetails?.name}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                      {universityData.adminDetails?.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Phone
                    </label>
                    <div className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200">
                      {universityData.adminDetails?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-gray-700 rounded-xl shadow-lg overflow-hidden border border-gray-600">
          <div className="my-5 mx-3 flex justify-center items-center text-center">
            <TextDivider>University Members</TextDivider>
          </div>
          <div className="p-6">
            <UserCard />
          </div>
        </div>
      </div>
    </div>
  );
}
