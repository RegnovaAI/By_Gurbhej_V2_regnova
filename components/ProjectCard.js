'use client';

export default function ProjectCard({ name, createdDate, department, departmentDate, status }) {
  return (
    <div className="bg-gray-700 rounded-lg shadow-sm border border-gray-600 p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Created on {createdDate}</p>
          
          <div className="flex space-x-4 mt-4">
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View Audits
            </button>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Manage Team
            </button>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Upload Docs
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="mb-2">
            <p className="text-gray-700 dark:text-gray-300 font-medium">{department}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created on {departmentDate}</p>
          </div>
          
          <div className="flex items-center mt-2">
            <span 
              className={`text-sm font-medium ${
                status === 'Completed' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              {status}
            </span>
            <button className="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}