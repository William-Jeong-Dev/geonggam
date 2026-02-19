import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/GlobalStyles';

const FooterWrapper = styled.footer`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 4rem 2rem;
`;

const FooterInner = styled.div`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const CompanyInfo = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
  }
`;

const FooterNav = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

const FooterLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    align-items: center;
  }

  a {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    transition: color ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.white};
    }
  }
`;

const ContactInfo = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
  }
`;

const Copyright = styled.div`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

export function Footer() {
  return (
    <FooterWrapper>
      <FooterInner>
        <CompanyInfo>
          <h3>정감공간</h3>
          <p>
            주식회사 정감공간<br />
            감성적인 공간 인테리어 디자인 전문<br />
            사업자등록번호: 000-00-00000
          </p>
        </CompanyInfo>
        <FooterNav>
          <h4>메뉴</h4>
          <FooterLinks>
            <li><Link to="/about">소개</Link></li>
            <li><Link to="/portfolio">포트폴리오</Link></li>
            <li><Link to="/contact">문의</Link></li>
          </FooterLinks>
        </FooterNav>
        <ContactInfo>
          <h4>연락처</h4>
          <p>
            이메일: info@jeongdam.co.kr<br />
            전화: 02-0000-0000<br />
            주소: 서울특별시 강남구
          </p>
        </ContactInfo>
      </FooterInner>
      <Copyright>
        &copy; {new Date().getFullYear()} 주식회사 정감공간. All rights reserved.
      </Copyright>
    </FooterWrapper>
  );
}
