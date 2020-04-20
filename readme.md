# 부산국제영화제 리메이크

이 프로젝트는 2020년 기능경기대회 준비를 목적으로 제작되었으며, 2019년 기능경기 전국대회 과제 문제를 베이스로 제작되었음을 알려드립니다. 일부 문항은 수정되어 반영된 것도 있으며, React 공부와 대회 준비를 병행하기 위해서 제작된 것이므로 기존 대회 환경과 다를 수 있습니다.

기본적인 베이스는 React와 Next.js 그리고 Mongoose로 구성되어 있습니다. 사용자 인증은 passport로, 간단한 토스트 메세지는 react-toastify로, 또한 편의를 위해 chart.js 와 axios를 사용하였습니다.


프로젝트 개요
===

## 과제 개요

이 사이트는 부산 국제 영화제에 소개되는 영화의 예고편들을 볼 수 있도록 사이트를 개발하는 것이다. 사이트는 다양한 사용자들이 편리하게 접근이 가능하도록 사이트의 성격을 잘 파악하여 개발해야 한다.

> 실제 과제 파일에 위와 같이 개요가 작성되어 있습니다.

## 주요 파일 구성
<code>/server.js</code>  Next.js Express 서버를 동작시키는 파일<br>
<code>/helper.js</code>  각종 사용자 정의 함수로 구성된 파일<br>
<code>/migrate.js</code> Laravel의 Factory처럼 과제 내에서 제공하는 data.json을 DB에 쉽게 저장하기 위한 파일<br>


## 디렉토리 구조
<code>/models</code>  mongoose의 모델을 모아둔 폴더<br>
<code>/src</code>     next.js 페이지를 모아둔 폴더<br>
<code>/routes</code>  express route를 분리시켜둔 폴더<br>


사이트 구현
===

1. 메인 페이지 예시

![메인페이지 예시](/public/images/index.png)

2. 서브 페이지 예시

![서브페이지 예시](/public/images/sub.png)

3. 로그인 페이지 예시

![로그인페이지 예시](/public/images/login.png)