import { useQuery } from '@tanstack/react-query';
import { HeroSection, PortfolioPreview } from '../components/home';
import { portfolioApi, heroSlideApi } from '../lib/supabase';
import { Portfolio } from '../types';

// 임시 데이터 (Supabase 연결 전 테스트용)
const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    title: '모던 미니멀 주택',
    description: '깔끔한 라인과 여백의 미를 살린 모던 미니멀 스타일의 주거 공간입니다.',
    category: '주거',
    images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'],
    created_at: '2024-01-15',
    is_published: true,
  },
  {
    id: '2',
    title: '따뜻한 카페 인테리어',
    description: '자연 소재와 따뜻한 조명으로 완성한 아늑한 카페 공간입니다.',
    category: '상업',
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
    created_at: '2024-02-20',
    is_published: true,
  },
  {
    id: '3',
    title: '크리에이티브 오피스',
    description: '창의적인 업무 환경을 위한 열린 구조의 오피스 공간입니다.',
    category: '오피스',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    created_at: '2024-03-10',
    is_published: true,
  },
  {
    id: '4',
    title: '아늑한 원룸',
    description: '작지만 효율적인 공간 활용으로 완성한 원룸 인테리어입니다.',
    category: '주거',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    created_at: '2024-04-05',
    is_published: true,
  },
  {
    id: '5',
    title: '세련된 레스토랑',
    description: '모던한 감각과 편안함이 공존하는 레스토랑 공간입니다.',
    category: '상업',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    created_at: '2024-05-12',
    is_published: true,
  },
  {
    id: '6',
    title: '스타트업 오피스',
    description: '효율적인 협업을 위한 스타트업 사무 공간입니다.',
    category: '오피스',
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
    created_at: '2024-06-18',
    is_published: true,
  },
];

export function Home() {
  const { data: portfolios } = useQuery({
    queryKey: ['portfolios', 'published'],
    queryFn: portfolioApi.getPublished,
    placeholderData: mockPortfolios,
  });

  const { data: heroSlides } = useQuery({
    queryKey: ['heroSlides', 'active'],
    queryFn: heroSlideApi.getActive,
  });

  return (
    <>
      <HeroSection slides={heroSlides || []} />
      <PortfolioPreview portfolios={portfolios || mockPortfolios} />
    </>
  );
}
