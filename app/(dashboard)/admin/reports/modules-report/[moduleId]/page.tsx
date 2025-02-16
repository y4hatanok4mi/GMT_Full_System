"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

export type Student = {
  id: string;
  name: string;
  school: string;
  email: string;
  completed: boolean;
};


export type Module = {
  id: string;
  instructorId: string;
  name: string;
  description: string | null;
  isPublished: boolean;
  createdAt: Date;
};

export default function ModuleReportPage() {
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [students, setStudents] = useState<Student[]>([]);  // Ensure this is always an empty array initially
  const [loading, setLoading] = useState(true); // Add a loading state
  const { moduleId } = useParams();

  useEffect(() => {
    if (!moduleId) {
      console.log("No moduleId found in params");
      return;
    }

    const fetchModuleData = async () => {
      try {
        // Fetch the module data
        const moduleResponse = await axios.get(`/api/modules/${moduleId}`);
        setModuleData(moduleResponse.data.moduleData);

        // Fetch the students who joined the module
        const studentsResponse = await axios.get(`/api/modules/${moduleId}/get-students`);
        // Ensure that the response is an array with the 'completed' field
        setStudents(studentsResponse.data.students || []);

        setLoading(false); // Set loading to false once both data sets are fetched
      } catch (error) {
        console.error("Error fetching module data:", error);
        toast.error("Failed to load module report");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchModuleData();
  }, [moduleId]);


  if (loading) {
    console.log("Module data is still loading...");
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{moduleData?.name} Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* Render the module's data here */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Module: {moduleData?.name}</h1>

          {/* Display Student Progress */}
          <h2 className="text-xl font-semibold mt-6">Students Joined</h2>
          {students.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Student Name</th>
                  <th className="border border-gray-300 px-4 py-2">School</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th> {/* New column */}
                </tr>
              </thead>
              <tbody>
                {students.map(({ id, name, school, email, completed }) => (
                  <tr key={id} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">{name}</td>
                    <td className="border border-gray-300 px-4 py-2">{school}</td>
                    <td className="border border-gray-300 px-4 py-2">{email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {completed ? (
                        <span className="text-green-500 font-semibold">Completed</span>
                      ) : (
                        <span className="text-red-500 font-semibold text-center">Not Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2 text-gray-500">No students have joined this module yet.</p>
          )}

        </div>
      </SidebarInset>


    </div>
  );
}
