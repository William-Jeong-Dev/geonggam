import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { theme } from '../../styles/GlobalStyles';
import { Portfolio } from '../../types';

interface PortfolioPreviewProps {
  portfolios: Portfolio[];
}

const Section = styled.section`
  padding: 6rem 2rem;
  background-color: ${theme.colors.white};
`;

const SectionInner = styled.div`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1rem;
  color: ${theme.colors.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.article)`
  position: relative;
  overflow: hidden;
  cursor: pointer;
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

export function PortfolioPreview({ portfolios }: PortfolioPreviewProps) {
  const previewPortfolios = portfolios.slice(0, 6);

  return (
    <Section>
      <SectionInner>
        <SectionHeader>
          <SectionTitle>포트폴리오</SectionTitle>
          <SectionSubtitle>
            정감공간이 완성한 공간들을 소개합니다
          </SectionSubtitle>
        </SectionHeader>
        <Grid>
          {previewPortfolios.map((portfolio, index) => (
            <Card
              key={portfolio.id}
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
          ))}
        </Grid>
        <ButtonWrapper>
          <Link to="/portfolio">
            <Button $variant="outline">
              모든 프로젝트 보기
            </Button>
          </Link>
        </ButtonWrapper>
      </SectionInner>
    </Section>
  );
}
