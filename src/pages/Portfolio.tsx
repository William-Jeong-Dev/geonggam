import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PortfolioGrid } from '../components/portfolio';
import { portfolioApi } from '../lib/supabase';
import { theme } from '../styles/GlobalStyles';
import { Portfolio as PortfolioType } from '../types';

// 임시 데이터
const mockPortfolios: PortfolioType[] = [
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

const categories = ['전체', '주거', '상업', '오피스'];

const PageWrapper = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  position: relative;
  height: 40vh;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.backgroundAlt};
`;

const HeroContent = styled.div`
  text-align: center;
  padding: 0 2rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${theme.colors.secondary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 2rem 6rem;
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.$active ? theme.colors.white : theme.colors.secondary};
  background-color: ${props => props.$active ? theme.colors.primary : 'transparent'};
  border: 1px solid ${props => props.$active ? theme.colors.primary : theme.colors.border};
  transition: all ${theme.transitions.default};

  &:hover {
    color: ${props => props.$active ? theme.colors.white : theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
`;

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const { data: portfolios } = useQuery({
    queryKey: ['portfolios', 'published'],
    queryFn: portfolioApi.getPublished,
    placeholderData: mockPortfolios,
  });

  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            포트폴리오
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            정감공간이 완성한 공간들
          </PageSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <FilterWrapper>
          {categories.map(category => (
            <FilterButton
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterWrapper>

        <PortfolioGrid
          portfolios={portfolios || mockPortfolios}
          selectedCategory={selectedCategory}
        />
      </ContentSection>
    </PageWrapper>
  );
}
