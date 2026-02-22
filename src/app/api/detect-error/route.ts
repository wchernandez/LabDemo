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

    const prompt = `Analyze this ${language} code for errors that would occur when RUNNING it.

Code:
\`\`\`${language}
${code}
\`\`\`

You MUST consider:
1. Syntax errors (invalid syntax).
2. Runtime errors (TypeError, IndexError, NameError, etc.).
3. LOGICAL errors that cause infinite recursion or stack overflow—e.g. wrong base case: using \`len == 0\` when the correct base case is \`len <= 1\` (so recursion never stops and you get RecursionError). Trace through the recursion/logic to see if the base case is ever reached.
4. Any other error the interpreter would produce when executing this code.

Respond with ONLY a JSON object (no markdown, no code blocks):
{
  "hasError": true or false,
  "errorMessage": "The EXACT error text as the interpreter would print to the terminal (full traceback for Python, etc.), or empty string if no errors",
  "errorType": "syntax" | "runtime" | "logical" | "none"
}

If the code has an error (including wrong base case leading to RecursionError), set hasError to true and put in errorMessage EXACTLY what the terminal would show (e.g. "RecursionError: maximum recursion depth exceeded" plus the traceback). Do NOT add explanations or hints—only the raw terminal output. If the code would run without error, set hasError to false and errorMessage to "".`;

    const text = await generateHintText(prompt);

    // Robustly extract JSON (model may wrap in markdown or add extra text)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/i, '').replace(/\n?```\s*$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\w*\n?/, '').replace(/\n?```\s*$/, '');
    }
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.slice(firstBrace, lastBrace + 1);
    }

    const json = JSON.parse(cleanedText);
    const hasError = Boolean(json.hasError ?? json.has_error ?? false);
    const errorMessage = typeof (json.errorMessage ?? json.error_message ?? '') === 'string'
      ? (json.errorMessage ?? json.error_message ?? '').trim()
      : '';

    return NextResponse.json({
      hasError,
      errorMessage: hasError ? errorMessage : '',
      errorType: json.errorType ?? json.error_type ?? 'none',
    });
  } catch (error: any) {
    console.error('Error detection API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to detect errors' },
      { status: 500 }
    );
  }
}
