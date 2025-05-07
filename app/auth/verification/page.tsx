"use client";

import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FloatingShape from "@/components/floating-shapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Code = string[];

const EmailVerification = () => {
  const [code, setCode] = useState<Code>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null)
  );
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyEmail = async (verificationCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Verification failed");
      } else {
        toast.success(data.message);
        router.push("/auth/signin");
      }
    } catch {
      setError("Server error! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    await verifyEmail(verificationCode);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden px-4">
      {/* Background Floating Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingShape
          color="bg-yellow-500"
          size="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          position="top-[65%] left-[60%]"
          delay={1}
          shape="triangle"
          direction="reverse"
        />
        <FloatingShape
          color="bg-green-500"
          size="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64"
          position="top-[-30%] left-[5%]"
          delay={0}
          shape="circle"
          direction="normal"
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-40 h-24 sm:w-48 sm:h-32 md:w-64 md:h-48"
          position="top-[-40%] left-[50%]"
          delay={0}
          shape="rectangle"
          direction="reverse"
        />
        <FloatingShape
          color="bg-lime-500"
          size="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          position="top-[70%] left-[10%]"
          delay={0}
          shape="square"
          direction="normal"
        />
        <FloatingShape
          color="bg-pink-500"
          size="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          position="top-[40%] left-[40%]"
          delay={0}
          shape="circle"
          direction="reverse"
        />
      </div>

      {/* Card Wrapper */}
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Verify Your Email
          </CardTitle>
          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
            Enter the 6-digit code sent to your email
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(index, e)
                  }
                  className="w-12 h-12 text-center text-2xl font-bold border rounded-lg focus:border-green-500 focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={code.some((digit) => !digit) || isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                "Verify Email"
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
