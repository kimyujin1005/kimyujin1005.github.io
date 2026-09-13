# Yujin Kim — Personal Website

Yujin Kim의 연구·경력·학력을 소개하는 다중 페이지형 개인 홈페이지입니다.

> <https://kimyujin1005.github.io>

## 특징

- Home, About, Experience, Research, Education의 실제 개별 페이지
- 데스크톱 18px, 모바일 17px 기반의 큰 본문 글꼴
- 시스템 설정을 감지하고 선택을 저장하는 라이트/다크 모드
- 키보드 내비게이션과 모바일 메뉴
- 빌드 과정이나 외부 프레임워크가 없는 정적 HTML/CSS/JavaScript
- GitHub Pages 사용자 사이트의 루트 경로에 최적화

## 파일 구조

```text
.
├── about/index.html       # 소개와 연구 관심 분야
├── education/index.html   # 학력, 수상
├── experience/index.html  # 연구·산업·교육 경력
├── research/index.html    # 논문, 심사 중 원고, 포스터·발표
├── assets/                # 파비콘, 추후 프로필 사진과 CV
├── index.html             # 홈페이지
├── script.js              # 테마 및 모바일 메뉴
├── styles.css             # 공통 디자인 시스템
├── robots.txt
└── sitemap.xml
```

각 페이지의 주요 내용은 검색 엔진과 JavaScript 비활성 환경에서도 읽을 수 있도록 HTML에 직접 들어 있습니다. 공통 디자인은 `styles.css`, 테마와 모바일 메뉴 동작은 `script.js`에서 관리합니다.

## 로컬에서 확인하기

```bash
python3 -m http.server 8000
```

브라우저에서 <http://localhost:8000>을 엽니다.

## GitHub Pages 설정

- 저장소: `kimyujin1005/kimyujin1005.github.io`
- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/(root)`

`main` 브랜치에 푸시하면 <https://kimyujin1005.github.io>에 자동으로 배포됩니다.
