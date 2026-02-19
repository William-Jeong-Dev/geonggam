import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ContactForm } from '../components/contact';
import { theme } from '../styles/GlobalStyles';

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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div``;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: ${theme.colors.secondary};
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const InfoList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoItem = styled.li`
  display: flex;
  gap: 1rem;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.secondary};
  min-width: 80px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${theme.colors.primary};
`;

const FormWrapper = styled.div``;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
`;

const MapSection = styled.section`
  height: 400px;
  background-color: ${theme.colors.backgroundAlt};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.secondary};
`;

export function Contact() {
  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            문의
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            프로젝트에 대해 상담해 드립니다
          </PageSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <ContentGrid>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ContactInfo>
              <InfoTitle>연락처 정보</InfoTitle>
              <InfoText>
                프로젝트 문의나 견적 상담은 아래 연락처로 문의해 주시거나,
                우측 폼을 통해 문의 내용을 남겨주세요.
                빠른 시일 내에 연락드리겠습니다.
              </InfoText>
              <InfoList>
                <InfoItem>
                  <InfoLabel>이메일</InfoLabel>
                  <InfoValue>info@jeongdam.co.kr</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>전화</InfoLabel>
                  <InfoValue>02-0000-0000</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>팩스</InfoLabel>
                  <InfoValue>02-0000-0001</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>주소</InfoLabel>
                  <InfoValue>서울특별시 강남구 테헤란로 123</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>영업시간</InfoLabel>
                  <InfoValue>평일 10:00 - 18:00</InfoValue>
                </InfoItem>
              </InfoList>
            </ContactInfo>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FormWrapper>
              <FormTitle>문의하기</FormTitle>
              <ContactForm />
            </FormWrapper>
          </motion.div>
        </ContentGrid>
      </ContentSection>

      <MapSection>
        지도 영역 (Google Maps 또는 Kakao Maps 연동)
      </MapSection>
    </PageWrapper>
  );
}
