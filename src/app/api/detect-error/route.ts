import { NextRequest, NextResponse } from 'next/server';
import { generateHintText } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();
    
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: code or language' },
        { status: 400 }
      );
    }

    const prompt = `Analyze this ${language} code and detect any syntax errors or runtime errors.

Code:
\`\`\`${language}
${code}
\`\`\`

Respond with ONLY a JSON object (no markdown, no code blocks):
{
  "hasError": true or false,
  "errorMessage": "The exact error text as it would appear in the terminal when running this code, or empty string if no errors",
  "errorType": "syntax" | "runtime" | "logical" | "none"
}

If the code has errors, provide ONLY what the compiler or interpreter would print to the terminal (e.g. traceback, line numbers, exception type and message). Do NOT provide explanations, hints, or solutions—just the raw terminal output. If no errors are detected, set hasError to false and errorMessage to empty string.`;

    const text = await generateHintText(prompt);
    
    // Clean up the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    const json = JSON.parse(cleanedText);
    
    return NextResponse.json(json);
  } catch (error: any) {
    console.error('Error detection API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to detect errors' },
      { status: 500 }
    );
  }
}
