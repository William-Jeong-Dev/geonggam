import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';
import { Portfolio } from '../../types';
import { PortfolioCard } from './PortfolioCard';

interface PortfolioGridProps {
  portfolios: Portfolio[];
  selectedCategory: string;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.secondary};
`;

export function PortfolioGrid({ portfolios, selectedCategory }: PortfolioGridProps) {
  const filteredPortfolios = selectedCategory === '전체'
    ? portfolios
    : portfolios.filter(p => p.category === selectedCategory);

  if (filteredPortfolios.length === 0) {
    return (
      <Grid>
        <EmptyState>
          해당 카테고리에 포트폴리오가 없습니다.
        </EmptyState>
      </Grid>
    );
  }

  return (
    <Grid>
      {filteredPortfolios.map((portfolio, index) => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={portfolio}
          index={index}
        />
      ))}
    </Grid>
  );
}
