import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { theme } from '../../styles/GlobalStyles';
import { siteSettingsApi } from '../../lib/supabase';

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
  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
    white-space: pre-line;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
  margin-bottom: 1rem;
  filter: brightness(0) invert(1);
`;

const LogoText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
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
    white-space: pre-line;
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

// 기본값
const defaultFooter = {
  companyName: '정감공간',
  companyDescription: '주식회사 정감공간\n감성적인 공간 인테리어 디자인 전문\n사업자등록번호: 000-00-00000',
  email: 'info@jeongdam.co.kr',
  phone: '02-0000-0000',
  address: '서울특별시 강남구',
  copyright: '주식회사 정감공간',
};

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings', 'footer'],
    queryFn: siteSettingsApi.getAll,
    staleTime: 1000 * 60 * 10,
  });

  const { data: logoUrl } = useQuery({
    queryKey: ['siteSettings', 'logo'],
    queryFn: siteSettingsApi.getLogoUrl,
    staleTime: 1000 * 60 * 10,
  });

  const getSetting = (key: string, defaultValue: string) => {
    const setting = settings?.find(s => s.key === key);
    return setting?.value || defaultValue;
  };

  const companyName = getSetting('footer_company_name', defaultFooter.companyName);
  const companyDescription = getSetting('footer_company_description', defaultFooter.companyDescription);
  const email = getSetting('footer_email', defaultFooter.email);
  const phone = getSetting('footer_phone', defaultFooter.phone);
  const address = getSetting('footer_address', defaultFooter.address);
  const copyright = getSetting('footer_copyright', defaultFooter.copyright);

  return (
    <FooterWrapper>
      <FooterInner>
        <CompanyInfo>
          {logoUrl ? (
            <LogoImage src={logoUrl} alt={companyName} />
          ) : (
            <LogoText>{companyName}</LogoText>
          )}
          <p>{companyDescription}</p>
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
            이메일: {email}<br />
            전화: {phone}<br />
            주소: {address}
          </p>
        </ContactInfo>
      </FooterInner>
      <Copyright>
        &copy; {new Date().getFullYear()} {copyright}. All rights reserved.
      </Copyright>
    </FooterWrapper>
  );
}
