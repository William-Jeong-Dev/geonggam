import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/GlobalStyles';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.white};
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  font-size: 1.75rem;
  font-weight: 500;
  color: ${props => props.$active ? theme.colors.primary : theme.colors.secondary};
  transition: color ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const navItems = [
  { label: '홈', path: '/' },
  { label: '소개', path: '/about' },
  { label: '포트폴리오', path: '/portfolio' },
  { label: '문의', path: '/contact' },
];

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NavList>
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  $active={location.pathname === item.path}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </NavList>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
