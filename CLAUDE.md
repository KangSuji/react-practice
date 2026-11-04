# 자리툰 과제 대비 React 연습 프로젝트

이 파일은 VS Code(Claude Code)에서 이 저장소를 함께 작업하는 Claude가 읽는 안내서입니다. 저장소 루트에 `CLAUDE.md`로 두세요.

## 배경

- 개발자: Vue 3 + TypeScript 4년차 프론트엔드 개발자. React는 익숙하지 않음.
- 목표: 2026-11-07(금) 15:00부터 2시간 동안 진행되는 자리툰 React 과제 전형 대비.
- 과제 요구사항은 `01_과제명세서.md`, 목 데이터는 `db.json`.
- 연습이 목적이므로 "완성된 코드"보다 "개발자가 직접 짤 수 있게 되는 것"이 우선.

## Claude의 작업 방식 (중요)

1. **기본은 코치 모드.** 요청이 없으면 코드를 통째로 써주지 말고, 다음 단계와 필요한 훅/개념을 짧게 알려준 뒤 개발자가 직접 쓰게 한다. 개발자가 "코드 써줘"라고 하면 그때 작성한다.
2. **Vue와 비교해서 설명한다.** 예: `ref/reactive` ↔ `useState`, `computed` ↔ `useMemo`(또는 그냥 렌더 중 계산), `watch` ↔ `useEffect`, `v-model` ↔ controlled input(`value` + `onChange`), `emit` ↔ 콜백 props, `provide/inject` ↔ Context/Jotai, Pinia ↔ Jotai/Zustand.
3. **자주 하는 실수를 바로 짚는다.** 상태를 직접 변경(`arr.push`), `key`에 index 사용, `useEffect` 의존성 누락, 불필요한 `useEffect`(파생 값은 렌더 중 계산), 서버 데이터를 useState에 복사.
4. 개발자가 쓴 코드를 리뷰할 때는 과제 평가 관점(명세서 4장)으로 본다.
5. 한 번에 한 요구사항씩 진행하고, 끝날 때마다 커밋을 제안한다.
6. 11/7 리허설 때는 개발자가 요청하지 않는 한 개입하지 않는다 (실전처럼).

## 기술 스택

- Vite + React 18 + TypeScript (strict)
- React Router v6
- TanStack Query v5 (서버 상태)
- Jotai (찜 목록 같은 전역 화면 상태, `atomWithStorage`)
- 스타일: CSS Modules 또는 Tailwind 중 개발자가 고른 것
- 서버: `json-server@0.17.4` (버전 고정. v1은 `_page`, `_limit`, `q` 동작이 다름)

## 실행

```bash
pnpm create vite jaritoon-practice --template react-ts
cd jaritoon-practice
pnpm add @tanstack/react-query jotai react-router-dom
pnpm add -D json-server@0.17.4
# db.json을 프로젝트 루트에 복사
```

`package.json` scripts:

```json
"dev": "vite",
"api": "json-server --watch db.json --port 4000"
```

터미널 두 개에서 `pnpm api`, `pnpm dev`.

## 권장 폴더 구조

```
src/
  api/          listings.ts, inquiries.ts   -- fetch 함수만
  hooks/        useListings.ts, useListing.ts, useCreateInquiry.ts, useDebounce.ts
  types/        listing.ts
  store/        favorites.ts  -- Jotai atom
  utils/        format.ts     -- 금액·면적·날짜 포맷 (순수 함수)
  components/   ListingCard, FilterBar, Pagination, InquiryForm, StatusView(로딩/에러/빈 상태)
  pages/        ListPage.tsx, DetailPage.tsx
  App.tsx       Router + QueryClientProvider
```

## 구현 메모

- 목록 쿼리 키: `['listings', { q, type, region, minRent, maxRent, sort, page }]`. 페이지 이동 시 깜빡임 방지로 `placeholderData: keepPreviousData`.
- 전체 개수는 응답 헤더 `X-Total-Count`에서 읽는다 (`res.headers.get('X-Total-Count')`).
- 빈 필터 값은 쿼리스트링에서 빼고 보낸다.
- 문의 등록은 `useMutation` → 성공 시 `invalidateQueries({ queryKey: ['inquiries', listingId] })`.
- 상태 변경(PATCH) 후에는 `['listings']`와 `['listing', id]`를 함께 무효화.
- 금액 단위는 만원. 10000 이상이면 `1억 2,000`처럼 표시.

## 하지 말 것

- 명세서에 없는 라이브러리 추가 (폼 라이브러리, UI 키트 등). 실전 2시간에 설치·학습 비용이 크다.
- 서버 데이터를 `useState`에 복사해서 관리.
- 처음부터 과도한 추상화. 동작하는 최소 단위를 먼저 만들고 정리한다.
