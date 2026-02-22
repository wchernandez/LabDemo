"use client";

import { useRef, useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { ASSIGNMENT_ACCEPT, readFileAsText, extractTextFromPdf } from '@/lib/fileImport';

interface AssignmentWithImportProps {
  value: string;
  onChange: (value: string) => void;
}

export function AssignmentWithImport({ value, onChange }: AssignmentWithImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const processFile = async (file: File) => {
    setImporting(true);
    setImportError(null);
    try {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      let text: string;
      if (ext === '.txt') {
        text = await readFileAsText(file);
      } else if (ext === '.pdf') {
        text = await extractTextFromPdf(file);
      } else {
        setImportError('Please choose a .txt or .pdf file.');
        return;
      }
      onChange(text);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to load file.');
    } finally {
      setImporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Label htmlFor="assignment">Assignment Description (optional)</Label>
        <input
          ref={inputRef}
          type="file"
          accept={ASSIGNMENT_ACCEPT}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden
        />
        <Button
          type="button"
          size="sm"
          disabled={importing}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 gap-1.5"
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {importing ? 'Importing...' : 'Import .txt or .pdf'}
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
          id="assignment"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Write a function that calculates the factorial of a number"
          className={`min-h-[100px] ${isDragging ? 'opacity-50' : ''}`}
        />
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-md pointer-events-none z-20">
            <p className="text-primary font-medium">Drop .txt or .pdf file here</p>
          </div>
        )}
      </div>
      {importError && (
        <p className="text-sm text-destructive">{importError}</p>
      )}
    </div>
  );
}
