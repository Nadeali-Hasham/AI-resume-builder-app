'use client';

import AddResume from "./components/AddResume";

const Dashboard = () => {
  return (
    <>
    <div className="p-10 md:px-20 lg:px-32">
      <h1 className="text-2xl font-bold">My Resume</h1>
      <p className="mt-2">Start Creating Your Resume With AI for your next job application.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
        <AddResume />
      </div>
    </div>
    </>
  )
}

export default Dashboard