# 10주차 프론트 - Vercel 배포로 UMCine 제공하기

> 배포 전에 준비한 내용과 배포 순서, 그리고 배포 주소에서 확인한 미션 점검표입니다.

## 1. 배포 전에 확인한 것 (로컬 프로덕션 빌드, 백엔드 꺼진 상태)
| 항목 | 결과 |
|---|---|
| `pnpm build` | 통과 (`○` 정적 페이지 + `/movies/[movieId]` `◐`) |
| TMDB만 쓰는 화면 (목록 20편, 상세, 검색 20편) | 백엔드 없이도 정상 |
| 백엔드가 필요한 화면 (로그인, 회원 확인) | 연결 실패 시 "로그인에 실패했어요" 안내 후 앱은 멈추지 않음 |
| 코드에 박힌 `localhost` | `src/config/env.ts`의 백엔드 기본값 1곳뿐 (환경 변수로 덮어씀) |
| 필요한 환경 변수 | `.env.example` 참고 (`NEXT_PUBLIC_TMDB_API_BASE_URL`, `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`, `NEXT_PUBLIC_BACKEND_API_BASE_URL`) |

고친 것: 백엔드 주소 환경 변수가 빈 문자열이면 요청 주소가 깨지던 부분을 "없음"으로 보고 기본값을 쓰게 했음.

## 2. 배포 순서
1. GitHub에 Next.js 프로젝트가 `main`(운영 브랜치)에 반영되어 있어야 함. (Vercel은 운영 브랜치를 기준으로 배포)
2. Vercel 대시보드 **Create New → Project** → GitHub 저장소 **Import**
3. **Application Preset = Next.js**, **Root Directory = `./`** 확인. 빌드/설치 명령은 자동 설정 (lock 파일이 `pnpm-lock.yaml`이라 pnpm 사용)
4. **Environment Variables**에 아래 3개 등록, Environments는 **Production and Preview**
5. **Deploy** → 완료 화면 → 대시보드 **Domains**의 `.vercel.app` 주소로 접속

| Key | Value |
|---|---|
| `NEXT_PUBLIC_TMDB_API_BASE_URL` | `https://api.themoviedb.org/3` |
| `NEXT_PUBLIC_TMDB_ACCESS_TOKEN` | 로컬 `.env.local`의 TMDB 토큰 |
| `NEXT_PUBLIC_BACKEND_API_BASE_URL` | 배포한 백엔드 주소 (아래 3번 참고) |

환경 변수를 등록하지 않으면 빌드가 `TMDB 환경 변수가 필요해요.`로 실패함. 값을 바꾼 뒤에는 **재배포**해야 반영됨(`NEXT_PUBLIC_`은 빌드 때 코드에 박힘).

## 3. 알아둘 제약: 백엔드 연결
- 프론트는 `https://….vercel.app` (HTTPS)인데 10주차 백엔드 실습은 `http://{EC2_IP}:8080` (HTTP)라서, 브라우저가 HTTP API를 **혼합 콘텐츠**로 막을 수 있음. (백엔드 워크북에도 같은 안내가 있음)
- 백엔드는 CORS 허용 목록에 Vercel 주소(`https://프로젝트.vercel.app`, 경로 없이)를 넣어야 함. 지금은 `localhost:5173`, `localhost:3000`만 허용됨.
- 백엔드가 아직 배포되지 않았다면, Vercel에서는 TMDB 기능(목록/상세/검색)만 동작하고 로그인/즐겨찾기/평점은 동작하지 않음.
- 해결 방법: ① 백엔드도 HTTPS로 제공하기, ② Next.js `rewrites`로 Vercel 서버가 HTTP 백엔드로 대신 요청하게 하기(브라우저는 같은 주소로만 요청하므로 혼합 콘텐츠와 CORS가 모두 사라짐). 백엔드 주소가 정해지면 ②를 적용할 수 있음.

## 4. 새 내용 배포해 보기 (워크북 3.5)
1. 홈 화면의 영화 목록 문구 `인기 영화`를 `지금 인기 있는 영화`로 수정 (`src/views/movies/movie-list-page.tsx`의 `<h2>`)
2. 커밋하고 운영 브랜치에 푸시
3. Vercel **Deployments**에서 새 배포가 생기고 **Ready**가 되는지 확인
4. 기존 `.vercel.app` 주소를 새로고침해서 문구가 바뀐 것을 확인

## 5. 필수 미션 점검표: 배포 주소에서 로컬과 동일하게 동작하는지
배포 주소: https://umcine-chi.vercel.app (스크린샷: `screenshots/`)

| 기능 | 로컬 | 배포 | 비고 |
|---|---|---|---|
| 영화 목록, 페이지 이동, 카드 크기 유지 | ✅ | ✅ 목록·2페이지 이동 정상 (`10-list-page2.png`) | |
| 영화 상세 + 포스터 최적화(`/_next/image`) | ✅ | ✅ 포스터 20장이 `/_next/image`로 webp 응답 (`04-detail-before.png`) | |
| 검색 | ✅ | ✅ `/search?query=inception` 정상 (`11-search.png`) | |
| 회원가입 / 로그인 | ✅ | ✅ 로그인 성공 알림과 헤더 변경 (`03-after-login-header.png`) | 백엔드 필요 |
| 로그인 가드 (`/my` → `/login`) | ✅ | ✅ 로그아웃 상태 `/my`가 `/login`으로 이동 (`01`, `09`) | |
| 즐겨찾기 / 평점 | ✅ | ✅ 등록 알림 확인 (`05-detail-favorite-and-rating.png`) | 백엔드 필요 |
| 마이페이지 / 내 정보 수정 | ✅ | ✅ 저장 때 `PATCH /api/backend/members/me`만 나감 (`06`, `07`, `08`) | 백엔드 필요 |
| 없는 주소 `not-found`, 상세 페이지 OG 태그 | ✅ | ✅ 없는 주소는 안내 화면(`12`), 상세에 `og:title`, `og:image` 있음 | |

## 🎯 핵심 키워드 (~했음)
**배포**
- 배포는 내가 만든 서비스를 인터넷에서 접근할 수 있는 서버에 올려 누구나 쓰게 하는 일이었음. `localhost`는 "지금 접속하는 컴퓨터 자신"을 가리키는 이름이라, 다른 사람이 `localhost:3000`을 열면 그 사람 컴퓨터에 접속하므로 내 서비스가 보이지 않음.
- 직접 배포하려면 서버 준비, 외부에서 접속 가능한 IP와 방화벽(포트) 설정, 도메인과 DNS 연결, HTTPS 인증서 발급·갱신이 필요함.

**Vercel**
- 위의 서버·네트워크·HTTPS 관리를 대신해 줘서, 저장소만 연결하면 빌드와 배포가 자동으로 되기 때문에 사용함. Next.js를 만든 회사라 Next.js와 잘 맞음.
- 제공 기능: Git 저장소 연결 자동 배포, Preview(별도 주소로 변경 확인), 롤백(이전 운영 배포 복구), 기본 `.vercel.app` 주소와 HTTPS, 커스텀 도메인 연결.
- 비슷한 서비스: Netlify, Cloudflare Pages, AWS Amplify, Render, Railway 등.

## 📢 학습 후기 (~했음)
1. 로컬에서 되던 것이 배포 주소에서는 환경 변수, 혼합 콘텐츠, CORS가 모두 맞아야 동작해서 확인할 것이 많았음.
2. 로컬 점검 때 이미 `rewrites` 프록시로 브라우저가 한 호스트로만 요청하게 해 두어서, HTTPS 프론트에서 HTTP 백엔드를 부르는 문제는 겪지 않았음.
3. 배포는 CLI(`vercel --prod`)로 했고, 문구를 `인기 영화`에서 `지금 인기 있는 영화`로 바꿔 재배포하자 같은 주소에 바로 반영되는 것을 확인했음 (`screenshots/13-text-change-redeployed.png`).

## ⚡ 트러블슈팅 (~했음)
### No.1 배포 주소에서만 로그인이 403
- **이슈**: 배포 주소에서 로그인하면 `POST /api/backend/auth/login`이 403이고 "로그인에 실패했어요"가 떴음. 같은 요청을 curl로 보내면 201/200으로 성공했음.
- **원인**: 브라우저는 요청에 `Origin: https://umcine-chi.vercel.app`을 붙이는데, 백엔드 CORS 허용 목록(`FRONTEND_ORIGIN`)에 실제 배포 도메인이 없었음(예상 주소로 넣어 둔 값이 달랐음). curl은 Origin이 없어서 통과했던 것임.
- **해결**: SSM 파라미터와 서버 환경 파일의 `FRONTEND_ORIGIN`을 실제 주소로 바꾸고 서비스를 재시작했음. 사전 요청(OPTIONS)이 200이 되고 로그인, 평점, 즐겨찾기, 내 정보 수정이 모두 성공했음.
- **배운 점**: 프록시를 써도 브라우저가 붙인 Origin은 백엔드까지 전달되므로, 배포 도메인이 확정된 뒤 허용 목록을 맞춰야 함. 서버끼리 부르는 테스트로는 CORS 문제가 보이지 않음.

### No.2 Vercel 환경 변수에 토큰 이름이 달라 빌드 실패 위험
- **이슈**: 토큰을 `TMDB_ACCESS_TOKEN`(비공개)으로 저장하면 브라우저 코드가 읽는 `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`이 비어 앱이 시작하지 못함.
- **해결**: 이 프로젝트는 브라우저에서 TMDB를 직접 부르므로 `NEXT_PUBLIC_` 이름 그대로 저장했음.
- **배운 점**: `NEXT_PUBLIC_`은 방문자에게 노출되므로 읽기 전용 토큰만 써야 함.
