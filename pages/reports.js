import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function Reports() {
  return (
    <div className="flex bg-gray-900 w-screen h-screen lg:flex-row">
      <Sidebar />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4 animate-pulse">
            Coming Soon
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            We're working hard to bring you this page. Stay tuned!
          </p>
          <div className="flex justify-center">
            <svg className="w-12 h-12 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}