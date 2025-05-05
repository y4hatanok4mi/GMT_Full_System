"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface CertificateProps {
  userName: string;
  moduleName: string;
  moduleId: string;
}

const CertificateForm: React.FC<CertificateProps> = ({
  userName,
  moduleName,
  moduleId,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState<string>("");
  const [isModuleCompleted, setIsModuleCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchModuleCompletion = async () => {
      try {
        const res = await fetch(`/api/modules/${moduleId}/completion`);
        const data = await res.json();
        setIsModuleCompleted(data.isCompleted);

        if (data.isCompleted) {
          await fetchCertificateNumber();
        }
      } catch (error) {
        console.error("Error fetching module completion:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCertificateNumber = async () => {
      try {
        const res = await fetch("/api/certificate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId }),
        });
        const data = await res.json();
        setCertificateNumber(
          `CERT-${data.certificateNumber.toString().padStart(5, "0")}`
        );
      } catch (error) {
        console.error("Error fetching certificate number:", error);
      }
    };

    fetchModuleCompletion();
  }, [moduleId]);

  const downloadPDF = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "px", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 632, 447);
      pdf.save(`Certificate-${certificateNumber}.pdf`);
    }
  };

  return (
    <div className="flex flex-col justify-center border dark:bg-slate-800 rounded-lg dark:border-slate-700 dark:text-white">
      <div className="container mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Certificate of Completion
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!isModuleCompleted || loading}
          className={`w-full py-3 rounded-lg font-bold transition ${
            isModuleCompleted
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Checking Completion</span>
            </div>
          ) : (
            "View Certificate"
          )}
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[850px] h-[700px] relative flex flex-col items-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-4 text-gray-700 dark:text-gray-300 text-xl font-bold"
              >
                ✕
              </button>

              <div
                ref={certificateRef}
                className="relative w-full h-full flex flex-col items-center justify-center p-6 border-4 border-gray-700 dark:border-gray-200"
                style={{
                  backgroundImage: "url('/Polygons.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute top-3 right-3 text-gray-900 dark:text-white text-lg font-bold">
                  {certificateNumber}
                </div>

                <div className="flex flex-col gap-20 absolute top-1/2 transform -translate-y-1/2 w-full justify-center items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8">
                    {userName}
                  </h2>

                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 text-center">
                    {moduleName}
                  </h2>
                </div>

                <p className="absolute bottom-14 text-lg text-gray-900 dark:text-white text-center w-full">
                  Awarded on {new Date().toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={downloadPDF}
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition w-full"
              >
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateForm;
