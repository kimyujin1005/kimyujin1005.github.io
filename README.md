# Yujin Kim — Personal Website

빌드 도구나 외부 라이브러리 없이 만든 GitHub Pages용 개인 홈페이지입니다. 시스템 테마를 자동으로 감지하며, 사용자가 선택한 라이트/다크 모드를 저장합니다. 데스크톱·태블릿·모바일 화면에 맞게 반응형으로 동작합니다.

저장소 이름을 `kimyujin1005.github.io`로 변경하면 아래 주소에서 바로 사용할 수 있습니다.

> <https://kimyujin1005.github.io>

## 파일 구조

```text
.
├── assets/             # 프로필 사진, CV, 파비콘 등
├── content/
│   └── profile.js      # 홈페이지에 표시할 모든 CV 데이터
├── index.html          # 시맨틱 페이지 구조
├── script.js           # 콘텐츠 렌더링, 메뉴, 테마 전환
└── styles.css          # 반응형 디자인과 라이트/다크 테마
```

## CV 내용 넣기

홈페이지 내용은 [`content/profile.js`](content/profile.js) 한 파일에서 관리합니다. `about`은 기본 소개로 항상 표시되고, 나머지 CV 섹션은 배열이 비어 있으면 자동으로 숨겨집니다.

기본 정보 예시:

```js
name: "Yujin Kim",
role: "Software Engineer",
location: "Seoul, Republic of Korea",
email: "hello@example.com",
avatar: "assets/profile.jpg",
resume: "assets/Yujin_Kim_CV.pdf",
```

경력 항목 예시:

```js
experience: [
  {
    period: "2024 — Present",
    role: "Software Engineer",
    company: "Company",
    companyUrl: "https://example.com",
    location: "Seoul, Republic of Korea",
    summary: "What you worked on and why it mattered.",
    highlights: ["A measurable result", "Another meaningful contribution"],
  },
],
```

프로젝트 항목 예시:

```js
projects: [
  {
    title: "Project name",
    description: "A short explanation of the problem and solution.",
    technologies: ["Python", "PyTorch", "Docker"],
    sourceUrl: "https://github.com/...",
    liveUrl: "https://...",
  },
],
```

같은 방식으로 `skills`, `education`, `publications`, `honors` 배열을 채우면 해당 섹션과 내비게이션이 자동으로 나타납니다. 실제 CV 내용을 모두 넣은 뒤 `draft: false`로 변경하면 안내 카드가 사라집니다.

프로필 사진은 `assets/profile.jpg`, CV 파일은 `assets/Yujin_Kim_CV.pdf`처럼 저장하고 `profile.js`의 경로와 일치시키면 됩니다.

## 로컬에서 확인하기

```bash
python3 -m http.server 8000
```

브라우저에서 <http://localhost:8000>을 열어 확인합니다.

## GitHub Pages 설정

1. GitHub 저장소의 **Settings → General**에서 저장소 이름을 정확히 `kimyujin1005.github.io`로 변경합니다.
2. **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 `Deploy from a branch`를 선택합니다.
4. 브랜치는 `main`, 폴더는 `/(root)`를 선택하고 저장합니다.
5. 배포가 끝나면 <https://kimyujin1005.github.io>에서 확인합니다.

이 사이트는 빌드 과정이 없는 정적 사이트이므로 `main` 브랜치에 푸시하면 변경 사항이 그대로 배포됩니다.
