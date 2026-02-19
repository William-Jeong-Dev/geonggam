import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { portfolioApi, inquiryApi } from '../../lib/supabase';
import { theme } from '../../styles/GlobalStyles';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background-color: ${theme.colors.white};
  padding: 1.5rem;
  border: 1px solid ${theme.colors.border};
`;

const StatLabel = styled.span`
  display: block;
  font-size: 0.875rem;
  color: ${theme.colors.secondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.span`
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ViewAllLink = styled(Link)`
  font-size: 0.875rem;
  color: ${theme.colors.secondary};
  transition: color ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ListItemTitle = styled.span`
  font-size: 0.95rem;
  color: ${theme.colors.primary};
`;

const ListItemMeta = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.secondary};
`;

const Badge = styled.span<{ $type: 'success' | 'warning' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 2px;
  background-color: ${props => props.$type === 'success' ? '#e6f7ed' : '#fff3e0'};
  color: ${props => props.$type === 'success' ? '#27ae60' : '#f39c12'};
`;

const EmptyState = styled.p`
  color: ${theme.colors.secondary};
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem;
`;

export function AdminDashboard() {
  const { data: portfolios } = useQuery({
    queryKey: ['admin', 'portfolios'],
    queryFn: portfolioApi.getAll,
  });

  const { data: inquiries } = useQuery({
    queryKey: ['admin', 'inquiries'],
    queryFn: inquiryApi.getAll,
  });

  const publishedCount = portfolios?.filter(p => p.is_published).length || 0;
  const draftCount = portfolios?.filter(p => !p.is_published).length || 0;
  const unreadCount = inquiries?.filter(i => !i.is_read).length || 0;
  const totalInquiries = inquiries?.length || 0;

  const recentPortfolios = portfolios?.slice(0, 5) || [];
  const recentInquiries = inquiries?.slice(0, 5) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <PageWrapper>
      <PageTitle>대시보드</PageTitle>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <StatLabel>공개된 포트폴리오</StatLabel>
          <StatValue>{publishedCount}</StatValue>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatLabel>비공개 포트폴리오</StatLabel>
          <StatValue>{draftCount}</StatValue>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatLabel>미확인 문의</StatLabel>
          <StatValue>{unreadCount}</StatValue>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatLabel>전체 문의</StatLabel>
          <StatValue>{totalInquiries}</StatValue>
        </StatCard>
      </StatsGrid>

      <Grid>
        <Card>
          <CardHeader>
            <SectionTitle>최근 포트폴리오</SectionTitle>
            <ViewAllLink to="/admin/portfolio">전체 보기</ViewAllLink>
          </CardHeader>
          {recentPortfolios.length > 0 ? (
            <List>
              {recentPortfolios.map(portfolio => (
                <ListItem key={portfolio.id}>
                  <div>
                    <ListItemTitle>{portfolio.title}</ListItemTitle>
                    <ListItemMeta>{portfolio.category}</ListItemMeta>
                  </div>
                  <Badge $type={portfolio.is_published ? 'success' : 'warning'}>
                    {portfolio.is_published ? '공개' : '비공개'}
                  </Badge>
                </ListItem>
              ))}
            </List>
          ) : (
            <EmptyState>등록된 포트폴리오가 없습니다.</EmptyState>
          )}
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle>최근 문의</SectionTitle>
            <ViewAllLink to="/admin/inquiries">전체 보기</ViewAllLink>
          </CardHeader>
          {recentInquiries.length > 0 ? (
            <List>
              {recentInquiries.map(inquiry => (
                <ListItem key={inquiry.id}>
                  <div>
                    <ListItemTitle>{inquiry.name}</ListItemTitle>
                    <ListItemMeta>{formatDate(inquiry.created_at)}</ListItemMeta>
                  </div>
                  <Badge $type={inquiry.is_read ? 'success' : 'warning'}>
                    {inquiry.is_read ? '확인' : '미확인'}
                  </Badge>
                </ListItem>
              ))}
            </List>
          ) : (
            <EmptyState>접수된 문의가 없습니다.</EmptyState>
          )}
        </Card>
      </Grid>
    </PageWrapper>
  );
}
