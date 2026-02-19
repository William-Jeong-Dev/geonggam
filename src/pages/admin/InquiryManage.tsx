import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { inquiryApi } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { theme } from '../../styles/GlobalStyles';
import { Inquiry } from '../../types';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${theme.colors.secondary};
  background-color: ${theme.colors.backgroundAlt};
  border-bottom: 1px solid ${theme.colors.border};
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
  font-size: 0.95rem;
`;

const Badge = styled.span<{ $type: 'success' | 'warning' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: ${props => props.$type === 'success' ? '#e6f7ed' : '#fff3e0'};
  color: ${props => props.$type === 'success' ? '#27ae60' : '#f39c12'};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${theme.colors.secondary};
  border: 1px solid ${theme.colors.border};
  transition: all ${theme.transitions.default};

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }

  &.delete:hover {
    border-color: ${theme.colors.error};
    color: ${theme.colors.error};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const CloseButton = styled.button`
  font-size: 1.5rem;
  color: ${theme.colors.secondary};

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.secondary};
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.span`
  display: block;
  font-size: 1rem;
  color: ${theme.colors.primary};
  line-height: 1.6;
`;

const MessageBox = styled.div`
  padding: 1.5rem;
  background-color: ${theme.colors.backgroundAlt};
  white-space: pre-wrap;
  line-height: 1.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.border};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.secondary};
`;

const ClickableRow = styled.tr`
  cursor: pointer;
  transition: background-color ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.backgroundAlt};
  }
`;

export function InquiryManage() {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin', 'inquiries'],
    queryFn: inquiryApi.getAll,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => inquiryApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inquiryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
      setSelectedInquiry(null);
    },
  });

  const openDetail = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.is_read) {
      markAsReadMutation.mutate(inquiry.id);
    }
  };

  const closeDetail = () => {
    setSelectedInquiry(null);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <PageWrapper>
      <PageTitle>문의 관리</PageTitle>

      {isLoading ? (
        <EmptyState>로딩 중...</EmptyState>
      ) : inquiries && inquiries.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>상태</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>연락처</Th>
              <Th>접수일</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <ClickableRow key={inquiry.id} onClick={() => openDetail(inquiry)}>
                <Td>
                  <Badge $type={inquiry.is_read ? 'success' : 'warning'}>
                    {inquiry.is_read ? '확인' : '미확인'}
                  </Badge>
                </Td>
                <Td>{inquiry.name}</Td>
                <Td>{inquiry.email}</Td>
                <Td>{inquiry.phone}</Td>
                <Td>{formatDate(inquiry.created_at)}</Td>
                <Td>
                  <Actions onClick={e => e.stopPropagation()}>
                    <ActionButton onClick={() => openDetail(inquiry)}>
                      상세
                    </ActionButton>
                    <ActionButton
                      className="delete"
                      onClick={(e) => handleDelete(inquiry.id, e)}
                    >
                      삭제
                    </ActionButton>
                  </Actions>
                </Td>
              </ClickableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState>접수된 문의가 없습니다.</EmptyState>
      )}

      <AnimatePresence>
        {selectedInquiry && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetail}
          >
            <ModalContent
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>문의 상세</ModalTitle>
                <CloseButton onClick={closeDetail}>&times;</CloseButton>
              </ModalHeader>

              <DetailItem>
                <DetailLabel>이름</DetailLabel>
                <DetailValue>{selectedInquiry.name}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>이메일</DetailLabel>
                <DetailValue>
                  <a href={`mailto:${selectedInquiry.email}`}>
                    {selectedInquiry.email}
                  </a>
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>연락처</DetailLabel>
                <DetailValue>
                  <a href={`tel:${selectedInquiry.phone}`}>
                    {selectedInquiry.phone}
                  </a>
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>접수일시</DetailLabel>
                <DetailValue>{formatDate(selectedInquiry.created_at)}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>문의 내용</DetailLabel>
                <MessageBox>{selectedInquiry.message}</MessageBox>
              </DetailItem>

              <ButtonGroup>
                <Button
                  $variant="outline"
                  onClick={() => handleDelete(selectedInquiry.id)}
                >
                  삭제
                </Button>
                <Button
                  $variant="primary"
                  onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                >
                  이메일 답장
                </Button>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
