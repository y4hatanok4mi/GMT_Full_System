import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Function to split text into chunks (if it exceeds API limit)
function splitText(text: string, maxLength = 4000) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]; // Split into sentences
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      chunks.push(currentChunk);
      currentChunk = "";
    }
    currentChunk += sentence + " ";
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceType } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Google TTS API Key" }, { status: 500 });
    }

    const voiceSettings = {
      languageCode: "en-US", // Adjust language as needed
      ssmlGender: "FEMALE",  // Options: "MALE", "FEMALE", "NEUTRAL"
      name: voiceType || "en-US-Chirp-HD-F",
    };

    const textChunks = splitText(text); // Split text if it's too long
    let audioData = "";

    for (const chunk of textChunks) {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          input: { text: chunk },
          voice: voiceSettings,
          audioConfig: { audioEncoding: "MP3" },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.data || !response.data.audioContent) {
        throw new Error("No audio content received from Google TTS API.");
      }

      audioData += response.data.audioContent;
    }

    return new NextResponse(Buffer.from(audioData, "base64"), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error: any) {
    console.error("Google TTS Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "TTS request failed" }, { status: 500 });
  }
}
