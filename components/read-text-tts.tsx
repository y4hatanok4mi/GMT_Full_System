"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { Volume2, Loader2 } from "lucide-react";

interface ReadTextProps {
  value: string;
}

const ReadText = ({ value }: ReadTextProps) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extractPlainText = (html: string) => {
    const sanitizedHTML = DOMPurify.sanitize(html);
    const doc = new DOMParser().parseFromString(sanitizedHTML, "text/html");
    return doc.body.textContent || "";
  };

  const generateSpeech = async () => {
    const plainText = extractPlainText(value);
    if (!plainText) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/tts",
        { text: plainText },
        { responseType: "blob" }
      );
      const audioURL = URL.createObjectURL(response.data);
      setAudioSrc(audioURL);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 dark:bg-slate-900 dark:text-white p-4 rounded-md">
      <div
        className="w-full text-left whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
      />

      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={generateSpeech}
          disabled={loading}
          className="rounded-full dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        {audioSrc && <audio controls src={audioSrc} />}
      </div>
    </div>
  );
};

export default ReadText;
