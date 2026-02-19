import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/GlobalStyles';
import { Portfolio } from '../../types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  index: number;
}

const Card = styled(motion.article)`
  position: relative;
  overflow: hidden;
`;

const CardImage = styled.div<{ $image: string }>`
  aspect-ratio: 4/3;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.backgroundAlt};
  transition: transform ${theme.transitions.slow};
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 50%
  );
  opacity: 0;
  transition: opacity ${theme.transitions.default};
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: ${theme.colors.white};
  transform: translateY(20px);
  opacity: 0;
  transition: all ${theme.transitions.default};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const CardCategory = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const CardWrapper = styled(Link)`
  display: block;

  &:hover {
    ${CardImage} {
      transform: scale(1.05);
    }

    ${CardOverlay} {
      opacity: 1;
    }

    ${CardContent} {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export function PortfolioCard({ portfolio, index }: PortfolioCardProps) {
  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <CardWrapper to={`/portfolio/${portfolio.id}`}>
        <CardImage $image={portfolio.images[0] || ''} />
        <CardOverlay />
        <CardContent>
          <CardTitle>{portfolio.title}</CardTitle>
          <CardCategory>{portfolio.category}</CardCategory>
        </CardContent>
      </CardWrapper>
    </Card>
  );
}
