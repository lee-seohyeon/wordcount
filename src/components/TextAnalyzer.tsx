'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Trash2, Save, Download, Clock, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TextStats {
  totalChars: number;
  charsNoSpace: number;
  words: number;
  sentences: number;
  lines: number;
}

interface SavedText {
  id: string;
  text: string;
  timestamp: number;
}

const AUTO_SAVE_KEY = 'wordcount-autosave';
const SAVED_TEXTS_KEY = 'wordcount-saved-texts';

export default function TextAnalyzer() {
  const [text, setText] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  const [stats, setStats] = useState<TextStats>({
    totalChars: 0,
    charsNoSpace: 0,
    words: 0,
    sentences: 0,
    lines: 0,
  });
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<SavedText | null>(null);
  const [isDeleteSavedTextsDialogOpen, setIsDeleteSavedTextsDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [textToDelete, setTextToDelete] = useState<SavedText | null>(null);

  // 초기 로드 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedText = localStorage.getItem(AUTO_SAVE_KEY);
    if (savedText) {
      setText(savedText);
    }

    const savedTextsList = localStorage.getItem(SAVED_TEXTS_KEY);
    if (savedTextsList) {
      setSavedTexts(JSON.parse(savedTextsList));
    }
  }, []);

  // 텍스트 변경 시 자동 저장
  useEffect(() => {
    localStorage.setItem(AUTO_SAVE_KEY, text);
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
      toast.success('클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast.error('복사하는 중 오류가 발생했습니다.');
    }
  };

  const handleClear = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmClear = () => {
    setText('');
    setIsDeleteDialogOpen(false);
    toast.success('텍스트가 삭제되었습니다.');
  };

  const handleSave = () => {
    if (!text.trim()) {
      toast.error('저장할 텍스트를 입력해주세요.');
      return;
    }

    const newSavedText: SavedText = {
      id: Date.now().toString(),
      text: text,
      timestamp: Date.now(),
    };

    const updatedTexts = [newSavedText, ...savedTexts].slice(0, 10); // 최대 10개까지만 저장
    setSavedTexts(updatedTexts);
    localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(updatedTexts));
    toast.success('텍스트가 저장되었습니다.');
  };

  const handleExport = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text-analysis.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('txt 파일로 저장되었어요');
    } catch (err) {
      console.error('Failed to save file:', err);
      toast.error('파일 저장 중 오류가 발생했습니다.');
    }
  };

  const handleLoadSavedText = (savedText: SavedText, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setSelectedText(savedText);
    setIsLoadDialogOpen(true);
  };

  const confirmLoad = () => {
    if (selectedText) {
      setText(selectedText.text);
      setIsLoadDialogOpen(false);
      toast.success('저장된 텍스트를 불러왔습니다.');
    }
  };

  const handleDeleteAllSavedTexts = () => {
    setIsDeleteSavedTextsDialogOpen(true);
  };

  const confirmDeleteAllSavedTexts = () => {
    setSavedTexts([]);
    localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify([]));
    setIsDeleteSavedTextsDialogOpen(false);
    toast.success('저장된 텍스트가 모두 삭제되었습니다.');
  };

  const handleDeleteSavedText = (savedText: SavedText, e: React.MouseEvent) => {
    e.stopPropagation();
    setTextToDelete(savedText);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSavedText = () => {
    if (textToDelete) {
      const updatedTexts = savedTexts.filter(text => text.id !== textToDelete.id);
      setSavedTexts(updatedTexts);
      localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(updatedTexts));
      setIsDeleteDialogOpen(false);
      setTextToDelete(null);
      toast.success('텍스트가 삭제되었습니다.');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
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
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-t border-border/40" />

      <div className="relative">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                저장된 텍스트: {savedTexts.length}개
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {savedTexts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAllSavedTexts}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  목록 비우기
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="space-y-2">
            {savedTexts.length > 0 ? (
              <Card className="p-4">
                <ScrollArea className="h-[300px] rounded-md">
                  <div className="space-y-4">
                    {savedTexts.map((savedText) => (
                      <div
                        key={savedText.id}
                        className="p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(savedText.timestamp)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={(e) => handleLoadSavedText(savedText, e)}
                              title="텍스트 복원"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => handleDeleteSavedText(savedText, e)}
                              title="텍스트 삭제"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm line-clamp-2">{savedText.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                저장된 텍스트가 없습니다.
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>텍스트 삭제</DialogTitle>
            <DialogDescription>
              {textToDelete ? '저장된 텍스트를 삭제하시겠습니까?' : '정말 모든 텍스트를 삭제하시겠습니까?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              setTextToDelete(null);
            }}>
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={textToDelete ? confirmDeleteSavedText : confirmClear}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>저장된 텍스트 불러오기</AlertDialogTitle>
            <AlertDialogDescription>
              현재 작성 중인 텍스트가 저장된 텍스트로 대체됩니다. 계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsLoadDialogOpen(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmLoad}>
              불러오기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteSavedTextsDialogOpen} onOpenChange={setIsDeleteSavedTextsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>저장된 텍스트 전체 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              저장된 모든 텍스트가 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteSavedTextsDialogOpen(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAllSavedTexts} className="bg-destructive hover:bg-destructive/90">
              전체 삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 