import { NextRequest, NextResponse } from 'next/server';
import { generateHintText } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const { assignment, code, error } = await req.json();
    
    if (!code?.trim() || !error?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: code and error' },
        { status: 400 }
      );
    }

    // Send code with explicit line numbers (1-based) so the model can reference exact lines
    const codeWithLineNumbers = code
      .split('\n')
      .map((line: string, i: number) => `${i + 1}| ${line}`)
      .join('\n');
    const assignmentContext = assignment?.trim()
      ? `- Assignment: "${assignment}"`
      : '- Assignment: (none provided)';

    const prompt = `You are LabDemo, an informative CS teaching assistant for first-year students.
Your role is to help students learn debugging skills, NOT to solve problems for them.

Input:
${assignmentContext}
- Student Code (with line numbers - use these EXACT numbers in your nudge):
\`\`\`
${codeWithLineNumbers}
\`\`\`
- Error Message: "${error}"

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no explanations before or after):
{
  "broke": "One sentence plain English explanation of what went wrong",
  "concept": "The CS concept name (e.g. 'array indexing', 'null pointer exception', 'syntax error')",
  "nudge": "1-2 debug steps or hints, NO CODE SOLUTIONS. You MUST cite the EXACT line number(s) from the code above (the number before the pipe, e.g. 'Line 5' or 'lines 7-8'). Only reference line numbers that actually exist in the code."
}

Guidelines:
- Tone: encouraging and supportive
- Focus: Teach debugging methodology, not solutions
- Never provide full code fixes
- Help them understand WHY it broke, not just WHAT broke
- Use simple language appropriate for first-year students
- CRITICAL: The "nudge" MUST use the EXACT line numbers from the code block above (the digit before the |). If the bug is on line 5, say "Line 5" or "line 5"; if it spans lines 10-12, say "lines 10-12". Do not guess or approximate—use only line numbers that appear in the provided code.
- Return ONLY the JSON object, nothing else`;

    const text = await generateHintText(prompt);
    
    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    const json = JSON.parse(cleanedText);
    
    return NextResponse.json(json);
  } catch (error: any) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate hints. Please check your API key and try again.' },
      { status: 500 }
    );
  }
}
