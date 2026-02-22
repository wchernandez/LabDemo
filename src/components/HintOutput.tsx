"use client";

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface HintData {
  broke: string;
  concept: string;
  nudge: string;
}

interface HintOutputProps {
  hints: HintData | null;
  loading?: boolean;
}

export function HintOutput({ hints, loading }: HintOutputProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!hints) return;
    
    const text = `🔴 What broke: ${hints.broke}\n\n💡 Core concept: ${hints.concept}\n\n🧭 Debug nudge: ${hints.nudge}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Generating hints...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hints) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Hints</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">
                    What broke
                  </h4>
                  <p className="text-sm text-foreground">{hints.broke}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                    Core concept
                  </h4>
                  <p className="text-sm text-foreground">{hints.concept}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧭</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">
                    Debug nudge
                  </h4>
                  <p className="text-sm text-foreground">{hints.nudge}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
