"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { FileCode, Loader2, Eye, EyeOff } from 'lucide-react';
import { CODE_ACCEPT, readFileAsText, getLanguageFromFilename } from '@/lib/fileImport';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  label?: string;
  /** Show red asterisk to indicate required. */
  required?: boolean;
  /** When a code file is imported, called with the detected language so parent can update the selector. */
  onLanguageDetected?: (language: string) => void;
  /** When an error is detected in imported code, called with the error message. */
  onErrorDetected?: (error: string) => void;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'python',
  placeholder = 'Enter your code here...',
  label = 'Code',
  required = false,
  onLanguageDetected,
  onErrorDetected
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [SyntaxHighlighter, setSyntaxHighlighter] = useState<any>(null);
  const [highlightStyle, setHighlightStyle] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Dynamically import to avoid SSR issues
    import('react-syntax-highlighter').then((mod) => {
      setSyntaxHighlighter(() => mod.Prism);
    });
    
    // Load styles based on theme
    const loadStyle = async () => {
      try {
        if (theme === 'dark') {
          const style = await import('react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus');
          setHighlightStyle(style.default);
        } else {
          const style = await import('react-syntax-highlighter/dist/cjs/styles/prism/vs');
          setHighlightStyle(style.default);
        }
      } catch (err) {
        console.error('Failed to load syntax highlighter style:', err);
      }
    };
    loadStyle();
  }, [theme]);

  const processFile = async (file: File) => {
    setImporting(true);
    setImportError(null);
    try {
      const text = await readFileAsText(file);
      onChange(text);
      const detected = getLanguageFromFilename(file.name);
      if (detected !== 'plaintext' && onLanguageDetected) {
        onLanguageDetected(detected);
      }
      
      // Auto-detect errors in imported code
      if (detected !== 'plaintext' && onErrorDetected) {
        try {
          const res = await fetch('/api/detect-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: text, language: detected }),
          });
          const data = await res.json();
          if (data.hasError && data.errorMessage) {
            onErrorDetected(data.errorMessage);
          }
        } catch (err) {
          // Silently fail error detection - don't block file import
          console.error('Error detection failed:', err);
        }
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to load file.');
    } finally {
      setImporting(false);
    }
  };

  const handleCodeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="code-editor">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept={CODE_ACCEPT}
          onChange={handleCodeFileChange}
          className="hidden"
          aria-hidden
        />
        <Button
          type="button"
          size="sm"
          disabled={importing}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 gap-1.5"
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileCode className="h-4 w-4" />
          )}
          {importing ? 'Importing...' : 'Import code file'}
        </Button>
      </div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative transition-colors ${isDragging ? 'bg-primary/10 border-2 border-primary border-dashed rounded-md' : ''}`}
      >
        <Textarea
          id="code-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`font-mono text-sm min-h-[200px] resize-y ${isDragging ? 'opacity-50' : ''}`}
          style={{ 
            tabSize: 2,
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'auto'
          }}
        />
        {value && (
          <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded z-10">
            {language}
          </div>
        )}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-md pointer-events-none z-20">
            <p className="text-primary font-medium">Drop code file here</p>
          </div>
        )}
      </div>
      {importError && <p className="text-sm text-destructive">{importError}</p>}
      {value && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-1.5"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
        </div>
      )}
      {value && showPreview && mounted && SyntaxHighlighter && highlightStyle && (
        <div className="rounded-md overflow-hidden border">
          <SyntaxHighlighter
            language={language.toLowerCase()}
            style={highlightStyle}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            showLineNumbers
          >
            {value}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
