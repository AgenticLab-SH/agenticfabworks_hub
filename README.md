# 에이전틱팹웍스 대표 홈페이지

이 저장소는 [agenticfabworks.com](https://agenticfabworks.com/) 브랜드 루트와 공통 정책·문의·서비스 탐색을 관리합니다. SKCT나 개별 도구의 제품 코드를 합치는 저장소가 아니라, 현재와 미래 서비스를 연결하는 독립 허브입니다.

## 폴더와 파일 역할

- `index.html`: 브랜드 소개와 서비스 탐색
- `contact`: 공통 문의 안내
- `privacy`, `terms`: 공통 개인정보처리방침과 이용약관
- `skct`: SKCT 소개와 공개 서비스 연결
- `docs.css`, `site.js`: 허브와 정책 페이지의 공통 화면·동작
- `.github/workflows/deploy-pages.yml`: `main`을 GitHub Pages로 배포
- `CNAME`: `agenticfabworks.com` 연결

## 서비스 경계

새 제품은 원칙적으로 독립 저장소와 서브도메인을 사용합니다. 이 허브에는 브랜드, 탐색, 공통 정책, 신뢰 정보만 두고 로그인·결제·개인정보 처리 같은 제품 기능은 각 서비스가 책임집니다. 변경 시 모바일·데스크톱 반응형, 접근성, 내부·외부 링크, 구조화 데이터, 정책 페이지와 문의 경로를 확인합니다.

공용 웹 도구는 [tools.agenticfabworks.com](https://tools.agenticfabworks.com/), SKCT는 [skct.agenticfabworks.com](https://skct.agenticfabworks.com/)에서 운영합니다.
