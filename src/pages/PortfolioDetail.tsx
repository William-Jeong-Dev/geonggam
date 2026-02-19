import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PortfolioDetailView } from '../components/portfolio';
import { portfolioApi } from '../lib/supabase';
import { theme } from '../styles/GlobalStyles';
import { Portfolio } from '../types';

// 임시 데이터
const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    title: '모던 미니멀 주택',
    description: '깔끔한 라인과 여백의 미를 살린 모던 미니멀 스타일의 주거 공간입니다.\n\n이 프로젝트는 30평 아파트를 대상으로 진행되었으며, 화이트와 그레이 톤을 기본으로 따뜻한 우드 소재를 포인트로 사용하여 미니멀하면서도 따뜻한 느낌을 연출하였습니다.\n\n거실과 주방의 경계를 허물어 개방감을 극대화하였고, 숨겨진 수납공간을 곳곳에 배치하여 깔끔한 동선을 유지할 수 있도록 설계하였습니다.',
    category: '주거',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    ],
    created_at: '2024-01-15',
    is_published: true,
  },
  {
    id: '2',
    title: '따뜻한 카페 인테리어',
    description: '자연 소재와 따뜻한 조명으로 완성한 아늑한 카페 공간입니다.\n\n이 카페는 도심 속 휴식처를 컨셉으로 디자인되었습니다. 원목 테이블과 빈티지 조명, 식물들이 어우러져 편안한 분위기를 자아냅니다.',
    category: '상업',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200',
      'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=1200',
    ],
    created_at: '2024-02-20',
    is_published: true,
  },
  {
    id: '3',
    title: '크리에이티브 오피스',
    description: '창의적인 업무 환경을 위한 열린 구조의 오피스 공간입니다.\n\n팀원들 간의 소통과 협업을 중시하여 개방형 좌석 배치를 기본으로 하되, 집중 업무가 필요할 때를 위한 포커스 룸도 마련하였습니다.',
    category: '오피스',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    ],
    created_at: '2024-03-10',
    is_published: true,
  },
  {
    id: '4',
    title: '아늑한 원룸',
    description: '작지만 효율적인 공간 활용으로 완성한 원룸 인테리어입니다.',
    category: '주거',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    ],
    created_at: '2024-04-05',
    is_published: true,
  },
  {
    id: '5',
    title: '세련된 레스토랑',
    description: '모던한 감각과 편안함이 공존하는 레스토랑 공간입니다.',
    category: '상업',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    ],
    created_at: '2024-05-12',
    is_published: true,
  },
  {
    id: '6',
    title: '스타트업 오피스',
    description: '효율적인 협업을 위한 스타트업 사무 공간입니다.',
    category: '오피스',
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200',
    ],
    created_at: '2024-06-18',
    is_published: true,
  },
];

const PageWrapper = styled.div`
  padding-top: 120px;
  min-height: 100vh;
`;

const Breadcrumb = styled.nav`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto 2rem;
  padding: 0 2rem;
  font-size: 0.875rem;
  color: ${theme.colors.secondary};

  a {
    transition: color ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.primary};
    }
  }

  span {
    margin: 0 0.5rem;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: ${theme.colors.secondary};
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  text-align: center;
  color: ${theme.colors.secondary};

  h2 {
    font-size: 1.5rem;
    color: ${theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: underline;
  }
`;

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfolioApi.getById(id!),
    enabled: !!id,
    placeholderData: () => mockPortfolios.find(p => p.id === id),
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingWrapper>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            로딩 중...
          </motion.div>
        </LoadingWrapper>
      </PageWrapper>
    );
  }

  if (error || !portfolio) {
    return (
      <PageWrapper>
        <ErrorWrapper>
          <h2>프로젝트를 찾을 수 없습니다</h2>
          <p>요청하신 포트폴리오가 존재하지 않거나 삭제되었습니다.</p>
          <Link to="/portfolio">포트폴리오 목록으로 돌아가기</Link>
        </ErrorWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumb>
          <Link to="/">홈</Link>
          <span>/</span>
          <Link to="/portfolio">포트폴리오</Link>
          <span>/</span>
          {portfolio.title}
        </Breadcrumb>

        <PortfolioDetailView portfolio={portfolio} />
      </motion.div>
    </PageWrapper>
  );
}
