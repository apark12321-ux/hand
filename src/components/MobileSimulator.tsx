import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  User, 
  Clock, 
  Lock, 
  Layers, 
  X,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface DetectedLine {
  id: string;
  name: string;
  color: string;
  score: number;
  curvature: string;
  length: string;
  interpretation: string;
  points: { x: number; y: number }[];
}

export const MobileSimulator: React.FC = () => {
  // Mobile Navigation Step
  // 1: Scan -> 2: Palm Result -> 3: Saju Input -> 4: Toss Checkout -> 5: Saju Report
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Camera & Palm State
  const [useWebcam, setUseWebcam] = useState(false);
  const [selectedSample, setSelectedSample] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [palmData, setPalmData] = useState<{
    scores: { vitality: number; intellect: number; affection: number; destiny: number; overall: number };
    lines: DetectedLine[];
    summary: string;
  } | null>(null);

  const [activeLineFilters, setActiveLineFilters] = useState<Record<string, boolean>>({
    life: true,
    head: true,
    heart: true,
    fate: true
  });

  // Saju Input State
  const [userName, setUserName] = useState('김지우');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isLunar, setIsLunar] = useState(false);
  const [birthYear, setBirthYear] = useState('1995');
  const [birthMonth, setBirthMonth] = useState('8');
  const [birthDay, setBirthDay] = useState('18');
  const [birthHour, setBirthHour] = useState('14');

  // Payment State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'card' | 'tosspay' | 'kakaopay'>('card');
  const [selectedCard, setSelectedCard] = useState('신한카드 (9412-****)');
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);

  // Saju Report State
  const [isLoadingSaju, setIsLoadingSaju] = useState(false);
  const [sajuData, setSajuData] = useState<any>(null);

  // Video ref for webcam
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sample Palm Images (curated SVG vector representations of hands)
  const samplePalms = [
    {
      id: 0,
      title: '균형 잡힌 손바닥',
      tone: '#E0AC69',
      imageDesc: '생명선과 두뇌선이 뚜렷한 표본'
    },
    {
      id: 1,
      title: '감정선 발달 손바닥',
      tone: '#D08B5B',
      imageDesc: '감정선이 위로 길게 상승한 표본'
    },
    {
      id: 2,
      title: '운명선 뚜렷한 손바닥',
      tone: '#F1C27D',
      imageDesc: '손바닥 중앙 수직 운명선이 강한 표본'
    }
  ];

  // Start/Stop Webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useWebcam && step === 1) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 640 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted or available:', err);
          setUseWebcam(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam, step]);

  // Trigger Palm Analysis
  const handleCaptureAndAnalyze = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/palm/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handType: 'right',
          sampleId: selectedSample,
        }),
      });
      const data = await response.json();
      setTimeout(() => {
        setPalmData(data);
        setIsScanning(false);
        setStep(2);
      }, 1400);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  // Open Toss Checkout
  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  // Process Toss Payments Checkout
  const handleConfirmPayment = async () => {
    setIsPaying(true);
    try {
      // 1. Create Order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderName: '프리미엄 정통 사주팔자 심층 풀이',
          amount: 9900,
          sajuParams: { userName, gender, birthYear, birthMonth, birthDay, birthHour, isLunar }
        }),
      });
      const order = await orderRes.json();

      // 2. Server-to-Server Confirm
      const confirmRes = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          amount: 9900,
          paymentKey: `pk_test_${Date.now()}`
        }),
      });
      const confirmData = await confirmRes.json();
      setPaymentSuccessData(confirmData);

      // 3. Fetch Full Saju Report
      setIsLoadingSaju(true);
      const sajuRes = await fetch('/api/saju/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          gender,
          birthYear,
          birthMonth,
          birthDay,
          birthHour,
          isLunar
        })
      });
      const sajuResult = await sajuRes.json();
      setSajuData(sajuResult);

      setTimeout(() => {
        setIsPaying(false);
        setIsLoadingSaju(false);
        setIsCheckoutOpen(false);
        setStep(5);
      }, 1000);

    } catch (err) {
      console.error(err);
      setIsPaying(false);
      setIsLoadingSaju(false);
    }
  };

  const toggleLineFilter = (id: string) => {
    setActiveLineFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Simulation Info Header */}
      <div className="text-center max-w-xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>안드로이드 Jetpack Compose + CameraX 모바일 인터랙션 시뮬레이터</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">손금 촬영부터 토스페이먼츠 사주 풀이까지</h2>
        <p className="text-sm text-slate-400 mt-1">
          스마트폰 화면 내부에서 실제 카메라 뷰파인더 가이드라인, 손금 라인 감지, 결제 위젯을 직접 조작해 보세요.
        </p>
      </div>

      {/* Smartphone Outer Hardware Bezel */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[48px] p-3 shadow-2xl shadow-indigo-950/40 border-[6px] border-slate-700/80 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
        </div>

        {/* Screen Glass Container */}
        <div className="relative flex-1 bg-slate-950 rounded-[38px] overflow-hidden flex flex-col text-slate-100">
          
          {/* Status Bar */}
          <div className="h-9 px-6 pt-2 flex items-center justify-between text-[11px] font-medium text-slate-400 select-none z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">

            {/* ============================================================== */}
            {/* STEP 1: CAMERAX PALM SCANNER VIEW                              */}
            {/* ============================================================== */}
            {step === 1 && (
              <div className="flex-1 flex flex-col relative bg-slate-950">
                {/* Viewfinder area */}
                <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
                  
                  {/* Webcam or Sample Rendering */}
                  {useWebcam ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900">
                      {/* Stylized Hand SVG Illustration */}
                      <svg viewBox="0 0 300 400" className="w-64 h-80 opacity-90 drop-shadow-xl">
                        <defs>
                          <linearGradient id="palmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={samplePalms[selectedSample].tone} />
                            <stop offset="100%" stopColor="#8C532B" />
                          </linearGradient>
                        </defs>
                        {/* Palm contour silhouette */}
                        <path 
                          d="M100,340 C80,300 50,220 50,170 C50,140 70,140 75,170 C75,110 95,100 100,160 C105,80 125,70 130,150 C135,90 155,90 155,160 C165,130 185,140 185,180 C185,240 215,220 220,250 C225,290 190,340 150,350 Z" 
                          fill="url(#palmGrad)"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                        />
                        {/* Subtle Palm Creases */}
                        <path d="M95,230 Q120,260 145,290" stroke="rgba(0,0,0,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M95,225 Q135,240 175,250" stroke="rgba(0,0,0,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M185,210 Q145,215 115,200" stroke="rgba(0,0,0,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  {/* CameraX Oval Guide Mask */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-64 h-80 rounded-[50%] border-2 border-dashed border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center">
                      <div className="w-6 h-6 border-t-2 border-l-2 border-amber-400 absolute top-4 left-4" />
                      <div className="w-6 h-6 border-t-2 border-r-2 border-amber-400 absolute top-4 right-4" />
                      <div className="w-6 h-6 border-b-2 border-l-2 border-amber-400 absolute bottom-4 left-4" />
                      <div className="w-6 h-6 border-b-2 border-r-2 border-amber-400 absolute bottom-4 right-4" />
                      
                      {/* Center Crosshair */}
                      <div className="w-8 h-[1px] bg-amber-400/40 absolute" />
                      <div className="h-8 w-[1px] bg-amber-400/40 absolute" />
                    </div>
                  </div>

                  {/* Scanning Laser Beam */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#FBBF24] animate-scanline z-10" />
                  )}

                  {/* Top Notification Badge */}
                  <div className="absolute top-3 inset-x-4 flex justify-between items-center z-10">
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-medium text-amber-300 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isScanning ? '컴퓨터 비전 라인 분석 중...' : '손바닥 위치 양호'}</span>
                    </div>

                    <button 
                      onClick={() => setUseWebcam(!useWebcam)}
                      className="px-2.5 py-1 rounded-full bg-slate-900/80 text-[11px] text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{useWebcam ? '샘플 모드' : '웹캠 사용'}</span>
                    </button>
                  </div>

                  {/* Sample Palm Picker (if not webcam) */}
                  {!useWebcam && (
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 z-10">
                      {samplePalms.map((sample) => (
                        <button
                          key={sample.id}
                          onClick={() => setSelectedSample(sample.id)}
                          className={`px-2.5 py-1 text-[10px] rounded-lg border transition-all cursor-pointer ${
                            selectedSample === sample.id
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-semibold'
                              : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {sample.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Controls Bar */}
                <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col items-center">
                  <p className="text-[12px] text-slate-400 mb-3 text-center">
                    타원 안에 손바닥을 펼쳐 대고 셔터를 눌러주세요
                  </p>
                  
                  {/* Shutter Button */}
                  <button
                    disabled={isScanning}
                    onClick={handleCaptureAndAnalyze}
                    className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-amber-400/20 border-4 border-slate-950 cursor-pointer disabled:opacity-50"
                  >
                    {isScanning ? (
                      <RefreshCw className="w-6 h-6 text-slate-950 animate-spin" />
                    ) : (
                      <Camera className="w-7 h-7 text-slate-950" />
                    )}
                  </button>

                  <span className="text-[11px] text-slate-500 mt-2 font-medium">무료 컴퓨터 비전 즉시 분석</span>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: PALM RESULT SCREEN (FREE)                              */}
            {/* ============================================================== */}
            {step === 2 && palmData && (
              <div className="flex-1 flex flex-col p-4 bg-slate-950 space-y-4">
                
                {/* Result Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>손금 라인 감지 완료</span>
                  </div>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>재촬영</span>
                  </button>
                </div>

                {/* Palm Visualization with SVG Overlays */}
                <div className="relative w-full h-52 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  {/* Hand Silhouette */}
                  <svg viewBox="0 0 300 350" className="w-48 h-48 opacity-75">
                    <path 
                      d="M100,340 C80,300 50,220 50,170 C50,140 70,140 75,170 C75,110 95,100 100,160 C105,80 125,70 130,150 C135,90 155,90 155,160 C165,130 185,140 185,180 C185,240 215,220 220,250 C225,290 190,340 150,350 Z" 
                      fill="#D08B5B"
                    />
                  </svg>

                  {/* Dynamic Computer Vision SVG Lines */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* 생명선 (녹색) */}
                    {activeLineFilters.life && (
                      <path 
                        d="M 38,38 Q 33,62 44,88" 
                        stroke="#10B981" 
                        strokeWidth="2.5" 
                        fill="none" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_#10B981]"
                      />
                    )}
                    {/* 두뇌선 (파란색) */}
                    {activeLineFilters.head && (
                      <path 
                        d="M 38,39 Q 55,52 74,60" 
                        stroke="#3B82F6" 
                        strokeWidth="2.5" 
                        fill="none" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_#3B82F6]"
                      />
                    )}
                    {/* 감정선 (붉은색) */}
                    {activeLineFilters.heart && (
                      <path 
                        d="M 80,42 Q 58,36 40,33" 
                        stroke="#EF4444" 
                        strokeWidth="2.5" 
                        fill="none" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_#EF4444]"
                      />
                    )}
                    {/* 운명선 (황금색) */}
                    {activeLineFilters.fate && (
                      <path 
                        d="M 50,85 Q 49,58 48,34" 
                        stroke="#F59E0B" 
                        strokeWidth="2" 
                        strokeDasharray="3 2"
                        fill="none" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_#F59E0B]"
                      />
                    )}
                  </svg>

                  {/* Line Overlay Toggle Pill Controls */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-center gap-1.5 bg-slate-950/70 backdrop-blur-md p-1 rounded-xl">
                    <button 
                      onClick={() => toggleLineFilter('life')}
                      className={`px-2 py-0.5 text-[10px] rounded-md font-medium cursor-pointer flex items-center gap-1 ${
                        activeLineFilters.life ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>생명선</span>
                    </button>
                    <button 
                      onClick={() => toggleLineFilter('head')}
                      className={`px-2 py-0.5 text-[10px] rounded-md font-medium cursor-pointer flex items-center gap-1 ${
                        activeLineFilters.head ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>두뇌선</span>
                    </button>
                    <button 
                      onClick={() => toggleLineFilter('heart')}
                      className={`px-2 py-0.5 text-[10px] rounded-md font-medium cursor-pointer flex items-center gap-1 ${
                        activeLineFilters.heart ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>감정선</span>
                    </button>
                    <button 
                      onClick={() => toggleLineFilter('fate')}
                      className={`px-2 py-0.5 text-[10px] rounded-md font-medium cursor-pointer flex items-center gap-1 ${
                        activeLineFilters.fate ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>운명선</span>
                    </button>
                  </div>
                </div>

                {/* Line Breakdown Cards */}
                <div className="space-y-2">
                  {palmData.lines.map((line) => (
                    <div 
                      key={line.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: line.color }}>{line.name}</span>
                        <span className="text-xs font-semibold text-slate-300 tabular-nums">{line.score}점</span>
                      </div>
                      <p className="text-[11px] text-amber-300/90 mt-0.5 font-medium">{line.curvature}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{line.interpretation}</p>
                    </div>
                  ))}
                </div>

                {/* Saju Unlock Banner Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-700/50 shadow-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">사주팔자 + 손금 종합 풀이</span>
                  </div>
                  <p className="text-[12px] text-slate-300 leading-snug">
                    손금에 나타난 타고난 그릇과 사주 명리학의 10년 대운 흐름을 결합하여 명확한 인생 해답을 얻으세요.
                  </p>
                  
                  <button
                    onClick={() => setStep(3)}
                    className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <span>상세 사주 풀이 신청 (9,900원)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: SAJU INPUT FORM                                        */}
            {/* ============================================================== */}
            {step === 3 && (
              <div className="flex-1 flex flex-col p-4 bg-slate-950 space-y-4">
                
                {/* Header */}
                <div>
                  <button 
                    onClick={() => setStep(2)}
                    className="text-xs text-slate-400 hover:text-white mb-2 flex items-center gap-1 cursor-pointer"
                  >
                    ← 손금 결과로 돌아가기
                  </button>
                  <h3 className="text-base font-bold text-white">사주 명리학 분석 정보 입력</h3>
                  <p className="text-[12px] text-slate-400">정확한 천간/지지 만세력 도출을 위해 생년월일시를 입력하세요.</p>
                </div>

                {/* Form Elements */}
                <div className="space-y-3 text-left">
                  {/* Name */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">성함</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="이름 입력"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <User className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  {/* Gender & Calendar Type */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1">성별</label>
                      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setGender('male')}
                          className={`flex-1 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                            gender === 'male' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          남성
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('female')}
                          className={`flex-1 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                            gender === 'female' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          여성
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1">양력 / 음력</label>
                      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setIsLunar(false)}
                          className={`flex-1 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                            !isLunar ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          양력
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLunar(true)}
                          className={`flex-1 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                            isLunar ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          음력
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Birth Year / Month / Day */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">생년월일</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {Array.from({ length: 60 }, (_, i) => 2010 - i).map((y) => (
                          <option key={y} value={y}>{y}년</option>
                        ))}
                      </select>

                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m}>{m}월</option>
                        ))}
                      </select>

                      <select
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>{d}일</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Birth Hour */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">태어난 시간 (시주)</label>
                    <select
                      value={birthHour}
                      onChange={(e) => setBirthHour(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="0">자시 (23:30 ~ 01:29)</option>
                      <option value="2">축시 (01:30 ~ 03:29)</option>
                      <option value="4">인시 (03:30 ~ 05:29)</option>
                      <option value="6">묘시 (05:30 ~ 07:29)</option>
                      <option value="8">진시 (07:30 ~ 09:29)</option>
                      <option value="10">사시 (09:30 ~ 11:29)</option>
                      <option value="12">오시 (11:30 ~ 13:29)</option>
                      <option value="14">미시 (13:30 ~ 15:29)</option>
                      <option value="16">신시 (15:30 ~ 17:29)</option>
                      <option value="18">유시 (17:30 ~ 19:29)</option>
                      <option value="20">술시 (19:30 ~ 21:29)</option>
                      <option value="22">해시 (21:30 ~ 23:29)</option>
                    </select>
                  </div>
                </div>

                {/* Price and Security badge */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>토스페이먼츠 보안 결제</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 line-through text-[11px] mr-1">30,000원</span>
                    <span className="text-amber-400 font-bold text-sm tabular-nums">9,900원</span>
                  </div>
                </div>

                {/* Submit to Toss Button */}
                <button
                  onClick={handleOpenCheckout}
                  className="w-full py-3 bg-[#0064FF] hover:bg-[#0052D4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>토스페이먼츠로 안전 결제하기</span>
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 5: SAJU REPORT SCREEN (UNLOCKED)                           */}
            {/* ============================================================== */}
            {step === 5 && sajuData && (
              <div className="flex-1 flex flex-col p-4 bg-slate-950 space-y-4 text-left">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400">정통 사주팔자 심층 리포트</span>
                    <h3 className="text-base font-bold text-white">{userName}님의 사주 원국</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    결제 완료 (PAID)
                  </span>
                </div>

                {/* Four Pillars 4주 8자 Cards */}
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {/* 시주 */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">시주 (時柱)</span>
                    <div className="text-sm font-bold text-white leading-tight">{sajuData.fourPillars.hour.cheongan}</div>
                    <div className="text-sm font-bold text-slate-300 mt-1">{sajuData.fourPillars.hour.jiji}</div>
                  </div>
                  {/* 일주 (본원) */}
                  <div className="p-2 rounded-xl bg-indigo-950/80 border border-amber-400/50 shadow-sm">
                    <span className="text-[10px] text-amber-300 font-bold block mb-1">일주 (본원)</span>
                    <div className="text-sm font-extrabold text-amber-400 leading-tight">{sajuData.fourPillars.day.cheongan}</div>
                    <div className="text-sm font-extrabold text-amber-300 mt-1">{sajuData.fourPillars.day.jiji}</div>
                  </div>
                  {/* 월주 */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">월주 (月柱)</span>
                    <div className="text-sm font-bold text-white leading-tight">{sajuData.fourPillars.month.cheongan}</div>
                    <div className="text-sm font-bold text-slate-300 mt-1">{sajuData.fourPillars.month.jiji}</div>
                  </div>
                  {/* 년주 */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">년주 (年柱)</span>
                    <div className="text-sm font-bold text-white leading-tight">{sajuData.fourPillars.year.cheongan}</div>
                    <div className="text-sm font-bold text-slate-300 mt-1">{sajuData.fourPillars.year.jiji}</div>
                  </div>
                </div>

                {/* Five Elements (오행) Ratio Meter */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-200">음양오행 균형도</span>
                    <span className="text-[11px] text-slate-400">목·화·토·금·수</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 flex overflow-hidden">
                    <div style={{ width: `${sajuData.fiveElementsRatio.wood}%` }} className="bg-emerald-500" title="목" />
                    <div style={{ width: `${sajuData.fiveElementsRatio.fire}%` }} className="bg-rose-500" title="화" />
                    <div style={{ width: `${sajuData.fiveElementsRatio.earth}%` }} className="bg-amber-500" title="토" />
                    <div style={{ width: `${sajuData.fiveElementsRatio.metal}%` }} className="bg-slate-300" title="금" />
                    <div style={{ width: `${sajuData.fiveElementsRatio.water}%` }} className="bg-sky-500" title="수" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 tabular-nums">
                    <span>목 {sajuData.fiveElementsRatio.wood}%</span>
                    <span>화 {sajuData.fiveElementsRatio.fire}%</span>
                    <span>토 {sajuData.fiveElementsRatio.earth}%</span>
                    <span>금 {sajuData.fiveElementsRatio.metal}%</span>
                    <span>수 {sajuData.fiveElementsRatio.water}%</span>
                  </div>
                </div>

                {/* Interpretations */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-amber-300 block mb-1">총평 및 타고난 그릇</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sajuData.interpretation.summary}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-blue-400 block mb-1">재물운 & 자산 형성 시기</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sajuData.interpretation.wealthLuck}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">직업 및 출세 적성</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sajuData.interpretation.careerLuck}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-rose-400 block mb-1">애정 및 배우자운</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sajuData.interpretation.loveLuck}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-amber-400 block mb-1">인생 조언</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sajuData.interpretation.advice}</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  처음부터 새로 분석하기
                </button>
              </div>
            )}

          </div>

          {/* ============================================================== */}
          {/* TOSS PAYMENTS CHECKOUT MODAL OVERLAY (SIMULATION)              */}
          {/* ============================================================== */}
          {isCheckoutOpen && (
            <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end">
              <div className="bg-slate-900 rounded-t-3xl border-t border-slate-700 p-5 space-y-4 animate-in slide-in-from-bottom duration-300 text-left">
                
                {/* Toss Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#0064FF] flex items-center justify-center text-white text-[10px] font-black">
                      T
                    </div>
                    <span className="text-sm font-bold text-white">토스페이먼츠 안전결제</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Order Summary */}
                <div>
                  <span className="text-[11px] text-slate-400 block">주문 상품</span>
                  <div className="text-xs font-semibold text-white">프리미엄 정통 사주팔자 심층 풀이 리포트</div>
                  <div className="text-lg font-extrabold text-amber-400 mt-1 tabular-nums">9,900원</div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 block">결제 수단</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedPayMethod('card')}
                      className={`p-2 rounded-xl text-center border cursor-pointer ${
                        selectedPayMethod === 'card'
                          ? 'bg-[#0064FF]/20 border-[#0064FF] text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                      <span className="text-[11px] block">신용/체크</span>
                    </button>

                    <button
                      onClick={() => setSelectedPayMethod('tosspay')}
                      className={`p-2 rounded-xl text-center border cursor-pointer ${
                        selectedPayMethod === 'tosspay'
                          ? 'bg-[#0064FF]/20 border-[#0064FF] text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="w-4 h-4 mx-auto mb-1 font-black text-[#0064FF]">toss</div>
                      <span className="text-[11px] block">토스페이</span>
                    </button>

                    <button
                      onClick={() => setSelectedPayMethod('kakaopay')}
                      className={`p-2 rounded-xl text-center border cursor-pointer ${
                        selectedPayMethod === 'kakaopay'
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="w-4 h-4 mx-auto mb-1 font-black text-amber-400">pay</div>
                      <span className="text-[11px] block">카카오페이</span>
                    </button>
                  </div>
                </div>

                {/* Card selection dropdown if card */}
                {selectedPayMethod === 'card' && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">카드 선택</label>
                    <select
                      value={selectedCard}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="신한카드 (9412-****)">신한카드 (9412-****)</option>
                      <option value="현대카드 (4518-****)">현대카드 (4518-****)</option>
                      <option value="KB국민카드 (5284-****)">KB국민카드 (5284-****)</option>
                      <option value="삼성카드 (6011-****)">삼성카드 (6011-****)</option>
                    </select>
                  </div>
                )}

                {/* Security Token notice */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>256비트 암호화 및 Server-to-Server 금액 검증으로 안전하게 보호됩니다.</span>
                </div>

                {/* Action Button */}
                <button
                  disabled={isPaying || isLoadingSaju}
                  onClick={handleConfirmPayment}
                  className="w-full py-3 bg-[#0064FF] hover:bg-[#0052D4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isPaying || isLoadingSaju ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>토스페이먼츠 승인 및 사주 리포트 생성 중...</span>
                    </>
                  ) : (
                    <span>9,900원 결제 승인하기</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Android Bottom Navigation Bar */}
          <div className="h-12 bg-slate-950/90 border-t border-slate-800/80 grid grid-cols-3 items-center px-4 text-slate-500 z-10">
            <button 
              onClick={() => setStep(1)}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${step <= 2 ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Camera className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">손금 스캔</span>
            </button>
            <button 
              onClick={() => setStep(3)}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${step === 3 ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">사주 입력</span>
            </button>
            <button 
              onClick={() => {
                if (sajuData) setStep(5);
                else setStep(3);
              }}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${step === 5 ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">사주 풀이</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
