#!/bin/bash

# Expo 54 호환 버전 설치 스크립트

echo "🧹 기존 파일 정리 중..."
rm -rf node_modules package-lock.json .expo

echo "📦 npm 캐시 정리 중..."
npm cache clean --force

echo "📥 기본 의존성 설치 중..."
npm install

echo "🔧 Expo 호환 버전 설치 중..."
npx expo install --fix

echo "✅ 설치 완료!"
echo ""
echo "이제 다음 명령어로 앱을 실행하세요:"
echo "npx expo start --clear"

