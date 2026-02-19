import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  position: relative;
  height: 50vh;
  min-height: 400px;
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
  padding: 6rem 2rem;
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const IntroText = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 2;
  color: ${theme.colors.text};
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background-color: ${theme.colors.backgroundAlt};
`;

const ValueNumber = styled.span`
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.secondary};
  line-height: 1.7;
`;

const ProcessSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${theme.colors.backgroundAlt};
`;

const ProcessContainer = styled.div`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 3rem;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProcessStep = styled(motion.div)`
  position: relative;
  padding: 2rem;
  background-color: ${theme.colors.white};
`;

const StepNumber = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: 700;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.secondary};
  line-height: 1.6;
`;

const values = [
  {
    number: '01',
    title: '감성적 디자인',
    description: '공간에 담긴 이야기와 감성을 디자인에 녹여 사용자에게 특별한 경험을 선사합니다.',
  },
  {
    number: '02',
    title: '섬세한 디테일',
    description: '작은 디테일 하나하나에 집중하여 완성도 높은 공간을 만들어갑니다.',
  },
  {
    number: '03',
    title: '지속가능한 가치',
    description: '시간이 지나도 변하지 않는 가치를 담은 공간을 추구합니다.',
  },
];

const processes = [
  {
    number: '01',
    title: '상담',
    description: '고객의 니즈와 공간의 특성을 파악하는 상담을 진행합니다.',
  },
  {
    number: '02',
    title: '기획 및 설계',
    description: '컨셉을 도출하고 세부 설계를 진행합니다.',
  },
  {
    number: '03',
    title: '시공',
    description: '전문 시공팀이 설계된 디자인을 구현합니다.',
  },
  {
    number: '04',
    title: '완성',
    description: '최종 점검 후 완성된 공간을 전달합니다.',
  },
];

export function About() {
  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            소개
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            정감공간을 소개합니다
          </PageSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <IntroText
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          주식회사 정감공간은 사람들의 일상에 따뜻함을 전하는 감성적인 공간 인테리어 디자인을 추구합니다.
          <br /><br />
          우리는 단순히 보기 좋은 공간이 아닌, 그 공간에서 생활하는 사람들의 이야기와 감성을 담아
          오래도록 사랑받는 공간을 만들어갑니다.
        </IntroText>

        <SectionTitle>핵심 가치</SectionTitle>
        <ValuesGrid>
          {values.map((value, index) => (
            <ValueCard
              key={value.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ValueNumber>{value.number}</ValueNumber>
              <ValueTitle>{value.title}</ValueTitle>
              <ValueDescription>{value.description}</ValueDescription>
            </ValueCard>
          ))}
        </ValuesGrid>
      </ContentSection>

      <ProcessSection>
        <ProcessContainer>
          <SectionTitle>진행 과정</SectionTitle>
          <ProcessGrid>
            {processes.map((process, index) => (
              <ProcessStep
                key={process.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StepNumber>{process.number}</StepNumber>
                <StepTitle>{process.title}</StepTitle>
                <StepDescription>{process.description}</StepDescription>
              </ProcessStep>
            ))}
          </ProcessGrid>
        </ProcessContainer>
      </ProcessSection>
    </PageWrapper>
  );
}
