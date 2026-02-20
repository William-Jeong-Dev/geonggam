import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryApi } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { theme } from '../../styles/GlobalStyles';
import { Category } from '../../types';

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

const CategoryList = styled.div`
  max-width: 600px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CategoryOrder = styled.span`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.backgroundAlt};
  color: ${theme.colors.secondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const CategoryName = styled.span`
  font-size: 1rem;
  color: ${theme.colors.primary};
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
  max-width: 600px;
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
  max-width: 400px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

interface FormData {
  name: string;
  display_order: number;
}

const initialFormData: FormData = {
  name: '',
  display_order: 0,
};

export function CategoryManage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: categoryApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: (categories?.length || 0) + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      display_order: category.display_order,
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

    if (!formData.name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?\n이 카테고리를 사용하는 포트폴리오가 있을 수 있습니다.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>카테고리 관리</PageTitle>
        <Button $variant="primary" onClick={openCreateModal}>
          새 카테고리
        </Button>
      </PageHeader>

      {isLoading ? (
        <EmptyState>로딩 중...</EmptyState>
      ) : categories && categories.length > 0 ? (
        <CategoryList>
          {categories.map(category => (
            <CategoryItem key={category.id}>
              <CategoryInfo>
                <CategoryOrder>{category.display_order}</CategoryOrder>
                <CategoryName>{category.name}</CategoryName>
              </CategoryInfo>
              <ActionButtons>
                <ActionButton onClick={() => openEditModal(category)}>
                  수정
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDelete(category.id)}
                >
                  삭제
                </ActionButton>
              </ActionButtons>
            </CategoryItem>
          ))}
        </CategoryList>
      ) : (
        <EmptyState>
          등록된 카테고리가 없습니다.<br />
          카테고리를 추가하여 포트폴리오를 분류하세요.
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
                  {editingId ? '카테고리 수정' : '새 카테고리'}
                </ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>카테고리 이름 *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="예: 주거, 상업, 오피스"
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
