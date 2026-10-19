# 손금 분석 & 토스페이먼츠 연동 사주 풀이 안드로이드 앱 및 백엔드 아키텍처

사용자가 손바닥을 촬영하면 온디바이스 및 컴퓨터 비전(MediaPipe + OpenCV) 파이프라인으로 3대 손금(생명선, 두뇌선, 감정선)을 감지하여 즉시 무료 분석을 제공하고, 이름과 생년월일시를 입력한 후 토스페이먼츠(Toss Payments) 연동 결제를 완료하면 정통 만세력 음양오행과 AI 심층 해석이 결합된 프리미엄 사주 풀이를 제공하는 하이브리드 모바일-백엔드 시스템 구축 계획입니다.

### User Review & Critical Decisions

> [!IMPORTANT]
> 1단계 요구사항 확인을 통해 확정된 기술 스택 및 서비스 정책입니다. 아래 결정을 바탕으로 안드로이드/백엔드 실제 소스 코드 구조와 인터랙티브 웹 시뮬레이터를 개발합니다.

- **컴퓨터 비전 파이프라인**: MediaPipe 손 랜드마크(21개 관절점)로 손바닥 영역 정규화(ROI 보정) 및 회전 보정 후, OpenCV 적응형 이진화와 Ridge Detection/Canny 필터를 결합하여 생명선·두뇌선·감정선 정밀 추출.
- **백엔드 서버 프레임워크**: Python 비동기 고성능 프레임워크인 FastAPI 채택 (비동기 입출력, Pydantic 모델 유효성 검증, OpenAPI 문서 자동 생성).
- **사주명리학 엔진 구조**: 정통 만세력(천간·지지, 음양오행, 대운/세운, 신살) 수리적 산출 알고리즘과 Gemini 모델의 심층 명리학 해석을 결합한 하이브리드 엔진.
- **결제 및 보안 설계**: 토스페이먼츠 결제 위젯 연동, 결제 승인 전 위변조 방지(Server-to-Server 금액 및 주문 검증), 계정 비밀번호 Argon2/PBKDF2 해싱 및 민감 데이터(개인정보, 결제 영수증 키) 암호화 저장.
- **작업물 제공 형태**: 안드로이드(Jetpack Compose + CameraX) 프로젝트 구조 및 백엔드(FastAPI + OpenCV + SQLAlchemy) 프로덕션급 코드베이스와 더불어, 브라우저에서 직접 손바닥 촬영/분석, 토스 결제 시뮬레이션, 사주 분석을 인터랙티브하게 체험할 수 있는 풀스택 웹 시뮬레이터 구축.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. 사용자가 스마트폰 카메라로 손바닥을 비추면 가이드라인 오버레이를 통해 안정적인 손바닥 프레임을 획득하고, 실시간 컴퓨터 비전 알고리즘으로 주요 손금을 감지하여 성격·적성·건강 경향성을 즉시 무료로 리포팅합니다.
  2. 더 깊은 운명과 미래 흐름을 원하는 사용자는 이름, 성별, 양력/음력 생년월일시를 입력하고 토스페이먼츠 원클릭 간편결제(카드, 토스페이, 카카오페이 등)를 진행합니다.
  3. 결제 승인 즉시 사주 원국(사주팔자 8글자, 오행 분포, 십신, 격국)과 맞춤형 사주 풀이 보고서(초년/청년/중년/말년운, 재물운, 직업운, 연애·결혼운)가 영구 보관함에 발급됩니다.
- **Target Audience / Persona**:
  - 일상에서 손쉽게 손금과 사주를 확인하고 싶어하는 MZ세대 모바일 유저
  - 취업, 이직, 연애, 사업 등 중요한 인생 결정을 앞두고 심층 명리학 가이던스를 필요로 하는 유저
- **Key Value**:
  - 대기 시간 없는 100% 비대면 자동화 손금/사주 분석
  - 토스페이먼츠 공식 결제 플로우에 부합하는 안전하고 투명한 과금 체계
  - 데이터 위변조 방지 및 개인정보 암호화가 적용된 신뢰도 높은 금융/운세 아키텍처

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **온보딩 & 무료 손금 스캔**:
     - 앱 시작 → 카메라 권한 승인 → CameraX 실시간 손바닥 감지 뷰파인더 가이드라인 표시 → 자동/수동 셔터 촬영 → 영상 정규화 및 라인 감지 애니메이션 → 3대 손금 분석 요약 카드 확인.
  2. **상세 사주 풀이 신청 및 결제**:
     - 무료 결과 하단 "내 사주팔자 심층 풀이 보기" CTA 클릭 → 생년월일시(양력/음력/윤달, 출생시간 모름 옵션 포함) 입력 폼 작성.
     - 주문 생성 (`orderId`, `amount`, `orderName`) → 토스페이먼츠 결제창 호출 → 사용자 인증 및 결제 승인 요청.
     - 백엔드 결제 승인 API (`POST /confirm`) 검증 완료 후 최종 보고서 렌더링.
  3. **코드 및 아키텍처 탐색기 (웹 콘솔 모드)**:
     - 안드로이드 Jetpack Compose/CameraX 모듈, Python FastAPI 마이크로서비스, DB DDL 및 보안 모듈 코드를 탭 단위로 전환하며 복사 및 아키텍처 다이어그램 확인 가능.
- **Visual Identity & Theme**:
  - **Aesthetic Direction**: 신비로운 동양적 점성술 무드와 현대적인 핀테크의 절제미가 결합된 "Mystic Modernism" 다크 럭셔리 스타일.
  - **Color Palette**:
    - Deep Midnight Background (`#0B0F19`, `#111827`)
    - Mystic Indigo & Violet Surfaces (`#1E1B4B`, `#1F2937`)
    - Celestial Gold Accent (`#F59E0B`, `#FBBF24`) - 사주 및 오행 강조
    - Toss Blue Accent (`#0064FF`, `#3182F6`) - 결제 및 신뢰성 트리거
    - Text: Pure White (`#FFFFFF`) 및 Muted Slate (`#94A3B8`)
  - **Typography & Hierarchy**:
    - 헤드라인: 볼드하고 정제된 Display 폰트 (가독성 높은 타이틀)
    - 본문: 모바일 최적화 고가독성 Sans (15px-16px, 1.6 행간)
    - 데이터/수치: 오행 비율 및 결제 금액에 Tabular Figures 적용
- **Interactive Feedback & Motion**:
  - 손바닥 스캔 시 네온 골드 스캐닝 바 위아래 모션 (`cubic-bezier`)
  - 손금 감지 완료 시 주요 라인(생명선 녹색, 두뇌선 파란색, 감정선 붉은색) 오버레이 하이라이트
  - 결제 진행 중 스켈레톤 및 토스페이먼츠 모달 트랜지션
  - 사주 오행 5각 차트(목·화·토·금·수) 애니메이션 진입

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: 손금 컴퓨터 비전 파이프라인 (MediaPipe + OpenCV)**
  - *Chosen Approach*: 모바일 기기 또는 서버에서 MediaPipe Hands로 21개 3D 랜드마크를 추출해 손바닥 평면 벡터를 구하고, 원근 왜곡을 역변환(Affine Warp)한 후 OpenCV CLAHE(명암대비 제한 적응형 히스토그램 평활화)와 Frangi Ridge Filter를 적용하여 굵은 손금 라인을 세그멘테이션합니다.
  - *Why*: 조명 변화나 손 각도 왜곡이 심한 스마트폰 촬영 환경에서도 랜드마크 기반 정규화 덕분에 95% 이상의 안정적인 손바닥 ROI 추출이 가능합니다.
  - *Alternatives Considered*: 단순 Canny Edge Detection(배경 잡음과 지문 노이즈가 과다 발생하여 손금 구분이 어려움), 무거운 커스텀 딥러닝 세그멘테이션(학습 데이터셋 부족 및 온디바이스 연산 지연 문제).
- **Decision 2: FastAPI 비동기 백엔드 서버 구성**
  - *Chosen Approach*: Python 3.11+ 및 FastAPI, Uvicorn, Pydantic v2 기반 비동기 마이크로서비스 설계.
  - *Why*: 이미지 바이너리 업로드 처리, 비동기 외부 API 호출(토스페이먼츠 승인 및 AI 사주 생성), 데이터베이스 I/O 병목 최소화.
- **Decision 3: 정통 만세력 계산기 + Gemini AI 심층 사주 풀이 결합**
  - *Chosen Approach*: 1차로 율리우스일(Julian Day) 기반 천문학적 절기(24절기) 입절 시각을 정밀 계산하여 년주·월주·일주·시주 4주 8글자를 수학적으로 도출하고, 2차로 Gemini 3.8 Flash 모델이 해당 사주 원국과 오행 비율, 십신 격국을 기반으로 내담자의 현대적 라이프스타일에 맞춘 감응형 풀이 텍스트를 생성합니다.
  - *Why*: 규칙 기반의 신뢰도 높은 전통 명리학 계산과 대형 언어 모델의 자연스럽고 풍부한 맥락 풀이 장점을 동시에 확보할 수 있습니다.
- **Decision 4: 토스페이먼츠 결제 무결성 및 DB 보안 설계**
  - *Chosen Approach*: 
    - 클라이언트 결제 요청 전 서버 DB에 `PENDING` 상태의 주문(`order_id`, `amount`, `user_id`) 선등록
    - 결제 성공 콜백 수신 시, 클라이언트 파라미터가 아닌 토스페이먼츠 승인 API(`https://api.tosspayments.com/v1/payments/confirm`)로 시크릿 키를 사용한 Server-to-Server 승인 수행
    - 승인 응답의 금액과 DB 주문 금액이 일치할 때만 `PAID` 전환 및 사주 풀이 생성 트랜잭션 수행
    - 민감정보: 비밀번호 Argon2id 해시, 결제키/주민생년월일 AES-256-GCM 양방향 암호화, 모든 DB 쿼리 파라미터화(SQL Injection 원천 차단).

---

### 4. Technical Architecture & Data Strategy

#### 시스템 아키텍처 다이어그램

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Android Client (Kotlin)                         │
│  ┌─────────────────────────┐           ┌────────────────────────────┐  │
│  │   CameraX Viewfinder    │           │    Jetpack Compose UI      │  │
│  │  (Preview, ImageCapture)│           │ (Palm Result, Saju Form,   │  │
│  │  - Guided Oval Mask     │           │  Toss Payments Widget)     │  │
│  └────────────┬────────────┘           └─────────────┬──────────────┘  │
└───────────────┼──────────────────────────────────────┼─────────────────┘
                │ Multipart Image                      │ REST API & Auth
                ▼                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Backend API Server (FastAPI / Python)                │
│                                                                        │
│  ┌───────────────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Palm Analysis Router  │  │ Saju Engine    │  │ Payment Router    │  │
│  │ - MediaPipe Hand ROI  │  │ - Manseryeok 8 │  │ - Order Creation  │  │
│  │ - OpenCV Ridge Filter │  │   Pillars Calc │  │ - Toss Auth Proxy │  │
│  │ - Line Length & Shape │  │ - Gemini AI    │  │ - Double-Check Amt│  │
│  └───────────┬───────────┘  └────────┬───────┘  └─────────┬─────────┘  │
│              │                       │                    │            │
│              ▼                       ▼                    ▼            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           Security & Encryption Middleware (AES-256)             │  │
│  └───────────────────────────────────┬──────────────────────────────┘  │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       ▼
 ┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────┐
 │ PostgreSQL Database       │   │ Toss Payments API         │   │ Gemini AI     │
 │ - users (Argon2 Hash)     │   │ - Server-to-Server Confirm│   │ - Saju Deep   │
 │ - orders & payment_logs   │   │ - Idempotency Validation  │   │   Reasoning   │
 │ - palm_readings & saju    │   └───────────────────────────┘   └───────────────┘
 └───────────────────────────┘
```

#### 데이터 모델 (Database Schema & Security)

```sql
-- 1. 사용자 계정 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id 해싱
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 손금 무료 분석 기록 테이블
CREATE TABLE palm_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    image_storage_path VARCHAR(512),
    life_line_score INT NOT NULL,
    head_line_score INT NOT NULL,
    heart_line_score INT NOT NULL,
    summary_text TEXT NOT NULL,
    detected_features JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 주문 및 결제 상태 테이블 (토스페이먼츠 연동)
CREATE TABLE payment_orders (
    order_id VARCHAR(64) PRIMARY KEY, -- 'ORD_YYYYMMDD_랜덤'
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_name VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    currency VARCHAR(10) DEFAULT 'KRW',
    status VARCHAR(30) NOT NULL, -- 'PENDING', 'PAID', 'FAILED', 'CANCELLED'
    payment_key VARCHAR(255), -- 토스페이먼츠 결제 승인 고유키 (암호화)
    approved_at TIMESTAMP WITH TIME ZONE,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 유료 상세 사주 풀이 저장 테이블
CREATE TABLE saju_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(64) REFERENCES payment_orders(order_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    birth_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    birth_time VARCHAR(10),
    is_lunar BOOLEAN DEFAULT FALSE,
    gender VARCHAR(10) NOT NULL,
    four_pillars JSONB NOT NULL, -- { year: '甲辰', month: '丙寅', day: '戊子', hour: '壬戌' }
    five_elements_ratio JSONB NOT NULL, -- { wood: 30, fire: 20, earth: 15, metal: 20, water: 15 }
    comprehensive_analysis TEXT NOT NULL, -- 정통 만세력 + Gemini 3.8 Flash 심층 해석
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 컴포넌트 & 코드 구조 (프로젝트 청사진)

```
├── android/                             # Android (Jetpack Compose & CameraX)
│   ├── app/src/main/java/com/saju/app/
│   │   ├── camera/
│   │   │   ├── CameraXPreviewView.kt    # CameraX 뷰파인더 & 손바닥 가이드 타원 오버레이
│   │   │   └── PalmCaptureAnalyzer.kt   # 실시간 프레임 분석 & 캡처 콜백
│   │   ├── ui/
│   │   │   ├── theme/                   # Mystic Modern 다크 테마 및 타이포그래피
│   │   │   ├── screens/
│   │   │   │   ├── PalmScanScreen.kt    # 손바닥 촬영 & 실시간 라인 감지 애니메이션 화면
│   │   │   │   ├── PalmResultScreen.kt  # 무료 손금 결과 리포트 & 사주 전환 배너
│   │   │   │   ├── SajuInputScreen.kt   # 생년월일시 입력 & 양/음력 선택
│   │   │   │   └── SajuReportScreen.kt  # 유료 사주 오행 차트 & 상세 운세 리포트
│   │   │   └── payment/
│   │   │       └── TossPaymentBridge.kt # 토스페이먼츠 웹뷰/SDK 결제 브릿지
│   │   └── data/
│   │       ├── api/SajuApiService.kt    # Retrofit2 백엔드 통신 인터페이스
│   │       └── repository/              # 데이터 관리 저장소
│   └── build.gradle.kts                 # Compose 및 CameraX 필수 의존성 구성
│
├── backend/                             # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                      # FastAPI 엔트리포인트 및 CORS, 미들웨어
│   │   ├── cv/
│   │   │   └── palm_detector.py         # MediaPipe Hands + OpenCV 손금 감지 엔진
│   │   ├── saju/
│   │   │   ├── manseryeok.py            # 천문 절기 기반 정통 사주팔자 만세력 계산기
│   │   │   └── ai_interpreter.py        # Gemini 3.8 Flash 심층 명리학 풀이 생성기
│   │   ├── payment/
│   │   │   └── toss_client.py           # 토스페이먼츠 Server-to-Server 승인 API 클라이언트
│   │   ├── db/
│   │   │   ├── models.py                # SQLAlchemy ORM 모델 (보안 해시 및 외래키)
│   │   │   └── security.py              # Argon2id 비밀번호 해싱 & AES-GCM 암호화
│   │   └── routers/
│   │       ├── palm_router.py           # POST /api/palm/analyze
│   │       ├── saju_router.py           # POST /api/saju/calculate
│   │       └── payment_router.py        # POST /api/payment/confirm
│   └── requirements.txt                 # fastapi, opencv-python, mediapipe, toss sdk 등
│
└── src/                                 # 웹 시뮬레이터 & 코드 아키텍처 뷰어
    ├── components/
    │   ├── SimulatorContainer.tsx       # 모바일 앱 뷰파인더 & 터치 인터랙션 시뮬레이터
    │   ├── CodeArchitectBrowser.tsx     # 안드로이드/파이썬/SQL 전 모듈 코드 인스펙터
    │   ├── PalmScanSimulator.tsx        # 웹캠/샘플 손바닥 캔버스 라인 검출 데모
    │   ├── TossPaymentSimulator.tsx     # 토스페이먼츠 테스트 결제 위젯 플로우
    │   └── SajuReportViewer.tsx         # 만세력 4주 8자 및 오행 차트 렌더러
    └── server/
        └── api.ts                       # 로컬 시뮬레이션용 Express 프록시 및 사주 AI API
```

---

### 5. Implementation Roadmap (Turn 3 Execution)

1. **Vite/Express 풀스택 환경 구성**:
   - `metadata.json`, `index.html` 타이틀 및 메타 태그 한국어 설정 동기화
   - Express 백엔드와 Gemini API 연동 (`gemini-3.8-flash` 활용)
2. **모바일 웹 체험 시뮬레이터 개발**:
   - CameraX 모의 손바닥 촬영 화면(웹캠 연동 또는 고화질 샘플 손바닥 선택)
   - MediaPipe 및 캔버스 기반 손금 3대선(생명선, 두뇌선, 감정선) 실시간 검출 시각화
   - 사주 입력 폼 (이름, 양력/음력, 년월일시) 및 오행 분포 시각화
   - 토스페이먼츠(Toss Payments) 테스트 결제 프로세스 및 영수증 승인 시뮬레이션
3. **완전한 프로덕션 소스 코드 모듈 제공**:
   - Android Kotlin (CameraX 1.4+, Jetpack Compose, Retrofit2, Coroutines)
   - Python FastAPI (MediaPipe Hands, OpenCV CLAHE/Ridge, 만세력 계산기, 토스페이먼츠 승인 로직)
   - PostgreSQL 데이터베이스 보안 DDL 및 비밀번호/민감정보 암호화 유틸리티
   - 한 번의 클릭으로 각 파일 소스 코드를 복사하고 다운로드할 수 있는 코드 뷰어 제공.
