/**
 * File extension to Prism/syntax-highlighter language identifier.
 * Used to auto-detect language when importing code files.
 */
export const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  '.py': 'python',
  '.java': 'java',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.c': 'c',
  '.h': 'c',
  '.hpp': 'cpp',
  '.sql': 'sql',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.kt': 'kotlin',
  '.swift': 'swift',
  '.php': 'php',
  '.r': 'r',
  '.scala': 'scala',
};

export const SUPPORTED_CODE_EXTENSIONS = Object.keys(EXTENSION_TO_LANGUAGE);
/** For use in <input accept="..."> (e.g. ".py,.java,.cs") */
export const CODE_ACCEPT = SUPPORTED_CODE_EXTENSIONS.join(',');
export const ASSIGNMENT_ACCEPT = '.txt,.pdf';

/** Get Prism language from filename (e.g. "main.py" -> "python"). Returns "plaintext" if unknown. */
export function getLanguageFromFilename(filename: string): string {
  const ext = filename.includes('.') ? '.' + filename.split('.').pop()!.toLowerCase() : '';
  return EXTENSION_TO_LANGUAGE[ext] ?? 'plaintext';
}

/** Read a File as UTF-8 text. */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'UTF-8');
  });
}

/** Extract text from a PDF by uploading to our API. */
export async function extractTextFromPdf(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/extract-pdf', { method: 'POST', body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to extract PDF text');
  }
  const data = await res.json();
  return data.text ?? '';
}
