import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { HamburgerMenu } from './HamburgerMenu';
import { theme } from '../../styles/GlobalStyles';
import { siteSettingsApi } from '../../lib/supabase';

const HeaderWrapper = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent'};
  transition: background-color ${theme.transitions.default};
  backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'none'};
`;

const HeaderInner = styled.div`
  max-width: ${theme.maxWidth.wide};
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1rem 1.5rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-left: -0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  letter-spacing: -0.02em;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const LogoImage = styled.img`
  height: 56px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 44px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  font-size: 0.95rem;
  font-weight: 400;
  color: ${props => props.$active ? theme.colors.primary : theme.colors.secondary};
  position: relative;
  transition: color ${theme.transitions.default};

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 1px;
    background-color: ${theme.colors.primary};
    transition: width ${theme.transitions.default};
  }

  &:hover {
    color: ${theme.colors.primary};

    &::after {
      width: 100%;
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  padding: 0;
  z-index: 101;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: ${theme.colors.primary};
    transition: transform ${theme.transitions.default}, opacity ${theme.transitions.default};
  }

  &.open {
    span:first-child {
      transform: translateY(8px) rotate(45deg);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:last-child {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
`;

const navItems = [
  { label: '소개', path: '/about' },
  { label: '포트폴리오', path: '/portfolio' },
  { label: '문의', path: '/contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const { data: logoUrl } = useQuery({
    queryKey: ['siteSettings', 'logo'],
    queryFn: siteSettingsApi.getLogoUrl,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      <HeaderWrapper $scrolled={scrolled || location.pathname !== '/'}>
        <HeaderInner>
          <LogoLink to="/">
            {logoUrl ? (
              <LogoImage src={logoUrl} alt="정감공간" />
            ) : (
              <LogoText>정감공간</LogoText>
            )}
          </LogoLink>
          <Nav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
          <HamburgerButton
            className={menuOpen ? 'open' : ''}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <span />
            <span />
            <span />
          </HamburgerButton>
        </HeaderInner>
      </HeaderWrapper>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
