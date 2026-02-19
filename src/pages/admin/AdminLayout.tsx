import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/GlobalStyles';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 2rem 0;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 200px;
  }
`;

const Logo = styled(Link)`
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.white};
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: ${props => props.$active ? theme.colors.white : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  transition: all ${theme.transitions.default};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.white};
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
  transition: all ${theme.transitions.default};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.white};
  }
`;

const Main = styled.main`
  flex: 1;
  background-color: ${theme.colors.backgroundAlt};
  overflow-y: auto;
`;

const navItems = [
  { label: '대시보드', path: '/admin/dashboard' },
  { label: '히어로 슬라이드', path: '/admin/hero-slides' },
  { label: '포트폴리오 관리', path: '/admin/portfolio' },
  { label: '문의 관리', path: '/admin/inquiries' },
  { label: '사이트 설정', path: '/admin/settings' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/admin');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutWrapper>
      <Sidebar>
        <Logo to="/admin/dashboard">정감공간 Admin</Logo>
        <Nav>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </Sidebar>
      <Main>
        <Outlet />
      </Main>
    </LayoutWrapper>
  );
}
