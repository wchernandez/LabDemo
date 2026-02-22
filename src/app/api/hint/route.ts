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

    // Count lines in code for reference
    const codeLines = code.split('\n').length;
    const assignmentContext = assignment?.trim()
      ? `- Assignment: "${assignment}"`
      : '- Assignment: (none provided)';

    const prompt = `You are AutoTA, an ethical CS teaching assistant for first-year students.
Your role is to help students learn debugging skills, NOT to solve problems for them.

Input:
${assignmentContext}
- Student Code (${codeLines} lines): "${code}"
- Error Message: "${error}"

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no explanations before or after):
{
  "broke": "One sentence plain English explanation of what went wrong",
  "concept": "The CS concept name (e.g. 'array indexing', 'null pointer exception', 'syntax error')",
  "nudge": "1-2 debug steps or hints, NO CODE SOLUTIONS. MUST specify the exact line number(s) that need fixing (e.g. 'Check line 5' or 'Look at lines 10-12'). Guide them to discover the fix themselves."
}

Guidelines:
- Tone: encouraging and supportive
- Focus: Teach debugging methodology, not solutions
- Never provide full code fixes
- Help them understand WHY it broke, not just WHAT broke
- Use simple language appropriate for first-year students
- CRITICAL: The "nudge" field MUST include specific line number(s) where the issue occurs (e.g. "Check line 5 where you're accessing the array" or "Look at lines 10-12 where you're comparing values")
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
