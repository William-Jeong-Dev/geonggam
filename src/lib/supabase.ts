import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase가 설정되지 않은 경우를 위한 더미 클라이언트
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as SupabaseClient;

// 포트폴리오 관련 함수들
export const portfolioApi = {
  // 공개된 포트폴리오 목록 조회
  async getPublished() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 모든 포트폴리오 조회 (어드민용)
  async getAll() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 단일 포트폴리오 조회
  async getById(id: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 포트폴리오 생성
  async create(portfolio: Omit<import('../types').Portfolio, 'id' | 'created_at'>) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('portfolios')
      .insert(portfolio)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 포트폴리오 수정
  async update(id: string, portfolio: Partial<import('../types').Portfolio>) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('portfolios')
      .update(portfolio)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 포트폴리오 삭제
  async delete(id: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// 문의 관련 함수들
export const inquiryApi = {
  // 문의 생성
  async create(inquiry: Omit<import('../types').Inquiry, 'id' | 'created_at' | 'is_read'>) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('inquiries')
      .insert({ ...inquiry, is_read: false })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 모든 문의 조회 (어드민용)
  async getAll() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 단일 문의 조회
  async getById(id: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 읽음 처리
  async markAsRead(id: string) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('inquiries')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  // 문의 삭제
  async delete(id: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// 이미지 업로드
export const storageApi = {
  async uploadImage(file: File, folder: string = 'portfolio') {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },
};

// 히어로 슬라이드 관련 함수들
export const heroSlideApi = {
  // 활성화된 슬라이드 조회
  async getActive() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 모든 슬라이드 조회 (어드민용)
  async getAll() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 슬라이드 생성
  async create(slide: Omit<import('../types').HeroSlide, 'id' | 'created_at'>) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('hero_slides')
      .insert(slide)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 슬라이드 수정
  async update(id: string, slide: Partial<import('../types').HeroSlide>) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('hero_slides')
      .update(slide)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 슬라이드 삭제
  async delete(id: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// 사이트 설정 관련 함수들
export const siteSettingsApi = {
  // 모든 설정 조회
  async getAll() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;
    return data;
  },

  // 특정 설정 조회
  async getByKey(key: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // 설정 저장 (upsert)
  async upsert(key: string, value: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 로고 URL 가져오기 (편의 함수)
  async getLogoUrl() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'logo_url')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.value || null;
  },

  // 로고 URL 저장 (편의 함수)
  async setLogoUrl(url: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        { key: 'logo_url', value: url, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 카테고리 관련 함수들
export const categoryApi = {
  // 모든 카테고리 조회
  async getAll() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 카테고리 생성
  async create(category: { name: string; display_order: number }) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 카테고리 수정
  async update(id: string, category: { name?: string; display_order?: number }) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 카테고리 삭제
  async delete(id: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// 소개 페이지 콘텐츠 관련 함수들
export const aboutContentApi = {
  // 모든 콘텐츠 조회
  async getAll() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 섹션별 콘텐츠 조회
  async getBySection(section: string) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('section', section)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 콘텐츠 생성
  async create(content: { section: string; title: string; content: string; display_order: number }) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('about_content')
      .insert(content)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 콘텐츠 수정
  async update(id: string, content: Partial<import('../types').AboutContent>) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase
      .from('about_content')
      .update({ ...content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 콘텐츠 삭제
  async delete(id: string) {
    if (!isSupabaseConfigured) throw new Error('Supabase가 설정되지 않았습니다.');
    const { error } = await supabase
      .from('about_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Supabase 설정 여부 확인 함수
export const isSupabaseReady = () => isSupabaseConfigured;
