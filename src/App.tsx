import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { MobileSimulator } from './components/MobileSimulator';
import { CodeBrowser } from './components/CodeBrowser';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ApiTester } from './components/ApiTester';
import { CODEBASE_FILES } from './data/codebaseData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'architecture' | 'android' | 'backend' | 'database'>('simulator');
  const [showApiConsole, setShowApiConsole] = useState(false);

  // Export all source files as a single consolidated archive package
  const handleExportAll = () => {
    let combined = `# 손금 분석 및 토스페이먼츠 연동 사주 풀이 전체 프로젝트 소스코드\n`;
    combined += `생성 일시: ${new Date().toISOString()}\n\n`;

    CODEBASE_FILES.forEach((file) => {
      combined += `\n================================================================================\n`;
      combined += `FILE: ${file.path}\n`;
      combined += `DESCRIPTION: ${file.description}\n`;
      combined += `================================================================================\n\n`;
      combined += file.content;
      combined += `\n\n`;
    });

    const blob = new Blob([combined], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palm_saju_full_project_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Universal Top Bar */}
      <TopBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExportAll={handleExportAll} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'simulator' && (
          <div className="space-y-12 pb-16">
            <MobileSimulator />
            
            {/* Quick Live API Tester Accordion */}
            <div className="max-w-7xl mx-auto px-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">백엔드 REST API 실시간 테스트</h3>
                  <p className="text-xs text-slate-400">손금 분석, 만세력 계산, 토스페이먼츠 승인 엔드포인트를 직접 디버깅할 수 있습니다.</p>
                </div>
                <button
                  onClick={() => setShowApiConsole(!showApiConsole)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  {showApiConsole ? '콘솔 닫기' : 'API 테스트 콘솔 열기'}
                </button>
              </div>

              {showApiConsole && (
                <div className="mt-4">
                  <ApiTester />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-12 pb-16">
            <ArchitectureDiagram />
            <ApiTester />
          </div>
        )}

        {activeTab === 'android' && (
          <CodeBrowser initialCategory="android" />
        )}

        {activeTab === 'backend' && (
          <CodeBrowser initialCategory="backend" />
        )}

        {activeTab === 'database' && (
          <CodeBrowser initialCategory="database" />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">손금 사주 (Palm & Saju) Architecture Suite</span>
            <span aria-hidden="true">·</span>
            <span>CameraX + FastAPI + Toss Payments</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>PCI-DSS & 전자금융거래법 준수 설계</span>
            <span aria-hidden="true">·</span>
            <span>Argon2id & AES-256-GCM 보안</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
