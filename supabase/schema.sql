-- Supabase 데이터베이스 스키마
-- 이 파일은 Supabase SQL Editor에서 실행하여 테이블을 생성합니다.

-- 포트폴리오 테이블
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE
);

-- 문의 테이블
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- RLS (Row Level Security) 정책
-- 포트폴리오: 공개된 항목은 누구나 읽기 가능
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published portfolios" ON portfolios
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated users can manage portfolios" ON portfolios
  FOR ALL USING (auth.role() = 'authenticated');

-- 문의: 누구나 생성 가능, 인증된 사용자만 읽기/수정/삭제 가능
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can manage inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- 스토리지 버킷 (Supabase Dashboard에서 생성 필요)
-- 이름: images
-- 공개: 예
