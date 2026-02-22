"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/CodeEditor';
import { AssignmentWithImport } from '@/components/AssignmentWithImport';
import { HintOutput, HintData } from '@/components/HintOutput';
import { Examples, Example } from '@/components/Examples';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sparkles, AlertCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [assignment, setAssignment] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('python');
  const [hints, setHints] = useState<HintData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !error.trim()) {
      setErrorMessage('Please fill in code and error message');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setHints(null);

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignment, code, error }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate hints');
      }

      setHints(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (example: Example) => {
    setAssignment(example.assignment);
    setCode(example.code);
    setError(example.error);
    setLanguage(example.language);
    setHints(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setAssignment('');
    setCode('');
    setError('');
    setLanguage('python');
    setHints(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">LabDemo</h1>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              AI Teaching Assistant for CS Labs
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            Get Ethical Hints for Your CS Assignments
          </h2>
          <p className="text-muted-foreground">
            Powered by Groq • Learn debugging, not copying
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Languages: Python, Java, JavaScript, TypeScript, C#, SQL, C, C++, Ruby, Go, Rust, PHP, Kotlin, Swift, R, Scala
          </p>
        </div>

        {/* Examples Section - hidden by default */}
        <div className="mb-8">
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowExamples((v) => !v)}
          >
            <BookOpen className="h-5 w-5" />
            <span>{showExamples ? 'Hide' : 'Show'} example problems</span>
            {showExamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {showExamples && (
            <div className="mt-4">
              <Examples onSelectExample={handleSelectExample} />
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>
                Add your code and the error message. Assignment description is optional.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assignment Description */}
              <AssignmentWithImport value={assignment} onChange={setAssignment} />

              {/* Code Editor */}
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                placeholder="Paste your code here or import a file..."
                label="Student Code"
                required
                onLanguageDetected={setLanguage}
                onErrorDetected={setError}
              />

              {/* Language Selector (auto-updates when a code file is imported) */}
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="csharp">C#</option>
                  <option value="sql">SQL</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                  <option value="plaintext">Plain text</option>
                </select>
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <Label htmlFor="error">
                  Error Message / Output <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="error"
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  placeholder="Paste the error message or unexpected output here..."
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>

              {/* Error Display */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Hints...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Hints
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Hints Output */}
        {(hints || loading) && (
          <div className="mt-6">
            <HintOutput hints={hints} loading={loading} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js 15, Tailwind CSS, and Groq
          </p>
          <p>
            © 2026 William Hernandez NZ
          </p>
        </div>
      </footer>
    </div>
  );
}
