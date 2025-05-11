// import Layout from '@/components/Layout';
// import React from 'react';

// export default function Profile() {
//   return (
//     <Layout>
//       <div>
//         <h1>Profile Page</h1>
//         <p>Welcome to your profile!</p>
//       </div>
//     </Layout>
//   );
// }

'use client';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import ProjectCard from '../components/ProjectCard';
import ProfileHeader from '../components/ProfileHeader';

export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: 'Project Alpha',
      createdDate: 'June 15, 2023',
      department: 'Finance',
      departmentDate: 'April 15, 2023',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Project Beta',
      createdDate: 'Apr 3, 2023',
      department: 'Marketing',
      departmentDate: 'Apr 3, 2023',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'Project Gamma',
      createdDate: 'Dec 8, 2022',
      department: 'IT',
      departmentDate: 'Dec 8, 2022',
      status: 'In Progress'
    },
    {
      id: 4,
      name: 'Project Delta',
      createdDate: 'Dec 1, 2022',
      department: 'Operations',
      departmentDate: 'Dec 1, 2022',
      status: 'In Progress'
    }
  ];

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <ProfileHeader />
          
          <div className="mt-8">
            <ProfileCard 
              name="Jane Doe"
              title="Compliance Manager"
              company="Acme Corporation"
              complianceScore={85}
              riskScore={75}
            />
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Dashh</h2>
            
            <div className="space-y-4">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  createdDate={project.createdDate}
                  department={project.department}
                  departmentDate={project.departmentDate}
                  status={project.status}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}