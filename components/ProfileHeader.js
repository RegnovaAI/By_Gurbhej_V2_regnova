'use client';

export default function ProfileHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center pt-14 lg:pt-4">
      <h1 className="text-2xl font-bold">Dashh</h1>
      
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img 
            src="https://img.freepik.com/free-photo/brunette-business-woman-with-wavy-long-hair-blue-eyes-stands-holding-notebook-hands_197531-343.jpg?t=st=1746970739~exp=1746974339~hmac=8ce0b8bfa39fc86599074111c63d7fa74cc980a9f27740aab2110e85c4a5f90b&w=740" 
            alt="User" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}