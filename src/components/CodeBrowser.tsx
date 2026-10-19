import React, { useState } from 'react';
import { CODEBASE_FILES, CodeFile } from '../data/codebaseData';
import { Copy, Check, Download, FileCode, Folder, Terminal, Database, Shield } from 'lucide-react';

interface CodeBrowserProps {
  initialCategory?: 'android' | 'backend' | 'database';
}

export const CodeBrowser: React.FC<CodeBrowserProps> = ({ initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'android' | 'backend' | 'database'>(
    initialCategory || 'all'
  );

  const filteredFiles = CODEBASE_FILES.filter(
    (file) => selectedCategory === 'all' || file.category === selectedCategory
  );

  const [activeFile, setActiveFile] = useState<CodeFile>(filteredFiles[0] || CODEBASE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = activeFile.path.split('/').pop() || 'code.txt';
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'android':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'backend':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <Folder className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>프로덕션 소스 코드 브라우저</span>
            <span className="text-xs font-normal text-slate-400">({filteredFiles.length}개 파일)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            안드로이드 Jetpack Compose/CameraX, FastAPI 컴퓨터 비전, PostgreSQL DDL 전체 소스코드입니다.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => { setSelectedCategory('all'); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => { setSelectedCategory('android'); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'android' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            안드로이드 (Kotlin)
          </button>
          <button
            onClick={() => { setSelectedCategory('backend'); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'backend' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            백엔드 (FastAPI)
          </button>
          <button
            onClick={() => { setSelectedCategory('database'); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'database' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            DB & 보안 (SQL)
          </button>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Explorer Tree */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-2 flex items-center justify-between">
            <span>프로젝트 구조</span>
            <span className="text-[10px] text-amber-400 font-normal">즉시 복사/다운로드 가능</span>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = activeFile.path === file.path;
              const fileName = file.path.split('/').pop();
              const dirName = file.path.substring(0, file.path.lastIndexOf('/'));

              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/10 border border-amber-400/40 text-amber-300'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getCategoryIcon(file.category)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate text-[13px]">{fileName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{dirName}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor & Viewer */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          
          {/* Top Bar for File */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 truncate font-semibold">{activeFile.path}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono uppercase">
                  {activeFile.language}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료' : '코드 복사'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>파일 저장</span>
              </button>
            </div>
          </div>

          {/* Code Content with Line Numbers */}
          <div className="p-4 bg-slate-950/70 overflow-x-auto max-h-[620px] font-mono text-[12px] leading-relaxed select-text">
            <pre className="text-slate-200">
              <code>
                {activeFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-800/30">
                    <span className="table-cell text-right pr-4 text-slate-600 select-none tabular-nums w-10">
                      {idx + 1}
                    </span>
                    <span className="table-cell whitespace-pre">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
