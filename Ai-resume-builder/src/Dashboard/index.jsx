'use client';

import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "./../../Service/GlobalApi";
import { useCallback, useEffect, useState } from "react";
import ResumeCardsItem from "./components/ResumeCardsItem";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [resumeList, setResumeList] = useState([]);

  const GetResumesList = useCallback(() => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) return;

    GlobalApi.getUserResumes(userEmail)
      .then((response) => {
        setResumeList(response?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching user resumes:", error);
      });
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      GetResumesList();
    }
  }, [isLoaded, user, GetResumesList]);

  // useEffect(() => {
  //   if (user?.primaryEmailAddress?.emailAddress) {
  //     GetResumesList();
  //   }
  // }, [user?.primaryEmailAddress?.emailAddress]); 

  return (
    <>
    <div className="p-10 md:px-20 lg:px-32">
      <h1 className="text-2xl font-bold">My Resume</h1>
      <p className="mt-2">Start Creating Your Resume With AI for your next job role.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
        <AddResume />
        {resumeList.length > 0 && resumeList.map((resume, index) => (
          <ResumeCardsItem resume={resume} key={resume.id || index} />
        ))}
      </div>
    </div>
    </>
  )
}

export default Dashboard
