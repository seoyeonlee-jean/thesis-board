# 완료 기준 및 GitHub 게시 전 점검

## 기능 기준 변경 안내 (2026-09-22, 2차 수정 명세)

최신 기능 완료 기준은 [docs/progress.md](docs/progress.md)의 24개 항목이다. 아래 과거 기능 감사의 사전 컨택·조교 배정·행정실 확정 검토·전공 통합 다음 할 일 등은 당시 명세의 이력이며 현재 동작이나 요구사항이 아니다. 현재는 교수 승인 즉시 해당 전공 진행, 수강 분반 기반 지도교수, 조교의 절차·공지 게시 및 읽기 전용 학생 조회를 사용한다. 이번 기능 수정에서 의존성 버전은 변경하지 않았으며 보안 감사 수치는 아래 이전 실행 결과를 보존한 것으로, 새로 감사한 수치가 아니다.

## 최신: npm 통일 및 critical·high 수정 (2026-09-22)

사용자 요청에 따라 npm/package-lock.json으로 통일했다. pnpm-lock.yaml 및 빌드 승인 placeholder만 담긴 pnpm-workspace.yaml을 삭제했으며 Git 이전 커밋에서 복구할 수 있다. 기존 .pnpm-store 캐시는 삭제하지 않고 Git 제외 설정을 유지한다. 아래 표의 심각도는 **수정 전 7개 패키지 감사 항목** 기준이다. 동일 취약점이 상위 패키지에 전파되므로 7개의 독립적인 취약점을 뜻하지 않는다.

| 감사 항목 | 수정 전 심각도 | 배포된 사이트 영향 / 사용 구분 | 메이저 변경 필요 여부 | 처리 및 남은 사유 |
|---|---|---|---|---|
| vitest | critical | 개발 테스트 전용. 테스트 UI/API 서버 노출 시 파일 읽기·실행 위험이며 프로덕션 페이지 실행 도구가 아님 | critical 수정은 불필요(3.2.6); 남은 moderate는 4.1.11 이상 필요 | 3.2.4 → 3.2.6. critical 제거, mocker 관련 moderate는 범위 밖·메이저 변경 필요로 보류 |
| @vitest/mocker | moderate | Vitest 개발 서버 플러그인. 현재 Node 환경 테스트에서 UI/브라우저 모드 서버를 배포하지 않음 | 필요: 공식 수정 4.1.11, 3.x 백포트 예정 없음 | Vitest 필수 동반 의존성으로 3.2.6까지 갱신됐으나 별도 major override 없이 보류 |
| @playwright/test | high | E2E 개발 도구 전용. 배포 사이트 요청 처리에는 사용하지 않음 | 불필요 | 1.55.0 → 1.55.1, 하위 playwright의 브라우저 다운로드 인증서 검증 문제 해결 |
| playwright | high | 개발 환경의 브라우저 다운로드·테스트 실행. 프로덕션 앱에 직접 사용하지 않음 | 불필요 | @playwright/test와 함께 1.55.1로 갱신, 감사 항목 제거 |
| postcss | high | 빌드/개발 시 CSS 처리. Next.js에도 포함되지만 이 앱은 요청 시 외부 CSS를 파싱하지 않음. 악성 CSS·소스맵 입력은 빌드 환경에 영향 가능 | 불필요: 같은 8.x 수정. npm의 Next 16 제안 대신 PostCSS override 적용 | 8.5.6 및 Next의 8.4.31 → 8.5.18. high 제거. 후속 moderate(8.5.23 수정)는 사용자 범위 밖이라 보류 |
| next (via postcss) | moderate | Next 서버는 실행 의존성. 이번 항목의 원인은 CSS 처리 하위 의존성으로, Next 자체 RSC 경고와 다름 | PostCSS override 경로는 불필요. npm 자동 제안은 Next 16.3.5(major)이므로 미적용 | Next 15.5.24 유지. high PostCSS 수정의 동반 효과만 반영하고 잔여 moderate 보류 |
| sharp | high | Next 이미지 최적화의 실행 의존성. 악성 이미지 처리 시 서버 영향 가능. 현재 앱에는 next/image·사용자 이미지 업로드 없음 | 불필요: major 0 유지, 0.35.4는 Next 허용 범위. 단 0.x minor 변경·Node 최소 버전 상승 주의 | 0.34.5 → 0.35.4, libvips/libheif 관련 경고 제거. Node >=20.9 필요, 실제 PNG→JPEG 변환도 확인 |

근거: npm audit JSON 및 로컬 package.json/의존성 트리/앱 import 검사. 공식 공지는 [Vitest critical](https://github.com/vitest-dev/vitest/security/advisories/GHSA-5xrq-8626-4rwp), [mocker moderate](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9), [PostCSS high](https://github.com/postcss/postcss/security/advisories/GHSA-r28c-9q8g-f849), [PostCSS 후속 moderate](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp), [sharp high](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c)를 확인했다. 배포 영향 평가는 현재 코드와 실행 구성에 대한 판단이며 해당 라이브러리의 모든 사용 방식이 안전하다는 뜻은 아니다.

### 최종 감사 잔여 항목

`npm audit --json`: critical 0 / high 0 / moderate 11 / low 0. 종료 코드 1은 아래 moderate가 남았기 때문이다. moderate만 없애기 위한 추가 업그레이드나 audit fix --force는 실행하지 않았다.

| 남은 원인 | 보고된 패키지 항목 | 미수정 사유 |
|---|---|---|
| GHSA-82fw-gwwq-j7x9 (moderate) | vitest, @vitest/mocker (2개) | 공식 수정은 4.1.11 이상. major 변경 및 moderate 수정은 이번 범위 밖. UI/API·HMR 서버를 외부에 노출하지 않을 것 |
| GHSA-fxqj-rqcc-2cmp (moderate) | postcss, next, autoprefixer, postcss-import, postcss-js, postcss-load-config, postcss-nested, tailwindcss, vite (9개) | 8.5.18로 high만 수정했으며 후속 moderate 수정은 범위 밖. 8.5.23으로 해결 가능하나 이번에는 기록만 남김. 신뢰할 수 없는 CSS·소스맵 처리 금지 |

7 → 11은 보안 문제가 4개 새로 추가되었다는 뜻이 아니다. 수정 전 high/critical이 사라진 뒤 남은 PostCSS moderate가 통합된 의존성 트리의 여러 소비자에 전파되어 집계된다. 모든 11개 항목을 숨기지 않고 기록했다.

### 설치 및 재검증

- package.json의 직접 수정: @playwright/test 1.55.1, vitest 3.2.6, postcss 8.5.18. overrides: postcss 8.5.18, next 아래 sharp 0.35.4. 앱 코드는 변경하지 않음.
- npm 잠금 파일 갱신 후 `npm ci`로 기존 node_modules를 재구성: 종료 0, 160개 설치. npm ls에서도 지정 버전·override 적용 확인. pnpm에 의존하지 않음.
- 초기 `$postcss` 참조형 override를 npm이 해석하지 못해 동일한 명시 버전으로 수정한 뒤 설치 성공. 비활성화된 인증서 검증이나 감사 무시는 사용하지 않음.
- Node 24.19.0 / npm 10.9.3. sharp 네이티브 로딩과 2×2 PNG → 1×1 JPEG 변환 성공(267 bytes).
- `npm test`: Vitest 3.2.6, 34/34 통과(데이터 완결성 포함).
- `npm run build`: Next 15.5.24, 타입 검사 및 7개 정적 페이지 생성, 종료 0.
- `CI=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3107 npm run test:e2e`: Chromium 13/13 통과. 첫 실행은 새 Playwright가 요구하는 Chromium 1193 미설치로 브라우저 시작 전 실패했으며, 공식 Chromium 설치 후 전체 재실행 성공.
- 잠금 파일의 로컬 file 링크 0건, pnpm 잠금/워크스페이스 파일 없음, 설치된 next가 pnpm 심볼릭 링크가 아닌 npm 디렉터리임을 확인. `git diff --check` 통과.

이하 이전 감사는 당시 결과의 이력으로 보존한다. 현재 의존성 상태는 이 최신 절을 기준으로 한다.

검증일: 2026-09-21. 기존 감사의 실패 두 건 수정에 이어, 남은 완료 범위 기능을 구현하고 전체 테스트를 재실행했다. 승인·확정 해석은 사용자의 후속 지시에 맞춰 아래 표와 README에 반영했다.

기존 감사에서 남긴 완료 범위의 기능 누락은 아래와 같이 구현·검증했다. 사람 평가 3개는 에이전트 완료 기준에서 제외되어 미확인으로 남긴다. 현재 /goal 도구에는 원문이 보존되어 있지 않아, 기존 감사에 기록된 완료 기준 및 제외 범위를 기준으로 분류했다. 패키지 보안 유지보수는 별도이며 공개 배포 준비 완료를 뜻하지 않는다.

이전 검증이 놓친 이유: 행정실 검토 이후 결과만 확인하고 교수 승인 직후 안내·다음 할 일 및 요건 누락 데이터를 검사하지 않았기 때문이다.

## 완료 확인 기준

| 항목 | 결과 | 방법 / 테스트 이름 | 근거 |
|---|---|---|---|
| 입력 전공·학과 데이터로 로드맵 생성 | 통과 | rules: 선택한 필수 전공의 로드맵만 생성한다 | 심리·기계 조합 반환, 브라우저에서도 두 카드 표시 |
| 복수전공 면제는 로드맵 미생성 | 통과 | rules: 복수전공 면제 전공은 로드맵을 만들지 않는다 | 사회학 복수전공의 결과 길이 0 |
| 전공 통틀어 가장 급한 다음 할 일 | 통과 | rules: 전공 통틀어 가장 이른 마감을 다음 할 일로 선택한다 | 10/08 심리 선택; 확정 후 화면에서 10/10 기계로 변경 |
| 정원 마감 교수에게 신청 불가 | 통과(UI·상태 전이) | rules: 정원이 찬 교수에게 신청·승인할 수 없다; completion: 상태 함수에서도 정원 마감 신청 차단; board 정원 E2E | disabled 및 store가 사용하는 순수 transition의 요청 거부 확인 |
| 남은 자리 0이면 승인 불가 | 통과 | 같은 규칙 테스트; board: 정원 마감 교수의 승인 버튼은 비활성이다 | canApprove=false, 교수 버튼 disabled |
| 배정 인원보다 작은 정원 설정 불가 | 통과 | rules: 정원을 배정 인원보다 작게 정할 수 없다 | 배정 1명인 교수의 정원 0 거부 |
| 교수 승인 직후 승인·검토 중 표시 및 다음 할 일 변경(사용자 해석) | 통과 | audit: 교수 승인 직후 단계 유지 및 검토 중 다음 할 일 표시; PC·모바일 E2E | 신청 상태 승인·행정실 확정 검토 중·결과 대기 안내 표시. 지도교수 확정 단계는 유지 |
| 정원 사용 학과만 승인 시 배정 +1 | 통과 | audit: 정원 사용 학과만 승인 시 배정 인원 증가 | store 실제 승인 실행; 사회학 +1, 심리 및 나머지 변화 없음 |
| 수정·면담·반려·보완 요청의 빈 피드백 거부 | 통과 | audit: 4개 상태별 빈 피드백 거부; e2e/audit: 빈 피드백 | 공백 문자열 false. 브라우저에서 교수 3종 및 행정실 보완 요청 시 경고 발생 |
| 행정실 검토 완료 시 지도교수 확정 | 통과 | audit: 행정실 검토 완료 후 해당 전공 확정; board 대표 흐름 | 심리 첫 단계 완료·논문 작성 진행 필요; 기계 첫 단계 유지 |
| 모든 학과 요건·공식 링크·모든 단계 마감 존재 | 통과 | data: 모든 학과의 요건·공식 링크·단계 마감일이 있다 | 3개 학과의 양쪽 요건과 링크 값, 모든 단계 날짜 검사. 빈 값이면 해당 assertion 실패 |
| E2E 1: 초기화→시작→입력→요청→교수 승인·검토 중→행정실 확정 | 통과 | e2e/audit: 1440px 및 390px 대표 흐름 레이아웃과 빈 피드백 | 승인 직후 안내와 단계 유지, 검토 후 심리만 다음 단계 이동·기계 유지 확인 |
| E2E 2: 수정 요청 피드백 즉시 표시 | 통과 | board: 수정 요청 피드백은 즉시 학생 화면에 표시된다 | 입력한 문구를 학생 화면에서 확인 |
| E2E 2: 반려 피드백 즉시 표시 | 통과 | board: 반려 피드백은 즉시 학생 화면에 표시된다 | 입력한 문구를 학생 화면에서 확인 |
| E2E 3: 정원 마감 학생·교수 버튼 비활성 | 통과 | board의 정원 관련 2개 테스트 | 양쪽 disabled 확인 |
| 직접 확인: 빈 피드백 입력 거부 | 통과 | e2e/audit, 실제 Chromium 조작 | PC·390px 모두 경고 4회, 승인·확정 단계까지 조작 가능 |
| 직접 확인: 예시 데이터 배지 | 통과 | e2e/audit 및 캡처 육안 확인 | 두 로드맵의 배지 2개 확인 |
| 정보 누락 시 정보 확인 필요 표시 | 통과(렌더링) | audit: officialLink/dueDate/requirement 누락 정보 확인 필요 렌더링 | 빈 값을 주입한 StudentBoard 렌더링에서 세 종류 모두 안내 출력. 주전공·복수전공 누락과 면제 구분도 검사. 브라우저 누락 데이터 주입은 미수행 |
| PC·390px 대표 흐름 레이아웃 | 통과 | e2e/audit 가로 넘침 검사 + 캡처 확인 | 학생·교수·승인 직후·행정실·확정 학생 화면의 조작과 폭 검증 |
| npm run build | 통과 | npm 10.9.3으로 run build 실행 | 종료 코드 0, 7개 정적 페이지 생성 |
| README 실행법·3분 대본·질문·데이터 교체법 | 통과 | README 직접 확인 | 승인·확정 구분과 요건 누락 가정 기록, 시연 대본도 새 해석 반영 |
| 사람이 수행할 3분 시연 리허설 | 미확인(제외) | 수행 안 함 | 원래 에이전트 완료 기준에서 제외 |
| 사람이 전공 입력 후 1분 내 절차 이해 | 미확인(제외) | 수행 안 함 | 사람 평가 필요 |
| 참여자 5명 중 4명 이상 다음 할 일 정답 | 미확인(제외) | 수행 안 함 | 사람 평가 필요 |

## 남은 미구현 항목의 범위 분류 및 완료 확인

| 기존 미구현 항목 | 범위 분류 | 현재 결과 | 확인 방법 / 근거 |
|---|---|---|---|
| 단일 전공 시작 | 완료 상태·확인 기준 | 통과 | E2E `단일 전공 생성과 컨택 기록·새로고침 유지`: 복수전공 없이 카드 1개 생성 |
| 전공별 탭·캘린더 색 | 완료 상태·확인 기준 | 통과 | E2E `전공별 탭·캘린더 색·문의처`: 탭 전환 카드 수와 실제 CSS 배경색 차이 검사 |
| 면제 전공 표시 | 완료 상태·확인 기준 | 통과 | E2E `면제 전공 표시와 로드맵 미생성`: 면제 안내와 카드 1개 확인 |
| 교수 컨택 완료 기록 | 완료 상태·확인 기준 | 통과 | completion `컨택 기록 전 요청 차단 및 기록 후 허용`; E2E 새로고침 후 기록 유지 |
| 제출 서류·문의처 출력, 제출 상태 변경 | 완료 상태·확인 기준 | 통과 | E2E `전공별 탭·캘린더 색·문의처`, `제출 상태 변경이 학생·행정실 및 새로고침에 반영`; 순서·중복 제출 거부 단위 테스트 |
| 모든 마감의 같은 달력 주 충돌 | 완료 상태·확인 기준 | 통과 | completion `모든 단계에서 같은 달력 주 충돌 검사`: 이후 단계 충돌 및 일요일/월요일 경계 검사 |
| 필터 반영 현황·미신청 학생 집계 | 완료 상태·확인 기준 | 통과 | completion `미신청 학생 포함 학과별 집계 및 전공 분리`: 전체 8명/10전공, 사회학 3명·미신청 2명. E2E 카드 수치 확인 |
| 학생별·전공별 진행 및 변경 시각 | 완료 상태·확인 기준 | 통과 | 제출·행정실 E2E: 다음 단계·제출 시간 표시, time의 datetime 확인. transition의 actor·at 검사 |
| 수업 배정 결과 교수 표시 | 완료 상태·확인 기준 | 통과 | E2E `행정실 필터·미신청자·수업 배정과 학생 결과`: 배정 교수명·중간발표 단계 확인. 다른 전공 불변 단위 테스트 |
| 중복 승인·정원 우회 방지 | 완료 상태·확인 기준 | 통과 | completion `중복 승인 시 인원 및 이력 중복 증가 방지`, `정원이 마지막 한 자리일 때 두 번째 승인 차단`, `상태 함수에서도 정원 마감 신청 차단` |
| 실제 정보 수집·인증·DB·외부 API·실제 다중 사용자 동기화 | 이번에 하지 않을 일 | 제외 | README 남은 한계에 기록, 브라우저 데모 상태만 유지 |
| 실제 파일 업로드·이메일·알림 발송 | 이번에 하지 않을 일 | 제외 | 제출 상태·시각만 기록. 실제 전송은 구현하지 않음 |
| 학과 편집·학생 명단 등록·요건 관리·공지 등록·내보내기 | 이번에 하지 않을 일 | 제외 | 행정실 준비 중 메뉴 및 README 남은 한계 |
| 사람 리허설·이해도·5명 사용자 평가 | 에이전트 완료 확인 제외 | 미확인 | 실제 참여자 평가를 수행하지 않았으며 자동 테스트로 대체 판정하지 않음 |
| Next.js 취약 버전 경고 | 별도 보안 유지보수 | 기존 경고 해결 | 15.5.24로 패치 업데이트. 전체 의존성 감사의 잔여 경고는 아래 별도 기록 |

이전 통과 표가 누락을 놓친 이유: 기본 경로의 부분 결과만 검사했고, 미신청 집계·중복 호출·컨택 기록·전공 탭 및 전체 일정 충돌을 검증하는 테스트가 없었기 때문이다.

## 실행 결과와 재현

- `npm test`: 기존 규칙 7개 + 데이터 완결성 1개 + 감사 회귀 13개 + 완료 범위 회귀 13개, **34개 전부 통과**. Node 테스트에서는 localStorage가 없어 Zustand 경고가 나오지만, 브라우저 E2E에서 역할 전환 상태 공유와 새로고침 복원을 검증했다.
- `CI=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3107 npm run test:e2e`: 기존 6개 + PC·모바일 회귀 2개 + 완료 범위 5개, **13개 전부 통과**. 신규 폼 선택자 실패는 select의 명시적 aria-label 추가 후 전체 재실행해 해결했다.
- `npm run build`: 통과(종료 코드 0). 승인 직후 단계 이동 기대는 사용자의 명시적 해석에 따라 단계 유지·검토 중 안내로 수정했고, 검토 완료 후 해당 전공만 이동하는 검증을 유지했다.
- Node v24.19.0, npm 10.9.3. 이 호스트의 PATH에 Node/npm이 없어 번들 Node와 임시 npm의 npm-cli.js를 사용했다. npm run build는 실제 npm 스크립트로 실행했다.

일반 Node/npm 환경:

```sh
npm test
npm run build
CI=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3107 npm run test:e2e
node scripts/audit-secrets.mjs
```

Playwright는 빌드한 프로덕션 서버를 전용 포트에서 시작한다. 실행 중인 개발 서버와 빌드 결과를 공유하는 문제를 피한다. 스크린샷은 test-results/audit-감사-1440px-대표-흐름-레이아웃과-빈-피드백/ 및 390px 대응 폴더에 student.png, professor.png, approved.png, admin.png, confirmed.png로 저장되며 Git에서는 제외된다.

## Next.js 보안 패치 후 재검증 (2026-09-21)

- 변경: `next` 15.5.2 → 15.5.24. package.json, package-lock.json, pnpm-lock.yaml 동기화. 다른 직접 의존성 버전과 앱 코드는 변경하지 않음.
- 기존 npm deprecation은 [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)의 RSC/App Router 원격 코드 실행 취약점 안내였다. 해당 수정은 15.5.7에 들어갔으나 15.5.7·15.5.8에도 후속 DoS·소스 노출 관련 경고가 있다.
- npm 레지스트리 조회상 경고 문구가 없는 최초 패치는 15.5.9이다. 다만 [2026년 8월 공식 공지](https://nextjs.org/blog/august-2026-security-release)에서 추가 Critical 문제의 최소 수정 버전을 15.5.24로 지정하므로 보안 수정 기준의 최소 패치로 15.5.24를 선택했다. 15.5.25는 수정된 sharp 사용 시 AVIF 최적화를 다시 켜는 후속 릴리스여서 이번에는 올리지 않았다.
- 설치된 Next.js·manifest·npm lock 모두 15.5.24이며 deprecated 필드는 없다. pnpm 설치는 패키지 갱신 뒤 기존 esbuild/sharp 빌드 스크립트 미승인 경고로 종료 코드 1이었고, 스크립트 실행 권한을 확대하지 않았다. 아래 실제 빌드·테스트는 모두 통과했다.

| 확인 방법 | 결과 | 근거 |
|---|---|---|
| npm test | 통과 | Vitest 34/34, 데이터 완결성 1개 포함 |
| npm run build | 통과 | Next.js 15.5.24 출력, 타입 검사·정적 페이지 7개 생성, 종료 0 |
| CI=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3107 npm run test:e2e | 통과 | Chromium 13/13, 업데이트된 프로덕션 빌드 사용 |
| npm audit --json | 잔여 경고 있음 | 7개 패키지 항목: critical 1, high 4, moderate 2. 종료 1 |

남은 감사 항목은 Vitest·@vitest/mocker, Playwright·@playwright/test, PostCSS, sharp 및 PostCSS로 전파된 Next.js 항목이다. Next.js 항목의 via는 `postcss`이며 기존 RSC 취약점은 더 이상 보고되지 않는다. 현재 Next.js 패치가 모든 하위 의존성 취약점까지 없앤다고 주장하지 않는다. 자동 audit fix나 메이저 업그레이드는 수행하지 않았다. Node 테스트의 localStorage 경고와 E2E 색상 환경 변수 경고는 테스트 실패가 아니다.

## GitHub 게시 전 점검 원본 기록 (513d5b2)

| 점검 | 결과 | 근거 |
|---|---|---|
| API 키·토큰·비밀번호 의심 문자열 | 패턴 검사 발견 0 | scripts/audit-secrets.mjs로 추적·미추적 프로젝트 파일 및 모든 refs의 Git blob 검사. 값 대신 경로·행·규칙만 출력 |
| 숨은 .env·개인키 파일 | 발견 0 | 숨김 파일 포함 파일명 검색. node_modules·.pnpm-store·.next 등 생성물/외부 의존성은 제외 |
| package.json | 기존 커밋됨 | git ls-files 확인 |
| package-lock.json | 이번에 생성·커밋 | 기존에는 pnpm-lock.yaml만 있었음. 동일 package.json을 임시 폴더에서 npm으로 해석해 생성; 루트 의존성 일치·로컬 링크 없음 확인 |
| .gitignore | 보완 | node_modules/·.next/ 기존 존재, .env* 추가. git check-ignore로 .env, .env.local, .env.production 제외 확인 |
| 미커밋 파일 | 이번 커밋에 포함 | 기존 AGENTS.md 및 docs/ 3개도 내용 변경 없이 추적 대상에 포함 |
| push | 수행 안 함 | 로컬 커밋만 수행 |

비밀정보 검사는 알려진 키 형식·자격증명 할당·인증 URL·개인키 헤더 기반이며 모든 임의 형식의 비밀정보 부재를 보증하지는 않는다. 외부 의존성 및 생성 캐시는 게시 대상 저장소 소스가 아니므로 내용 검사에서 제외했다.
