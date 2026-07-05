'use client';

import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "./../../Service/GlobalApi";
import { useEffect, useState } from "react";
import ResumeCardsItem from "./components/ResumeCardsItem";

const Dashboard = () => {
  const user = useUser();
  const [resumeList, setResumeList] = useState([]);

  const GetResumesList = () => {
    GlobalApi.getUserResumes(user?.primaryEmailAddress?.emailAddress)
      .then((response) => {
        setResumeList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user resumes:", error);
      });
  };

  useEffect(() => {
   user && GetResumesList();
  }, [user]);

  // useEffect(() => {
  //   if (user?.primaryEmailAddress?.emailAddress) {
  //     GetResumesList();
  //   }
  // }, [user?.primaryEmailAddress?.emailAddress]); 

  return (
    <>
    <div className="p-10 md:px-20 lg:px-32">
      <h1 className="text-2xl font-bold">My Resume</h1>
      <p className="mt-2">Start Creating Your Resume With AI for your next job application.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5 hover:scale-105 transition-all duration-200 hover:shadow-md shadow-primary">
        <AddResume />
        {resumeList.length > 0 && resumeList.map((resume, index) => (
          <ResumeCardsItem resume={resume} key={index} />
        ))}
      </div>
    </div>
    </>
  )
}

export default Dashboard