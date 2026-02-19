import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/GlobalStyles';
import { Portfolio } from '../../types';

interface PortfolioDetailProps {
  portfolio: Portfolio;
}

const DetailWrapper = styled.div`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
  padding: 0 2rem;
`;

const MainImage = styled.div<{ $image: string }>`
  width: 100%;
  aspect-ratio: 16/9;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.backgroundAlt};
  margin-bottom: 2rem;
  cursor: pointer;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Thumbnail = styled.button<{ $image: string; $active: boolean }>`
  aspect-ratio: 1;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.backgroundAlt};
  border: 2px solid ${props => props.$active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: border-color ${theme.transitions.default};

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding-bottom: 4rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const InfoLeft = styled.div``;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Category = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: ${theme.colors.backgroundAlt};
  color: ${theme.colors.secondary};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: ${theme.colors.text};
  white-space: pre-wrap;
`;

const InfoRight = styled.div``;

const InfoItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:first-child {
    border-top: 1px solid ${theme.colors.border};
  }
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${theme.colors.primary};
`;

// Lightbox components
const LightboxOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LightboxImage = styled(motion.img)`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: background ${theme.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function PortfolioDetailView({ portfolio }: PortfolioDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(prev =>
      prev === 0 ? portfolio.images.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(prev =>
      prev === portfolio.images.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}`;
  };

  return (
    <DetailWrapper>
      <MainImage
        $image={portfolio.images[selectedImage] || ''}
        onClick={() => setLightboxOpen(true)}
      />

      {portfolio.images.length > 1 && (
        <ThumbnailGrid>
          {portfolio.images.map((image, index) => (
            <Thumbnail
              key={index}
              $image={image}
              $active={index === selectedImage}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </ThumbnailGrid>
      )}

      <InfoSection>
        <InfoLeft>
          <Title>{portfolio.title}</Title>
          <Category>{portfolio.category}</Category>
          <Description>{portfolio.description}</Description>
        </InfoLeft>
        <InfoRight>
          <InfoItem>
            <InfoLabel>카테고리</InfoLabel>
            <InfoValue>{portfolio.category}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>완료일</InfoLabel>
            <InfoValue>{formatDate(portfolio.created_at)}</InfoValue>
          </InfoItem>
        </InfoRight>
      </InfoSection>

      <AnimatePresence>
        {lightboxOpen && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <LightboxClose onClick={() => setLightboxOpen(false)}>
              &times;
            </LightboxClose>
            {portfolio.images.length > 1 && (
              <>
                <LightboxNav className="prev" onClick={handlePrev}>
                  &#8249;
                </LightboxNav>
                <LightboxNav className="next" onClick={handleNext}>
                  &#8250;
                </LightboxNav>
              </>
            )}
            <LightboxImage
              src={portfolio.images[selectedImage]}
              alt={portfolio.title}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </DetailWrapper>
  );
}
