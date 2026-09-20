# 반응형 포트폴리오 웹사이트

순수 HTML, CSS, JavaScript로 만든 개인 포트폴리오입니다. 외부 프레임워크 없이 DOM 이벤트, 상태 변경, 화면 렌더링의 연결을 구현했습니다.

## VS Code에서 실행하기

1. 압축을 푼 뒤 VS Code에서 `portfolio-submission` 폴더를 엽니다.
2. 확장 프로그램 추천 알림에서 **Live Server**를 설치합니다.
3. 탐색기에서 `index.html`을 선택합니다.
4. VS Code 오른쪽 아래의 **Go Live**를 누릅니다.
5. 브라우저에서 `http://127.0.0.1:5500`이 열리면 정상입니다.

반드시 개별 파일이 아니라 프로젝트 폴더 전체를 열어야 CSS, JavaScript, 이미지 경로가 정상 동작합니다.

## 개인 정보 변경

`js/main.js` 맨 위의 `CONFIG`에서 아래 값을 수정합니다.

- `ownerName`: 화면에 표시할 이름
- `githubUsername`: GitHub 사용자 아이디
- `projectLimit`: 최대 프로젝트 카드 수

이메일 링크는 `index.html` 하단의 `mailto:hello@example.com`을 수정합니다.

수정 후에는 `Ctrl+S`(macOS는 `Cmd+S`)로 저장하면 Live Server가 브라우저를 자동으로 새로고침합니다.

## GitHub에 올리기

VS Code의 **소스 제어** 메뉴에서 다음 순서로 진행합니다.

1. **Initialize Repository** 선택
2. 변경 파일 전체를 스테이징
3. 커밋 메시지에 `Complete portfolio assignment` 입력 후 커밋
4. **Publish Branch**를 눌러 공개 저장소로 게시
5. GitHub 저장소의 `Settings → Pages`에서 배포 소스를 `Deploy from a branch`로 선택
6. Branch를 `main`, 폴더를 `/(root)`로 지정하고 저장

배포가 끝나면 표시되는 GitHub Pages 주소를 아래 **배포 URL** 항목에 기록합니다.

## 구현 기능

- 시맨틱 HTML과 의미 있는 대체 텍스트
- 모바일 퍼스트 반응형 레이아웃: 768px, 1024px 브레이크포인트
- Flexbox 내비게이션, Grid 프로젝트 카드
- 햄버거 메뉴와 부드러운 앵커 스크롤
- 다크 모드와 `localStorage` 설정 유지
- 스크롤 60px 이후 헤더 스타일 변경
- 스크롤 300px 이후 맨 위로 버튼 표시
- `IntersectionObserver` threshold 0.2 기반 등장 애니메이션
- GitHub API의 로딩, 성공, 오류, 빈 상태 렌더링
- 언어별 프로젝트 필터링
- 이름, 이메일, 메시지 폼 유효성 검사

## 상태 → 렌더링 흐름

1. 테마 버튼 클릭 → `state.theme` 변경 → 문서의 `data-theme`과 버튼 UI 변경
2. GitHub API 요청 → `projectStatus` 변경 → 로딩/성공/오류/빈 상태 렌더링
3. 폼 입력/제출 → `formErrors` 변경 → 필드 오류와 성공 메시지 렌더링
4. 필터 클릭 → `activeLanguage` 변경 → 저장소 목록을 `filter()`로 다시 렌더링

## 사용 기술

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid, Media Queries)
- JavaScript ES6+ (DOM, Fetch, async/await, map/filter/forEach)

## 배포 URL

GitHub Pages 배포 후 이 항목을 실제 URL로 교체하세요.

## 스크린샷

배포 전 데스크톱, 모바일, 다크 모드 화면을 캡처해 이 섹션에 추가하세요.
