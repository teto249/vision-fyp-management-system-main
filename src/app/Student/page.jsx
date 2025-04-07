import React from 'react';

const StudentDetailsModal = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  student.name
                </h3>
                <p className="mt-1 text-sm text-gray-500">student.email</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Course:</p>
                  <p className="text-sm text-gray-500">student.course</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Progress:</p>
                  <p className="text-sm text-gray-500">student.progress%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Attendance:</p>
                  <p className="text-sm text-gray-500">student.attendance%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Active:</p>
                  <p className="text-sm text-gray-500">student.lastActive</p>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:mt-0"
                  // onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white px-4 py-3 sm:px-6 sm:py-4">
            <h3 className="text-lg font-medium text-gray-900">Assignments</h3>
            <ul className="divide-y divide-gray-200">
              {/* {student.assignments.map((assignment) => (
                <li key={assignment.id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        assignment.title
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: assignment.dueDate
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Status:
                      </p>
                      <p className="text-sm text-gray-500">
                        assignment.status
                      </p>
                    </div>
                  </div>
                </li>
              ))} */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;