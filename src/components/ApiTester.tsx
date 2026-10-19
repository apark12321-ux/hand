import React, { useState } from 'react';
import { Play, Terminal, CheckCircle, Clock } from 'lucide-react';

export const ApiTester: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'palm' | 'saju' | 'order' | 'confirm'>('palm');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const endpointConfigs = {
    palm: {
      title: '손금 분석 (Computer Vision)',
      path: '/api/palm/analyze',
      method: 'POST',
      defaultPayload: {
        handType: 'right',
        sampleId: 0
      }
    },
    saju: {
      title: '정통 만세력 & AI 사주 풀이',
      path: '/api/saju/calculate',
      method: 'POST',
      defaultPayload: {
        name: '홍길동',
        gender: 'male',
        birthYear: 1993,
        birthMonth: 5,
        birthDay: 14,
        birthHour: 12,
        isLunar: false
      }
    },
    order: {
      title: '토스페이먼츠 주문 선등록',
      path: '/api/payment/create-order',
      method: 'POST',
      defaultPayload: {
        orderName: '프리미엄 정통 사주팔자 심층 풀이',
        amount: 9900
      }
    },
    confirm: {
      title: '토스페이먼츠 결제 승인 (Server-to-Server)',
      path: '/api/payment/confirm',
      method: 'POST',
      defaultPayload: {
        orderId: 'ORD_20261019_SAMPLE1',
        amount: 9900,
        paymentKey: 'pk_test_sample_123456789'
      }
    }
  };

  const current = endpointConfigs[selectedEndpoint];
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(current.defaultPayload, null, 2));

  const handleSelect = (key: 'palm' | 'saju' | 'order' | 'confirm') => {
    setSelectedEndpoint(key);
    setPayloadStr(JSON.stringify(endpointConfigs[key].defaultPayload, null, 2));
    setResponse(null);
    setLatency(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const parsedBody = JSON.parse(payloadStr);
      const res = await fetch(current.path, {
        method: current.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });
      const data = await res.json();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResponse({ status: res.status, data });
    } catch (err: any) {
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResponse({ status: 500, error: err.message || '요청 실패' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span>라이브 백엔드 API 테스트 콘솔</span>
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          FastAPI 백엔드 라우터와 Express 프록시 서버 엔드포인트를 브라우저에서 직접 호출해 보세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(endpointConfigs) as ('palm' | 'saju' | 'order' | 'confirm')[]).map((key) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              selectedEndpoint === key
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {endpointConfigs[key].title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                {current.method}
              </span>
              <span className="text-slate-300">{current.path}</span>
            </div>
            <button
              disabled={loading}
              onClick={handleExecute}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? '호출 중...' : '요청 전송'}</span>
            </button>
          </div>

          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            요청 페이로드 (JSON Body)
          </label>
          <textarea
            value={payloadStr}
            onChange={(e) => setPayloadStr(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
          />
        </div>

        {/* Response Panel */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              응답 결과 (Response)
            </span>
            {latency !== null && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{latency}ms</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  response?.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  HTTP {response?.status}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs overflow-auto max-h-[340px]">
            {response ? (
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(response.data || response.error, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                '요청 전송' 버튼을 클릭하면 실제 API 응답이 표시됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
