import React, { useState } from 'react';
import { Layers, ShieldCheck, Cpu, Database, CreditCard, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('camerax');

  const subsystems: Record<string, {
    title: string;
    tech: string;
    summary: string;
    keyPoints: string[];
  }> = {
    camerax: {
      title: '안드로이드 프론트엔드 (CameraX & Compose)',
      tech: 'Kotlin · Jetpack Compose · CameraX 1.4 · Coroutines',
      summary: 'CameraX PreviewView와 Custom Canvas 타원 가이드라인을 결합하여, 사용자가 손바닥을 최적의 거리와 조명 상태에서 흔들림 없이 캡처하도록 돕습니다.',
      keyPoints: [
        'CameraSelector.DEFAULT_BACK_CAMERA 기반 고화질 4:3 뷰파인더 유지',
        '점선 타원 마스크(PathEffect.dashPathEffect)로 ROI 실시간 피드백',
        'CaptureMode.MAXIMIZE_QUALITY로 손금 세부 융선까지 고화질 캡처',
        'Jetpack Compose 단일 액티비티 아키텍처 및 선언형 상태 흐름 관리'
      ]
    },
    cv: {
      title: '컴퓨터 비전 손금 라인 감지 파이프라인',
      tech: 'Python 3.11 · MediaPipe Hands · OpenCV 4.10 · NumPy',
      summary: 'MediaPipe 21개 랜드마크로 손바닥의 원근 왜곡을 회전 보정(Affine Transform)한 뒤, CLAHE 적응형 평활화 및 Frangi/Ridge 필터로 3대 주선(생명선·두뇌선·감정선)을 추출합니다.',
      keyPoints: [
        '손목(0번)과 중지 기저부(9번) 랜드마크 벡터로 정규화 각도 도출',
        'CLAHE(Contrast Limited Adaptive Histogram Equalization)로 피부 반사광 극복',
        'Bilateral Filter를 적용해 모공 노이즈는 제거하고 손금 엣지만 보존',
        'Black Hat 모폴로지 연산으로 피부 면 대비 어두운 주름선만 세그멘테이션'
      ]
    },
    saju: {
      title: '사주명리학 만세력 & AI 심층 해석 엔진',
      tech: 'Python 천문 절기 계산 · Gemini 3.8 Flash (@google/genai)',
      summary: '양력/음력 생년월일시 기준 율리우스일과 24절기 입절 시각을 수리 계산하여 4주 8글자 및 오행 비율을 추출하고, Gemini 3.8 Flash 모델이 현대적 감각의 심층 컨설팅을 작성합니다.',
      keyPoints: [
        '천간(10간)과 지지(12지) 60갑자 순환 알고리즘 완전 구현',
        '목·화·토·금·수 오행의 상생상극 및 편중도(백분율) 정량 산출',
        '일간(Day Master) 중심의 기질, 용신/희신 기반 운세 가이던스',
        'Gemini 3.8 Flash 구조화 JSON 스키마를 통해 안정적 리포트 생성'
      ]
    },
    toss: {
      title: '토스페이먼츠 연동 및 결제 무결성 보장',
      tech: 'Toss Payments REST API · Server-to-Server Confirm · Idempotency',
      summary: '클라이언트의 악의적인 파라미터 변조를 원천 차단하기 위해, 백엔드 DB 사전 주문 등록(PENDING)과 토스 서버 승인 검증을 거쳐야만 유료 사주가 발급됩니다.',
      keyPoints: [
        '결제창 호출 전 서버 DB에 고유 order_id와 9,900원 금액 선등록',
        '승인 완료 콜백 시 시크릿 키 기반 Basic Auth로 토스페이먼츠 공식 확인',
        'DB 등록 금액과 토스 승인 금액 1원이라도 불일치 시 트랜잭션 자동 롤백',
        '결제 영수증 URL 및 결제키(payment_key) AES-256 암호화 보관'
      ]
    },
    security: {
      title: '데이터베이스 및 개인정보 보안 체계',
      tech: 'PostgreSQL · Argon2id · AES-256-GCM · TLS 1.3',
      summary: '사용자 비밀번호는 최신 메모리 하드닝 해시인 Argon2id로 단방향 암호화하고, 생년월일시 및 결제 식별자는 AES-256-GCM으로 양방향 암호화하여 DB 침해 사고에도 대비합니다.',
      keyPoints: [
        'Argon2id (time_cost=3, memory_cost=64MB, parallelism=4) 비밀번호 해싱',
        'AES-256-GCM 대칭키 및 12바이트 랜덤 Nonce 기반 민감정보 암호화',
        '모든 SQL 쿼리 파라미터 바인딩으로 SQL Injection 원천 차단',
        'UUIDv4 기본키 사용으로 ID 추측 공격 및 크롤링 방지'
      ]
    }
  };

  const current = subsystems[selectedSubsystem] || subsystems['camerax'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>전체 엔드투엔드 시스템 아키텍처</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          손금 컴퓨터 비전 & 토스 결제 사주 시스템 구조도
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          모바일 클라이언트(CameraX)부터 파이썬 CV 파이프라인, 토스페이먼츠 결제 검증, PostgreSQL 보안 스키마까지 한눈에 확인하세요.
        </p>
      </div>

      {/* Visual Architectural Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {[
          { id: 'camerax', name: '1. CameraX 클라이언트', sub: 'Android Compose', icon: Cpu, color: 'border-emerald-500/40 text-emerald-400' },
          { id: 'cv', name: '2. 컴퓨터 비전 엔진', sub: 'MediaPipe & OpenCV', icon: Sparkles, color: 'border-blue-500/40 text-blue-400' },
          { id: 'toss', name: '3. 토스페이먼츠 결제', sub: 'Server-to-Server', icon: CreditCard, color: 'border-sky-500/40 text-sky-400' },
          { id: 'saju', name: '4. 만세력 & AI 사주', sub: '절기 수리 + Gemini', icon: Layers, color: 'border-amber-500/40 text-amber-400' },
          { id: 'security', name: '5. DB & 보안 암호화', sub: 'PostgreSQL & Argon2', icon: ShieldCheck, color: 'border-indigo-500/40 text-indigo-400' },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = selectedSubsystem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedSubsystem(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-400/10 scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${item.color}`} />
              <div className="text-xs font-bold text-white">{item.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Subsystem Detail Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase">{current.tech}</span>
            <h3 className="text-xl font-bold text-white mt-1">{current.title}</h3>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            엔터프라이즈 프로덕션 권장 사양
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">아키텍처 설계 개요</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{current.summary}</p>
          </div>

          <div className="md:col-span-7 bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">핵심 엔지니어링 구현 원칙</h4>
            <ul className="space-y-2.5">
              {current.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
