import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { theme } from '../../styles/GlobalStyles';
import { HeroSlide } from '../../types';

interface HeroSectionProps {
  slides?: HeroSlide[];
}

const HeroWrapper = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${theme.colors.primary};
`;

const SlideImage = styled(motion.div)<{ $image: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
`;

const DefaultBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${theme.colors.backgroundAlt} 0%,
    #e8e8e8 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 2rem;
  max-width: 900px;
`;

const HeroTitle = styled(motion.h1)<{ $hasImage: boolean }>`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${props => props.$hasImage ? theme.colors.white : theme.colors.primary};
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-shadow: ${props => props.$hasImage ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled(motion.p)<{ $hasImage: boolean }>`
  font-size: 1.25rem;
  color: ${props => props.$hasImage ? 'rgba(255,255,255,0.9)' : theme.colors.secondary};
  margin-bottom: 2.5rem;
  line-height: 1.8;
  text-shadow: ${props => props.$hasImage ? '0 1px 5px rgba(0,0,0,0.3)' : 'none'};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const SlideIndicators = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
`;

const Indicator = styled.button<{ $active: boolean }>`
  width: ${props => props.$active ? '2rem' : '0.75rem'};
  height: 0.75rem;
  border-radius: 0.375rem;
  background-color: ${props => props.$active ? theme.colors.white : 'rgba(255,255,255,0.5)'};
  transition: all ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.white};
  }
`;

const SlideControls = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 10;
  pointer-events: none;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: ${theme.colors.white};
  font-size: 1.5rem;
  transition: all ${theme.transitions.default};
  pointer-events: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const SLIDE_INTERVAL = 5000; // 5초마다 슬라이드 전환

export function HeroSection({ slides = [] }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasSlides = slides.length > 0;

  const nextSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 자동 슬라이드
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  const currentSlide = hasSlides ? slides[currentIndex] : null;
  const title = currentSlide?.title || '공간에 감성을 더하다';
  const subtitle = currentSlide?.subtitle || '정감공간은 사람들의 일상에 따뜻함을 전하는\n감성적인 공간 인테리어 디자인을 추구합니다.';

  return (
    <HeroWrapper>
      {hasSlides ? (
        <AnimatePresence mode="wait">
          <SlideImage
            key={currentIndex}
            $image={currentSlide?.image_url || ''}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
      ) : (
        <DefaultBackground />
      )}

      <HeroContent>
        <HeroTitle
          $hasImage={hasSlides}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          key={`title-${currentIndex}`}
        >
          {title}
        </HeroTitle>
        <HeroSubtitle
          $hasImage={hasSlides}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          key={`subtitle-${currentIndex}`}
        >
          {subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < subtitle.split('\n').length - 1 && <br />}
            </span>
          ))}
        </HeroSubtitle>
        <ButtonGroup
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/portfolio">
            <Button $variant={hasSlides ? 'outline' : 'primary'} $size="large" style={hasSlides ? { borderColor: 'white', color: 'white' } : {}}>
              프로젝트 보기
            </Button>
          </Link>
          <Link to="/contact">
            <Button $variant="outline" $size="large" style={hasSlides ? { borderColor: 'white', color: 'white' } : {}}>
              문의하기
            </Button>
          </Link>
        </ButtonGroup>
      </HeroContent>

      {slides.length > 1 && (
        <>
          <SlideControls>
            <ControlButton onClick={prevSlide}>&#8249;</ControlButton>
            <ControlButton onClick={nextSlide}>&#8250;</ControlButton>
          </SlideControls>
          <SlideIndicators>
            {slides.map((_, index) => (
              <Indicator
                key={index}
                $active={index === currentIndex}
                onClick={() => goToSlide(index)}
              />
            ))}
          </SlideIndicators>
        </>
      )}
    </HeroWrapper>
  );
}
