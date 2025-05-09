"use client";

import { useEffect, useState } from "react";
import SurveyModal from "./survey-modal";

export default function SurveyModalWrapper({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkPreferences = async () => {
      const res = await fetch("/api/user/preferences");
      const data = await res.json();
      
      if (!data?.primaryStyle) {
        setIsOpen(true);
      }
    };

    checkPreferences();
  }, []);

  return <SurveyModal isOpen={isOpen} onClose={() => setIsOpen(false)} userId={userId} />;
}
