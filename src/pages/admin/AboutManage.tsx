import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { aboutContentApi } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { theme } from '../../styles/GlobalStyles';
import { AboutContent } from '../../types';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

const SectionTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  color: ${props => props.$active ? theme.colors.white : theme.colors.primary};
  background-color: ${props => props.$active ? theme.colors.primary : 'transparent'};
  border: 1px solid ${theme.colors.primary};
  transition: all ${theme.transitions.default};

  &:hover {
    background-color: ${props => props.$active ? theme.colors.primary : theme.colors.backgroundAlt};
  }
`;

const ContentList = styled.div`
  max-width: 800px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
`;

const ContentItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const ContentTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const ContentText = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.secondary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ActionButtons = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.secondary};
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  max-width: 800px;
`;

// Modal styles
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const sections = [
  { key: 'intro', label: '소개글' },
  { key: 'values', label: '핵심 가치' },
  { key: 'process', label: '진행 과정' },
];

interface FormData {
  section: string;
  title: string;
  content: string;
  display_order: number;
}

const initialFormData: FormData = {
  section: 'intro',
  title: '',
  content: '',
  display_order: 0,
};

export function AboutManage() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('intro');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const { data: allContent, isLoading } = useQuery({
    queryKey: ['admin', 'aboutContent'],
    queryFn: aboutContentApi.getAll,
  });

  const filteredContent = allContent?.filter(c => c.section === activeSection) || [];

  const createMutation = useMutation({
    mutationFn: (data: FormData) => aboutContentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'aboutContent'] });
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AboutContent> }) =>
      aboutContentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'aboutContent'] });
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => aboutContentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'aboutContent'] });
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      section: activeSection,
      display_order: filteredContent.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (content: AboutContent) => {
    setEditingId(content.id);
    setFormData({
      section: content.section,
      title: content.title,
      content: content.content,
      display_order: content.display_order,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const getSectionLabel = (key: string) => {
    if (key === 'intro') return '소개글';
    if (key === 'values') return '핵심 가치';
    if (key === 'process') return '진행 과정';
    return key;
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>소개 페이지 관리</PageTitle>
        <Button $variant="primary" onClick={openCreateModal}>
          새 콘텐츠
        </Button>
      </PageHeader>

      <SectionTabs>
        {sections.map(section => (
          <TabButton
            key={section.key}
            $active={activeSection === section.key}
            onClick={() => setActiveSection(section.key)}
          >
            {section.label}
          </TabButton>
        ))}
      </SectionTabs>

      {isLoading ? (
        <EmptyState>로딩 중...</EmptyState>
      ) : filteredContent.length > 0 ? (
        <ContentList>
          {filteredContent.map(content => (
            <ContentItem key={content.id}>
              <ContentHeader>
                <ContentTitle>{content.title}</ContentTitle>
                <ActionButtons>
                  <ActionButton onClick={() => openEditModal(content)}>
                    수정
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => handleDelete(content.id)}
                  >
                    삭제
                  </ActionButton>
                </ActionButtons>
              </ContentHeader>
              <ContentText>{content.content}</ContentText>
            </ContentItem>
          ))}
        </ContentList>
      ) : (
        <EmptyState>
          {getSectionLabel(activeSection)} 콘텐츠가 없습니다.<br />
          콘텐츠를 추가하여 소개 페이지를 구성하세요.
        </EmptyState>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {editingId ? '콘텐츠 수정' : '새 콘텐츠'}
                </ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>제목 *</Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="제목을 입력하세요"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>내용</Label>
                  <Textarea
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="내용을 입력하세요"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>표시 순서</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    min={0}
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button type="button" $variant="outline" onClick={closeModal}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    $variant="primary"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingId ? '수정' : '등록'}
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
