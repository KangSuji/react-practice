# 진행 상황 메모

다른 PC나 새 대화에서 이어서 할 때 이 파일부터 읽는다. 작업 방식(코치 모드, Vue 비교 설명)은 `CLAUDE.md`를 따른다.

마지막 업데이트: 2026-11-06

## 다른 PC에서 시작하기

```bash
git clone https://github.com/KangSuji/react-practice.git
cd react-practice   # 저장소 루트 = 이 프로젝트 루트
pnpm install
pnpm api            # 터미널 1: json-server (포트 4000)
pnpm dev            # 터미널 2: Vite
```

Claude Code를 열고 "PROGRESS.md 보고 이어서 하자"라고 하면 된다.

## 환경 메모

- 실제 설치 버전은 React 19, React Router 7, Jotai 3, TypeScript 7이다 (CLAUDE.md에는 18/v6로 적혀 있음). 과제에서 쓰는 API는 같다.
- `pnpm lint`는 동작하지 않는다. typescript-eslint가 TS 7을 아직 지원하지 않기 때문이다. 타입 검사는 `pnpm exec tsc -b`로 한다.

## 완료한 것

| 단계 | 내용 | 파일 |
|---|---|---|
| 0 | git 초기화, 템플릿 정리 | |
| 1 | json-server 동작, `X-Total-Count` 확인 | |
| 2 | 타입 정의 (`Listing`, `Inquiry`, `CreateInquiryInput`, `ListingFilters`, `SortKey`, `ListingsResponse`) | `src/types/listing.ts` |
| 3 | `QueryClientProvider`(retry: 1), `BrowserRouter`, 라우트 3개 (`/`, `/listings/:id`, `*`) | `src/main.tsx`, `src/App.tsx` |
| 4 | `fetchListings`, `fetchListing` (빈 값 생략, 정렬 매핑, `res.ok` 확인) | `src/api/listings.ts` |
| 5 | `useListings` (`placeholderData: keepPreviousData`) | `src/hooks/useListings.ts` |
| 6 | `ListingCard` (CSS Modules, 유형·상태 배지, 계약완료 흐림, `<Link>`), `formatPrice` | `src/components/ListingCard.tsx`, `src/utils/formats.ts` |
| 7 | `FilterBar` (검색, 유형, 지역, 월세 최소/최대, 정렬), `ListingList` 분리, 필터 변경 시 1페이지 | `src/components/FilterBar.tsx`, `src/components/ListingList.tsx`, `src/pages/ListPage.tsx` |

## 바로 고쳐야 할 버그 (아직 수정 전)

1. **`useDebounce`에서 값이 갱신되지 않는다** (`src/hooks/useDebounce.ts` 7번 줄)
   - `setTimeout` 콜백 안에서 `setDebounced(debounced)`를 호출하고 있다. 새로 들어온 `value`로 바꿔야 한다.
   - 확인: Network 탭에서 "성수"를 빠르게 입력했을 때 요청이 한 번만 나가고 결과가 바뀌면 성공이다.
2. **`ListingList`에서 로딩 화면이 나오지 않는다** (`src/components/ListingList.tsx` 13~14번 줄)
   - 13번 줄 `if (!data || isPending) return;`이 아무것도 그리지 않고 끝나서 14번 줄에 도달하지 못한다.
   - 두 줄을 `if (!data || isPending) return <로딩 화면>;` 하나로 합친다. 에러 검사는 지금처럼 맨 위에 둔다.

## 남은 할 일 (순서대로)

1. 위 버그 2개 수정 후 커밋
2. **페이지네이션** (`components/Pagination.tsx`)
   - `Math.ceil(total / PAGE_SIZE)`로 전체 페이지 수 계산, 이전/다음 버튼과 페이지 번호
   - `page` 상태는 `ListPage`에 이미 있다. 총 개수와 페이지네이션은 `ListPage`에서 `data?.total`로 그린다.
3. **상세 페이지** (`pages/DetailPage.tsx`, 현재 빈 컴포넌트)
   - `useParams`로 id, `useListing(id)` 훅 추가 (queryKey `['listing', id]`)
   - 모든 필드 표시, 목록으로 돌아가기 버튼
   - 없는 id면 "매물을 찾을 수 없습니다". 404와 다른 에러를 구분하려면 에러에 status를 담아야 한다. 404는 재시도하지 않게 한다.
4. **문의 폼** (`components/InquiryForm.tsx`, `api/inquiries.ts`, `hooks/useCreateInquiry.ts`)
   - 이름(필수), 연락처(`010-1234-5678` 형식), 내용(10자 이상), 필드별 에러, 제출 중 버튼 비활성화
   - `useMutation` 성공 시 `invalidateQueries({ queryKey: ['inquiries', listingId] })`, 폼 비우기
   - POST할 때 `createdAt`은 클라이언트가 넣어야 한다 (json-server가 자동으로 넣지 않음)
5. 추가 요구사항: 찜(Jotai `atomWithStorage`), 필터 URL 동기화, 계약완료로 변경(PATCH)
6. README 정리

## 정리하면 좋은 것 (낮은 우선순위)

- `ListPage` 카드 목록을 `<ul>`/`<li>`로 감싸고 간격은 `gap`으로 준다. 지금 `.list_card:last-child`는 카드가 `<Link>` 안의 유일한 자식이라 모든 카드에 걸린다.
- 찜 버튼을 추가할 때는 카드 전체를 감싼 `<Link>` 안에 `<button>`을 넣으면 안 된다 (인터랙티브 요소 중첩). 제목만 `<Link>`로 감싸도록 바꾼다.
- `App.tsx`의 불필요한 `<>...</>`, `path="/*"` → `path="*"`
- `StrictMode` 복구 (`main.tsx`)
- `fetchListings` 반환 타입을 `Promise<ListingsResponse>`로 바꾼다.
- 로딩/에러/빈 상태 문구에 `<h1>`, `<h4>` 대신 `<p>`를 쓴다 (`StatusView` 컴포넌트로 묶어도 된다).

## 이번 연습에서 배운 주의점

- **`fetch`는 404/500에서 reject하지 않는다.** `res.ok`를 직접 확인하고 throw해야 TanStack Query가 에러로 인식한다. (axios와 다름)
- **React 컴포넌트와 훅의 본문은 렌더마다 다시 실행된다** (Vue `setup`은 한 번). 타이머 같은 부수 효과는 `useEffect`에 넣고, cleanup으로 정리한다.
- **early return에 필터 바까지 같이 들어가면 안 된다.** 입력 중 로딩 상태가 되면 필터 바가 사라지고 포커스가 날아간다. 결과 0건이면 검색어를 지울 수도 없다. 상태별 화면은 목록 영역(`ListingList`)에서만 나눈다.
- **props를 따로 나눠 넘기면 TS가 `isPending`과 `data`의 관계를 잃는다.** `!data` 검사를 함께 넣어 좁힌다.
- **`<Routes>`는 하나만 두고 그 안에 `<Route>`를 모두 넣는다.** `<Routes>`를 여러 개 두면 각자 따로 매칭해서 `*`가 항상 함께 렌더된다.
- **CSS Modules는 `import styles from`으로 받아서 `styles.xxx`로 쓴다.** 일반 import로는 바뀐 클래스 이름을 쓸 수 없다.
- **`select`의 `e.target.value`는 `string`이다.** 유니온 필드에 넣을 때는 `as`로 단언하되, 옵션 값이 유니온 범위를 벗어나지 않게 한다. 정렬에 `""` 옵션을 두면 `SORT_PARAMS[""]`에서 런타임 에러가 난다.
- **매핑은 `Record<유니온, 값>` 상수를 컴포넌트 밖에 둔다.** 키가 빠지면 TS가 잡아 준다.
- **필터가 바뀌면 1페이지로 돌리는 처리는 핸들러에서 `setPage(1)`로 한다.** `useEffect`로 하지 않는다.
- **상수 목록은 `useState`가 아니라 모듈 상수로 둔다.**
