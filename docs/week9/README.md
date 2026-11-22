# 9주차 프론트 - Next.js로 UMCine 마이그레이션

## 실습 (nextjs-example)
`pnpm create next-app@latest nextjs-example --yes` 로 만든 Next.js 16.4.6 앱에서 확인했음.

| 확인 항목 | 결과 | 캡처 |
|---|---|---|
| 공통 레이아웃 (/new, /1) | 헤더·푸터가 모든 경로에 공통으로 표시됨 | `practice/03-dynamic-id-1.png` |
| 동적 경로 /1, /2 | id에 따라 Todo 1, Todo 2 내용이 달라짐 | `practice/03-dynamic-id-2.png` |
| Server/Client 분리 | `AlertButton`만 `"use client"`로 분리하자 오류 없이 "Hello, Next.js!" 알림이 뜸 | `practice/01-home-alert-button.png`, 분리 전 오류 `practice/05-error-onclick-in-server-component.png` |
| 메타데이터 (/new) | 탭 제목 `새 페이지 \| Next.js`, `og:title/description/image`가 head에 들어감 | `practice/02-new-metadata.png` |
| next/image 비교 (/media) | `img` 원본 image/jpeg 약 1,101kB, `Image` 최적화본 image/webp 약 15.3kB | `practice/04-media-image-font.png` |
| next/font | 제목의 font-family가 `Geist`로 적용됨 | 같은 캡처 |

`pnpm build` 결과(4.2): `○ /new`, `○ /media` 는 정적 생성(SSG), `◐ /[id]` 는 정적 껍데기 + 요청 시 서버에서 데이터를 채우는 부분 사전 렌더링(PPR)이었음.

## 미션: TanStack Router → Next.js (umcine-next)
### 1) TanStack Router 전용 API를 Next.js API로 교체
| 기존 (TanStack Router) | Next.js |
|---|---|
| `createRouter` + `RouterProvider` (`main.tsx`) | App Router가 대신함. 공통 Provider만 `app/providers.tsx` |
| `routes/__root.tsx` (`createRootRoute`, `<Outlet/>`) | `app/layout.tsx` (`{children}`), 404는 `app/not-found.tsx` |
| `routes/index.tsx`, `login.tsx` … `createFileRoute` | `app/page.tsx`, `app/login/page.tsx` … |
| `movies.$movieId.tsx` / `useParams` | `app/movies/[movieId]/page.tsx` / `await params` 후 prop으로 전달 |
| `(authenticated)/_authenticated.tsx` + `beforeLoad` + `redirect` | `app/(authenticated)/layout.tsx` + `RequireAuth` (브라우저에서 토큰 확인 후 `router.replace`) |
| `login.tsx`의 `beforeLoad` redirect | `RequireGuest` |
| `validateSearch` + `useSearch` | `useSearchParams()` + 기존 `parsePageParam` |
| `useNavigate({ to, search })` | `useRouter().push("/path?query=...")` |
| `<Link to="/movies/$movieId" params>` | `next/link` `<Link href={`/movies/${id}`}>` |
| `activeProps` / `activeOptions` | `usePathname()`으로 만든 `NavLink` |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` (`.env.local`) |
| `<img>` | `next/image` (SVG 아이콘은 `unoptimized`) |
| `index.html`의 title | `metadata` / `generateMetadata` |

`grep`으로 `@tanstack/react-router`, `import.meta`, `VITE_`가 `src`에 0건 남은 것을 확인했음. TanStack Query(서버 상태)와 Zustand(클라이언트 상태)는 그대로 사용했음.

### 2) 라이브러리 설정에서 오류가 날 수 있는 부분 수정
- **QueryClient**: 모듈 최상단에 만들면 서버에서 요청 간에 캐시가 공유될 수 있어 `Providers` 안에서 `useState(() => new QueryClient(...))`로 만들었음.
- **Zustand persist**: 서버에는 `localStorage`가 없고, 서버 HTML(토큰 없음)과 브라우저 첫 렌더가 달라지면 하이드레이션 불일치가 생김. 세 스토어에 `skipHydration: true`를 주고, 마운트 후 `useEffect`에서 `persist.rehydrate()`를 호출하게 했음. 인증 스토어에는 `hasHydrated`를 추가해서 불러오기 전에는 로그인 여부를 단정하지 않게 했음(헤더는 자리표시 막대, 가드는 아무것도 안 그림).
- **원격 이미지**: `next.config.ts`의 `images.remotePatterns`에 `image.tmdb.org`를 등록했음.
- **폴더 이름**: 기존 `src/pages`는 Next.js의 Pages Router 폴더 이름과 겹치므로 `src/views`로 바꿨음.
- **백엔드 CORS**: Next 개발 서버 주소 `http://localhost:3000`을 Spring `WebConfig`의 허용 출처에 추가했음.

### 3) Server / Client 컴포넌트 경계
| 구분 | 파일 | 이유 |
|---|---|---|
| Server | `app/layout.tsx`, 모든 `app/**/page.tsx`, `not-found.tsx`, `Footer`, `MovieCard`/`MovieGrid`/`PosterImage` | 상태·이벤트가 없음. 메타데이터는 Server에서만 export 가능. 영화 상세 `generateMetadata`가 서버에서 TMDB를 조회함 |
| Client | `Providers`, `Header`, `NavLink`, `RequireAuth/Guest`, `views/*`(각 화면), `FavoriteButton`, `BookmarkButton`, `Pagination`, `RequestState` | `useQuery`, `useState`, Zustand, `useRouter`, 클릭 이벤트, `alert/confirm` 사용 |
| 브라우저 API | `localStorage`(스토어), `alert`, `window.confirm` | 모두 Client Component 안에서 이벤트 핸들러/`useEffect`/mutation 콜백으로만 호출됨. 서버 렌더링 중에는 실행되지 않음 |

`page.tsx`에는 `"use client"`를 붙이지 않고, 화면은 `views/*` Client Component로 분리해서 `page.tsx`에서 `metadata`를 쓸 수 있게 했음.

### 4) 빌드 결과 (`pnpm build`)
```
○ /            ○ /login      ○ /members     ○ /my     ○ /my/edit
○ /search      ○ /signup     ◐ /movies/[movieId]
```
`/movies/[movieId]`만 요청 시점 값(영화 번호)이 있어 `◐`(PPR)로 나왔음.

### 5) 동작 확인 (브라우저 자동 실행, 콘솔 오류 0건)
| 시나리오 | 결과 | 캡처 |
|---|---|---|
| 로그아웃 상태로 `/my` 접속 | `/login`으로 이동 | `shots/01-…` |
| 로그인 | 헤더가 마이페이지/로그아웃으로 바뀌고 `/`로 이동, 토큰은 localStorage `umcine-auth-store` | `shots/02,03-…` |
| 인기 영화 목록 | 포스터가 `/_next/image?...` webp(약 12~25kB)로 표시, 탭 제목 `인기 영화 \| UMCine` | `shots/03b-home-list.png` |
| 영화 상세 + 즐겨찾기 + 평점 | 서버 DB(Spring)에 저장됨 | `shots/04,05-…` |
| 마이페이지 / 내 정보 수정 | `PATCH /members/me`만 전송, 닉네임 반영 | `shots/06,07,08-…` |
| 검색 | `/search?query=batman`으로 이동, 결과 20편 | `shots/10-search-results.png` |
| 로그아웃 후 `/my` | `/login`으로 이동 | `shots/09-…` |
| 목록 `?page=2`, 카드 크기 "크게" 후 새로고침 | 값 유지(Zustand persist) | - |
| 잘못된 영화 번호 `/movies/abc`, 없는 주소 | 안내 문구 / `not-found` | - |
| 영화 상세 페이지 `<title>` / OG 태그 (서버가 보낸 HTML) | 아래 "서버가 만든 head" 참고 | 텍스트 |

#### 서버가 만든 head (`curl http://localhost:3000/movies/550`)
```html
<title>파이트 클럽 | UMCine</title>
<meta name="description" content="반복되는 출장과 소비로 하루를 채우는 회사원은 …"/>
<meta property="og:title" content="파이트 클럽"/>
<meta property="og:description" content="반복되는 출장과 소비로 하루를 채우는 회사원은 …"/>
<meta property="og:image" content="https://image.tmdb.org/t/p/w1280/c6OLXfKAk5BKeR6broC8pYiCquX.jpg"/>
```

#### 폴더 구조 (`src`)
```
src/
├─ app/
│  ├─ (authenticated)/        # Route Group: 주소에 안 나타남, 로그인 가드 공통 적용
│  │  ├─ layout.tsx
│  │  └─ my/ (page.tsx, edit/page.tsx)
│  ├─ login/ signup/ members/ search/ page.tsx
│  ├─ movies/[movieId]/page.tsx
│  ├─ layout.tsx  not-found.tsx  providers.tsx  globals.css
├─ views/        # 화면(Client Component). pages/ 는 Next.js 예약 이름이라 views 로 변경
├─ components/   # auth, layout(header, nav-link, footer), movies, ratings, common
├─ api/ hooks/ stores/ utils/ config/
```

## 🎯 핵심 키워드 (~했음)
**프레임워크의 역할**
- Next.js는 TanStack Router의 "URL에 맞는 화면 연결"에 더해 서버 렌더링, 정적 생성, 이미지·폰트 최적화, 메타데이터, 서버 코드 실행(Server Component)을 한 프로젝트에서 제공했음. UMCine에서는 `index.html`의 제목 하나뿐이던 것이 페이지마다 제목/OG 이미지를 서버가 HTML에 넣어 주는 것으로 바뀌었음.
- 고객 대상 서비스처럼 검색 노출과 첫 화면 속도가 중요하면 유리하지만, 로그인 뒤에만 쓰는 사내 도구라면 서버 운영이 필요 없는 Vite SPA가 더 단순할 수 있다고 이해했음. 이번에도 로그인 상태가 localStorage에 있어서 인증 화면은 서버의 이점을 거의 못 쓰고 브라우저에서 가드를 걸어야 했음.

**Server Component와 Client Component**
- 기준: 데이터를 읽어 화면만 만들면 Server, 상태·이벤트·브라우저 API가 필요하면 Client로 나눴음. 클릭 버튼처럼 필요한 부분만 Client로 떼어 내서 브라우저로 가는 JavaScript를 줄였음.
- `page.tsx` 최상단에 `"use client"`를 써도 오류는 사라지지만, 그 파일이 import하는 것이 전부 클라이언트 코드가 되고 `metadata`/`generateMetadata`를 export할 수 없어서 UMCine에서는 화면 부분만 `views/*`로 분리했음.

**meta description / og:description**
- `description`은 검색 결과 설명으로, `og:description`은 링크를 공유할 때 미리보기 설명으로 쓰여서 서로 다르게 쓸 수 있었음. 실습 `/new`에서 두 값을 다르게 넣고 head에서 확인했음.

**렌더링 방식**
- `"use client"`가 붙은 Client Component도 첫 HTML은 서버에서 한 번 렌더링하고, 브라우저에서 하이드레이션하는 것을 확인했음. 그래서 `localStorage` 같은 브라우저 API는 렌더링 중이 아니라 `useEffect`/이벤트에서만 쓰게 했음.
- SSG는 빌드 때 만들어 두는 방식(`○ /new`), SSR은 요청마다 서버에서 만드는 방식, `◐`는 정적 껍데기를 먼저 주고 동적 부분만 채우는 PPR이었음. ISR(Incremental Static Regeneration)은 정적으로 만든 페이지를 일정 시간 뒤/요청 시 다시 만드는 방식으로 알고 있음. ISSG는 공식 문서에서 정확한 정의를 확인하지 못했고, 일부 페이지만 빌드 때 만들고 나머지는 첫 요청 때 만들어 저장하는 방식을 가리키는 것으로 보여서 더 조사할 예정임.

## 📢 학습 후기 (~했음)
1. 라우팅 파일 이름만 바꾸면 끝날 줄 알았는데, 로그인 상태가 localStorage에 있어서 "서버에서 한 번 그려지는 코드"와 "브라우저에서만 되는 코드"를 구분해야 했고, 그 경계를 직접 정하는 것이 마이그레이션의 핵심이었음.
2. 같은 컴포넌트를 거의 그대로 쓰면서 `Link`, `useRouter`, `useSearchParams`로 바꾸는 작업은 기계적이었지만, 로그인 가드(`beforeLoad`)처럼 대응되는 기능이 없는 부분은 구조를 다시 설계해야 했음.
3. 이미지를 `next/image`로 바꾸자 같은 포스터가 webp 12~25kB로 내려가는 것을 Network에서 직접 확인해서 최적화의 효과를 체감했음.

## ⚡ 트러블슈팅 (~했음)
### No.1 Server Component에서 onClick
- **이슈**: `app/page.tsx`의 `<button onClick={...}>`에서 빌드 중 다음 오류가 났음.
  `Error: Event handlers cannot be passed to Client Component props. If you need interactivity, consider converting part of this to a Client Component.`
- **원인**: 페이지가 Server Component인데 브라우저 이벤트 핸들러를 연결했음.
- **해결**: 버튼만 `app/components/alert-button.tsx`로 옮기고 첫 줄에 `"use client";`를 선언한 뒤 page에서 import했음. 빌드가 통과하고 클릭하면 알림이 뜸.
- **배운 점**: 상호작용이 필요한 부분만 Client로 분리하면 페이지 전체를 Client로 만들지 않아도 됨.
- 참고: https://nextjs.org/docs/app/getting-started/server-and-client-components

### No.2 usePathname()이 Suspense 밖에 있음
- **이슈**: UMCine 마이그레이션 중 `pnpm build`가 다음 오류로 실패했음.
  `Error: Route "/movies/[movieId]": Next.js encountered URL data usePathname() in a Client Component outside of <Suspense>. This blocks prerendering because the value is only available at runtime.` (digest: `CLIENT_HOOK_DYNAMIC`)
- **원인**: 공통 레이아웃의 `Header`(안의 `NavLink`)가 `usePathname()`을 쓰는데, 동적 경로(`/movies/[movieId]`)에서는 이 값이 요청 시점에야 정해져서 정적으로 미리 만들 수 없었음.
- **해결**: `app/layout.tsx`에서 `<Header />`를 `<Suspense fallback={<div className="h-20" />}>`로 감쌌음. 같은 이유로 `useSearchParams()`를 쓰는 목록/검색 화면도 `page.tsx`에서 Suspense로 감쌌음. 빌드 통과.
- **배운 점**: 요청 시점에야 알 수 있는 값(params, searchParams, pathname)을 읽는 부분은 Suspense 경계 안에 둬야 나머지 화면을 미리 만들 수 있음.
- 참고: https://nextjs.org/docs/messages/blocking-prerender-client-hook

### No.3 ESLint react/no-unescaped-entities
- **이슈**: `pnpm lint`가 `'{normalizedQuery}' 검색 결과`에서 `` `'` can be escaped with `&apos;`... react/no-unescaped-entities`` 오류를 냈음.
- **원인**: Next.js 기본 ESLint 설정은 JSX 텍스트의 홑따옴표를 허용하지 않음.
- **해결**: `&apos;`로 바꿨음.
- **배운 점**: Vite 프로젝트에서 통과하던 린트 규칙도 Next 기본 설정에서는 달라질 수 있어서 마이그레이션 후 `pnpm lint`를 따로 돌려야 함.

## 참고
- 환경 변수: `NEXT_PUBLIC_`이 붙은 값은 브라우저로 내려가므로 TMDB 토큰이 노출되는 점은 기존 `VITE_` 때와 같음. 서버에서만 쓰려면 접두사 없는 변수와 Route Handler 같은 서버 코드로 옮겨야 하며 이번 미션 범위에서는 하지 않았음.
- 실행: 백엔드(Spring) 8080을 켠 상태에서 `pnpm build && pnpm start`, `http://localhost:3000`

