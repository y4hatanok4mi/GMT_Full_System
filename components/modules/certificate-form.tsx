"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface CertificateProps {
  userName: string;
  moduleName: string;
  moduleId: string;
}

const CertificateForm: React.FC<CertificateProps> = ({ userName, moduleName, moduleId }) => {
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
        setCertificateNumber(`CERT-${data.certificateNumber.toString().padStart(5, "0")}`);
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
    <div className="flex flex-col justify-center">
      {/* Container */}
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Certificate of Completion</h1>

        {/* View Certificate Button (Disabled if module not completed) */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!isModuleCompleted || loading}
          className={`w-full py-3 rounded-lg font-bold transition ${
            isModuleCompleted
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Checking Completion..." : "View Certificate"}
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[1024px] h-[768px] relative flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-4 text-gray-700 text-xl font-bold"
              >
                ✕
              </button>

              {/* Certificate */}
              <div
                ref={certificateRef}
                className="relative w-full h-full flex flex-col items-center justify-center p-10 border-4 border-gray-700"
                style={{
                  backgroundImage: "url('/Polygons.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Certificate Number */}
                <div className="absolute top-3 right-3 text-gray-900 text-lg font-bold">
                  {certificateNumber}
                </div>

                <div className="flex flex-col gap-20 mt-16">
                  <h2 className="text-2xl font-semibold text-gray-900 mt-2">{userName}</h2>

                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 text-center">
                    {moduleName}
                  </h2>
                </div>

                <p className="mt-4 text-lg text-gray-900 text-center">
                  Awarded on {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Download Button */}
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
