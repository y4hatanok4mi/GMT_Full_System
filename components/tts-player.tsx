"use client";

import { useState } from "react";
import axios from "axios";

const TTSPlayer = () => {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSpeech = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/tts", { text }, { responseType: "blob" });
      const audioURL = URL.createObjectURL(response.data);
      setAudioSrc(audioURL);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full max-w-md rounded"
        placeholder="Enter text to convert to speech..."
      />
      <button
        onClick={generateSpeech}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Convert to Speech"}
      </button>
      {audioSrc && <audio controls src={audioSrc} className="mt-4" />}
    </div>
  );
};

export default TTSPlayer;
