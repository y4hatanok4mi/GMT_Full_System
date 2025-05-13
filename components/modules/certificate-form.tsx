// Responsive CertificateForm.tsx
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
  const [certificateNumber, setCertificateNumber] = useState<string>("");
  const [isModuleCompleted, setIsModuleCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderForDownload, setRenderForDownload] = useState<boolean>(false);

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

  useEffect(() => {
    if (renderForDownload) {
      setTimeout(() => {
        generatePDF();
      }, 100);
    }
  }, [renderForDownload]);

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "px", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 632, 447);
    pdf.save(`Certificate-${certificateNumber}.pdf`);
    setRenderForDownload(false);
  };

  const handleDownload = () => {
    setRenderForDownload(true);
  };

  return (
    <div className="flex flex-col justify-center border dark:bg-slate-800 rounded-lg dark:border-slate-700 dark:text-white">
      <div className="container mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Certificate of Completion
        </h1>

        <button
          onClick={handleDownload}
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
            "Download Certificate"
          )}
        </button>
      </div>

      {/* Hidden but visible for DOM to capture */}
      {renderForDownload && (
        <div
          style={{
            position: "absolute",
            top: "-10000px",
            left: "-10000px",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <div
            ref={certificateRef}
            className="w-[842px] h-[595px] p-6 border-4 border-gray-700 dark:border-gray-200 flex flex-col justify-center items-center relative"
            style={{
              backgroundImage: "url('/Polygons.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute top-3 right-3 text-gray-900 dark:text-white text-base font-bold">
              {certificateNumber}
            </div>

            <div className="flex flex-col gap-10 sm:gap-20 absolute top-1/2 transform -translate-y-1/2 w-full px-4 justify-center items-center text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {userName}
              </h2>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {moduleName}
              </h2>
            </div>

            <p className="absolute bottom-10 pb-8 text-sm sm:text-base text-gray-900 dark:text-white text-center w-full">
              Awarded on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateForm;