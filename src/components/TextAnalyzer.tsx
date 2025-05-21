'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Trash2, Save } from "lucide-react";

interface TextStats {
  totalChars: number;
  charsNoSpace: number;
  words: number;
  sentences: number;
  lines: number;
}

export default function TextAnalyzer() {
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState<TextStats>({
    totalChars: 0,
    charsNoSpace: 0,
    words: 0,
    sentences: 0,
    lines: 0,
  });

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (text: string) => {
    const totalChars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const lines = text.trim() ? text.split('\n').length : 0;

    setStats({
      totalChars,
      charsNoSpace,
      words,
      sentences,
      lines,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Textarea
          placeholder="텍스트를 입력하세요..."
          className="min-h-[200px] p-4"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">기본 통계</TabsTrigger>
            <TabsTrigger value="detailed">상세 분석</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">전체 글자 수</p>
                <p className="text-2xl font-bold">{stats.totalChars}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">공백 제외 글자 수</p>
                <p className="text-2xl font-bold">{stats.charsNoSpace}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="detailed" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">단어 수</p>
                <p className="text-2xl font-bold">{stats.words}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">문장 수</p>
                <p className="text-2xl font-bold">{stats.sentences}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">줄 수</p>
                <p className="text-2xl font-bold">{stats.lines}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 