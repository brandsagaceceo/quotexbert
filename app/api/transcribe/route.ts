import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert audio to format for OpenAI Whisper
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    
    // Create form data for OpenAI
    const openaiFormData = new FormData();
    openaiFormData.append('file', audioBlob, 'audio.wav');
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', 'en');

    // Call OpenAI Whisper API
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiFormData
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('OpenAI Whisper error:', error);
      return NextResponse.json(
        { success: false, error: "Failed to transcribe audio" },
        { status: 500 }
      );
    }

    const transcription = await openaiResponse.json();
    
    return NextResponse.json({
      success: true,
      text: transcription.text
    });

  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
