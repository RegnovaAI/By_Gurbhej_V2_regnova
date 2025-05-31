import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/utils/api_constants";
import React, { useEffect, useState } from "react";

export default function Documents() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Get token from localStorage (or your auth provider)
    const token = localStorage.getItem("rg-token");
    fetch(`${BASE_URL}/user/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data || []))
      .catch(() => setFiles([]));
  }, []);

  return (
    <div className="flex bg-gray-900 flex-col w-screen h-screen lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        <ul className="list-disc">
          {files.length === 0 && <li>No files found.</li>}
          {files.map((file, idx) => (
            <li key={file} className="mb-2 flex items-center">
              <span className="mr-4 font-bold">{idx + 1}.</span>
              <span className="mr-4">{file}</span>
              {/* <a
        href={`${BASE_URL}/uploads/${file}`}
        download
        className="text-blue-600 underline"
      >
        Download
      </a> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
