# Introduction
일본 웨딩 드레스 전문업체인 'ANJERI' 의 웨딩 드레스 관리 장부를 애플리케이션으로 대체하기 위한 프로젝트

# Tech Stack

## Front-end
JavaScript, React, React Hooks, Redux, D3

## Back-end
JavaScript, Express, Sequelize, MySQL, Multer, Bcrypt, JWT

## Etc
dotenv, Socket.io, AWS

# Project Features

## 회원 가입
* 핸드폰 번호 인증
* 암호화

## 로그인
* 토큰 인증

## 로그아웃
* 토큰 삭제

## 주요 기능

### 1. 공지 사항
* 업무 관련 공지사항

### 2. 드레스 관리
* 전체 드레스 나열
* 드레스 검색 기능

### 3. 드레스 세부 페이지
#### 드레스 일반 정보 화면
* 드레스 정보
* 드레스 정보 실시간 관리

#### 드레스 일정 관리 화면
* 드레스 일정 관리: 달력 형태로 보기 쉽게 표현
* 달력에 다양한 인터랙트 추가
    * 마우스 포인터 올리면 드레스 정보 확인

### 4. 드레스 통계
* D3 이용하여 드레스 관련 데이터 표현