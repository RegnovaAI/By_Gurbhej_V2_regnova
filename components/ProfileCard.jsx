'use client';

export default function ProfileCard({ name, title, company, complianceScore, riskScore }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-600">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <img
            src="https://img.freepik.com/free-photo/brunette-business-woman-with-wavy-long-hair-blue-eyes-stands-holding-notebook-hands_197531-343.jpg?t=st=1746970739~exp=1746974339~hmac=8ce0b8bfa39fc86599074111c63d7fa74cc980a9f27740aab2110e85c4a5f90b&w=740"
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex-grow">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{company}</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm mr-4">Account type</span>
              <span className="font-medium">Pro</span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm mr-4">Compliance score</span>
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-progress-blue rounded-full flex items-center justify-center text-white text-xs mr-1">
                    <span>✓</span>
                  </div>
                  <span className="font-medium">{complianceScore}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm mr-4">Compliance score</span>
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-progress-teal rounded-full flex items-center justify-center text-white text-xs mr-1">
                    <span>✓</span>
                  </div>
                  <span className="font-medium">{riskScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}