// Portfolio 타입
export interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  created_at: string;
  is_published: boolean;
}

// Inquiry 타입
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

// Contact Form 데이터 타입
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// 카테고리 타입
export type PortfolioCategory = '주거' | '상업' | '오피스' | '기타';

// 네비게이션 아이템 타입
export interface NavItem {
  label: string;
  path: string;
}

// 히어로 슬라이드 타입
export interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// 사이트 설정 타입
export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

// 소개 페이지 콘텐츠 타입
export interface AboutContent {
  id: string;
  section: string;
  title: string;
  content: string;
  display_order: number;
  updated_at: string;
}
