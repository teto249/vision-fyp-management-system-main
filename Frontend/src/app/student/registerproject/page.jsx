"use client";
import { useRef } from "react";

export default function RegisterProject() {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate > endDate) {
      alert("Start date cannot be later than end date.");
      return;
    }

    console.log(data);
    alert("Project registered successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-10 text-white">
      <div className="flex justify-center items-center pb-20">
        <form
          ref={formRef}
          className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-[600px] space-y-6"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-bold text-center pt-4">
            Register Project
          </h1>
          <div className="divider border-gray-700 my-6 mx-auto w-1/2" />

          <div>
            <label className="block mb-2" htmlFor="projectType">
              Project Type
            </label>
            <select
              name="projectType"
              id="projectType"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Project Type</option>
              <option value="System Development">System Development</option>
              <option value="Research-Based">Research-Based</option>
            </select>
          </div>

          <div>
            <label className="block mb-2" htmlFor="projectTitle">
              Project Title
            </label>
            <input
              type="text"
              name="projectTitle"
              id="projectTitle"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="projectDescription">
              Project Description
            </label>
            <textarea
              name="projectDescription"
              id="projectDescription"
              rows="5"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" htmlFor="supervisor">
              Supervisor
            </label>
            <select
              name="supervisor"
              id="supervisor"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Supervisor</option>
              <option value="Supervisor A">Supervisor A</option>
              <option value="Supervisor B">Supervisor B</option>
              <option value="Supervisor C">Supervisor C</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-3xl transition"
          >
            Register Project
          </button>
        </form>
      </div>
    </div>
  );
}
