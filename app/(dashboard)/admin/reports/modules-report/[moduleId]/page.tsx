"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { moduleId } = useParams();

  useEffect(() => {
    if (!moduleId) return;

    const fetchData = async () => {
      try {
        const moduleRes = await axios.get(`/api/modules/${moduleId}`);
        setModuleData(moduleRes.data.moduleData);

        const studentsRes = await axios.get(`/api/modules/${moduleId}/get-students`);
        setStudents(studentsRes.data.students || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load module report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  // Grouping students by school
  const studentsBySchool = students.reduce((acc: Record<string, number>, student) => {
    acc[student.school] = (acc[student.school] || 0) + 1;
    return acc;
  }, {});

  // Transform for chart
  const chartData = Object.entries(studentsBySchool).map(([school, count]) => ({
    school,
    count,
  }));

  if (loading) return <div>Loading...</div>;

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

        <div className="p-4">
          <h1 className="text-2xl font-bold">Module: {moduleData?.name}</h1>

          {/* Bar Chart Section */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Students per School</h2>
          {chartData.length > 0 ? (
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="school" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500">No data available for chart.</p>
          )}

          {/* Student Table */}
          <h2 className="text-xl font-semibold mt-6">Students Joined</h2>
          {students.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Student Name</th>
                  <th className="border border-gray-300 px-4 py-2">School</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(({ id, name, school, email, completed }) => (
                  <tr key={id}>
                    <td className="border border-gray-300 px-4 py-2">{name}</td>
                    <td className="border border-gray-300 px-4 py-2">{school}</td>
                    <td className="border border-gray-300 px-4 py-2">{email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {completed ? (
                        <span className="text-green-500 font-semibold">Completed</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Not Completed</span>
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
