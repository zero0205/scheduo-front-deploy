# 일정 관리 API 연동 구현 계획서

## 개요

일정 생성, 특정 날짜 일정 조회, 월별 일정 조회 API를 연동하여 일정 관리 기능을 구현합니다.

## 1. 현재 코드베이스 분석 결과 (2024-08-22 업데이트)

### ✅ 완료된 작업 (커밋: 156ea2c, aa88cc0)

- `@entities/schedule/model/types.ts`: Schedule 타입 정의 완료
- `@entities/schedule/api/types.ts`: InputScheduleRequest 타입 정의 완료
- `@entities/schedule/api/api.ts`: 빈 API 함수 골격 생성 완료
- `@entities/schedule/api/index.ts`: 내보내기 설정 완료
- `@entities/schedule/index.ts`: 엔티티 진입점 설정 완료

### 🔍 현재 상태 분석

#### Schedule 엔티티 구조 현황
```
src/entities/schedule/
├── api/
│   ├── api.ts          ✅ 빈 함수들 정의됨 (구현 필요)
│   ├── index.ts        ✅ 완료
│   └── types.ts        ✅ InputScheduleRequest 타입 정의됨
├── model/
│   ├── types.ts        ✅ Schedule 타입 정의 완료
│   └── index.ts        ✅ 완료
└── index.ts            ✅ 완료
```

#### 기존 Schedule 타입 (model/types.ts)
- 완성도 높은 타입 정의 (id, title, isAllDay, dates, times, location, category, memo, notification, recurrence, calendar)
- NotificationTime, RecurrenceRule enum 정의 완료
- ScheduleCalendar 참조를 통한 캘린더 연결

### 🎯 기존 타입과 API 스펙 간 차이점 분석

- **시간 형식**: 기존 `startDate`/`endDate` + `startTime`/`endTime` vs API `startDateTime`/`endDateTime` 
- **카테고리**: 기존 `string` vs API `{name, color}` 객체
- **전체 일정**: 기존 `isAllDay` vs API `allDay`
- **알림**: 기존 `notificationTime` vs API 미정의

## 2. 구현 계획

### 2.1 타입 정의 및 인터페이스 설계

#### API 응답 전용 타입 추가 (`@entities/schedule/api/types.ts`)

```typescript
// 카테고리 타입
interface ScheduleCategory {
  name: string;
  color:
    | "RED"
    | "BLUE"
    | "GREEN"
    | "YELLOW"
    | "PURPLE"
    | "ORANGE"
    | "PINK"
    | "GRAY";
}

// 특정 날짜 일정 조회 응답
interface DailyScheduleResponse {
  id: number;
  title: string;
  startDateTime: string; // "2025-05-21T10:00:00"
  endDateTime: string; // "2025-05-21T11:00:00"
  category: ScheduleCategory;
  allDay: boolean;
}

// 월별 일정 조회 응답
interface MonthlyScheduleResponse {
  id: number;
  title: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;
  category: ScheduleCategory;
}

// 일정 생성 요청
interface CreateScheduleRequest {
  title: string;
  participants: Array<{
    memberId: number;
    role: CalendarRole;
  }>;
}

// API 응답 래퍼
interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}
```

### 2.2 API 함수 구현 (`@entities/schedule/api/api.ts`)

#### 구현할 API 함수들

1. **일정 생성**: `createSchedule(calendarId: number, request: CreateScheduleRequest)`
2. **특정 날짜 일정 조회**: `getSchedulesByDate(calendarId: number, date: string)`
3. **월별 일정 조회**: `getSchedulesByMonth(calendarId: number, date: string)`

#### 구현 방식

- Axios 인스턴스 활용 (`@shared/api/axios.ts`)
- 중앙집중식 에러 처리 활용 (인터셉터에서 처리)
- TypeScript 타입 안정성 보장

### 2.3 TanStack Query 훅 구현

#### 구현할 훅들

1. **`useCreateSchedule`**: 일정 생성 뮤테이션
2. **`useDailySchedules`**: 특정 날짜 일정 조회 쿼리
3. **`useMonthlySchedules`**: 월별 일정 조회 쿼리

#### 쿼리 키 구조

```typescript
// 단순한 구조로 시작 (YAGNI 원칙)
const scheduleKeys = {
  daily: (calendarId: number, date: string) => [
    "schedules",
    "daily",
    calendarId,
    date,
  ],
  monthly: (calendarId: number, date: string) => [
    "schedules",
    "monthly",
    calendarId,
    date,
  ],
};
```

#### 구현 위치

- `@entities/schedule/api/` 디렉토리에 `hooks.ts` 파일 생성

## 3. 구현 우선순위 및 진행 상태

### ✅ 완료된 단계
- **0단계**: Schedule 엔티티 기본 구조 생성 (커밋: 156ea2c, aa88cc0)
  - 폴더 구조 및 기본 파일 생성
  - Schedule 도메인 타입 정의
  - InputScheduleRequest 타입 정의

### ✅ 추가 완료된 단계 (2024-08-22 업데이트)

- **1단계**: API 응답 타입 정의 및 API 함수 구현 (커밋: cb56de9, 24d171f)
  - [x] API 응답 전용 타입들을 `api/types.ts`에 추가
    - ScheduleCategory, DailyScheduleResponse, MonthlyScheduleResponse, CreateScheduleRequest, ApiResponse
  - [x] `api/api.ts`의 핵심 함수들에 실제 API 호출 로직 구현
    - createSchedule, getSchedulesByDate, getSchedulesByMonth

- **2단계**: TanStack Query 훅 구현 (커밋: 24d171f)
  - [x] `api/hooks.ts` 파일 생성
  - [x] useCreateSchedule, useDailySchedules, useMonthlySchedules 훅 구현
  - [x] scheduleKeys 쿼리 키 팩토리 구현
  - [x] 자동 캐시 무효화 로직 구현

### ✅ 추가 완료된 단계 (2024-08-22 업데이트 2차)

- **3단계**: 일정 수정 API 연동 구현 (신규 완료)
  - [x] `getScheduleById` API 함수 구현
  - [x] `updateSchedule` API 함수 구현
  - [x] `useScheduleDetail`, `useUpdateSchedule` TanStack Query 훅 구현
  - [x] scheduleKeys에 detail 쿼리 키 추가
  - [x] EditSchedule 컴포넌트 실제 API 연동 완료
    - scheduleId prop 추가하여 수정할 일정 지정
    - 일정 상세 정보 조회 및 폼 초기값 설정
    - API 응답 데이터를 InputScheduleRequest 형태로 변환
    - 수정 완료 시 캐시 무효화 및 자동 업데이트

- **4단계**: CreateSchedule 컴포넌트 개선 (신규 완료)
  - [x] URL 파라미터 기반 캘린더 ID 관리 시스템 구현
  - [x] useCurrentCalendarId 커스텀 훅 구현
  - [x] 폼 검증 및 에러 피드백 시스템 개선
    - 필수 필드 기본값 설정 (시작시간: "00:00", 종료시간: "01:00")
    - 모든 필드에 대한 에러 메시지 및 시각적 피드백 추가
    - TimePicker 컴포넌트 className prop 지원 추가
  - [x] 알림 및 반복 설정 데이터 API 요청에 포함

### 🚧 남은 구현 단계

5. **5단계**: 전체 시스템 연동 테스트 (미완료)
   - [ ] 일정 수정 기능을 위한 UI 연결 (DailySchedule → EditSchedule)
   - [ ] 실제 API 연동 테스트 및 오류 수정
   - [ ] 엣지 케이스 처리 및 에러 핸들링 검증

## 4. 주의사항

### 타입 변환

- API 응답과 기존 Schedule 타입 간 변환 함수 필요시 추가 구현
- 현재는 API 응답 타입을 별도로 관리하여 혼동 방지

### 에러 처리

- 중앙집중식 에러 처리 활용 (Axios 인터셉터)
- 컴포넌트에서 개별 에러 처리 불필요

### YAGNI 원칙 준수

- 현재 필요한 기능만 구현
- 추가 기능은 요구사항 발생시 구현

## 5. 파일 구조 현황

```
src/entities/schedule/
├── api/
│   ├── api.ts          ✅ 모든 핵심 API 함수 구현 완료 (생성/조회/수정)
│   ├── hooks.ts        ✅ 모든 TanStack Query 훅 구현 완료 (5개 훅)
│   ├── types.ts        ✅ 모든 API 응답/요청 타입 정의 완료
│   └── index.ts        ✅ 완료
├── model/
│   ├── types.ts        ✅ Schedule 타입 완료
│   └── index.ts        ✅ 완료
└── index.ts            ✅ 완료
```

## 6. 구현 완료 요약

**✅ 완료된 작업 (2024-08-22 기준 - 최종 업데이트)**

Schedule 엔티티의 전체 CRUD API 연동이 완료되었습니다:

1. **API 응답/요청 타입**: 모든 타입 정의 완료
   - ScheduleCategory, DailyScheduleResponse, MonthlyScheduleResponse
   - CreateScheduleRequest, UpdateScheduleRequest, ScheduleDetailResponse
   - ApiResponse 래퍼 타입

2. **API 함수**: 모든 핵심 함수 구현 완료
   - `createSchedule(calendarId, request)` - 일정 생성
   - `getSchedulesByDate(calendarId, date)` - 특정 날짜 일정 조회
   - `getSchedulesByMonth(calendarId, date)` - 월별 일정 조회
   - `getScheduleById(calendarId, scheduleId)` - 일정 상세 조회
   - `updateSchedule(calendarId, scheduleId, request)` - 일정 수정

3. **TanStack Query 훅**: 모든 훅 구현 완료 (5개)
   - `useCreateSchedule()` - 일정 생성 뮤테이션
   - `useDailySchedules(calendarId, date)` - 특정 날짜 일정 조회
   - `useMonthlySchedules(calendarId, date)` - 월별 일정 조회
   - `useScheduleDetail(calendarId, scheduleId, options?)` - 일정 상세 조회
   - `useUpdateSchedule()` - 일정 수정 뮤테이션
   - `scheduleKeys` - 쿼리 키 팩토리 (detail 키 포함)

4. **컴포넌트 API 연동**: 전체 완료
   - `CreateSchedule` - 일정 생성 API 연동, 폼 검증 개선, URL 파라미터 기반 캘린더 ID 관리
   - `EditSchedule` - 일정 수정 API 연동, 실시간 데이터 로딩, 데이터 변환 로직

**🚧 다음 단계**: UI 연결 개선 (DailySchedule에서 EditSchedule로의 일정 선택 흐름)

완전한 일정 관리 시스템의 API 연동이 완성되었으며, 생성/조회/수정의 전체 라이프사이클을 지원합니다.
