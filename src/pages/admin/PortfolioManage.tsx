import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioApi, storageApi, categoryApi } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { theme } from '../../styles/GlobalStyles';
import { Portfolio } from '../../types';

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

const Thumbnail = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  background-color: ${theme.colors.backgroundAlt};
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

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  font-size: 1rem;
  background-color: ${theme.colors.white};

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

const ImageUpload = styled.div`
  border: 2px dashed ${theme.colors.border};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color ${theme.transitions.default};

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.secondary};
`;

interface FormData {
  title: string;
  description: string;
  category: string;
  images: string[];
  is_published: boolean;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  category: '',
  images: [],
  is_published: false,
};

export function PortfolioManage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['admin', 'portfolios'],
    queryFn: portfolioApi.getAll,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const categories = categoriesData?.map(c => c.name) || ['주거', '상업', '오피스', '기타'];

  const createMutation = useMutation({
    mutationFn: (data: FormData) => portfolioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'portfolios'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Portfolio> }) =>
      portfolioApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'portfolios'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => portfolioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'portfolios'] });
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (portfolio: Portfolio) => {
    setEditingId(portfolio.id);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      images: portfolio.images,
      is_published: portfolio.is_published,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file =>
        storageApi.uploadImage(file)
      );
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>포트폴리오 관리</PageTitle>
        <Button $variant="primary" onClick={openCreateModal}>
          새 포트폴리오
        </Button>
      </PageHeader>

      {isLoading ? (
        <EmptyState>로딩 중...</EmptyState>
      ) : portfolios && portfolios.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>이미지</Th>
              <Th>제목</Th>
              <Th>카테고리</Th>
              <Th>상태</Th>
              <Th>등록일</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map(portfolio => (
              <tr key={portfolio.id}>
                <Td>
                  <Thumbnail
                    src={portfolio.images[0] || ''}
                    alt={portfolio.title}
                  />
                </Td>
                <Td>{portfolio.title}</Td>
                <Td>{portfolio.category}</Td>
                <Td>
                  <Badge $type={portfolio.is_published ? 'success' : 'warning'}>
                    {portfolio.is_published ? '공개' : '비공개'}
                  </Badge>
                </Td>
                <Td>{formatDate(portfolio.created_at)}</Td>
                <Td>
                  <Actions>
                    <ActionButton onClick={() => openEditModal(portfolio)}>
                      수정
                    </ActionButton>
                    <ActionButton
                      className="delete"
                      onClick={() => handleDelete(portfolio.id)}
                    >
                      삭제
                    </ActionButton>
                  </Actions>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState>등록된 포트폴리오가 없습니다.</EmptyState>
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
                  {editingId ? '포트폴리오 수정' : '새 포트폴리오'}
                </ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>제목</Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>카테고리</Label>
                  <Select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>설명</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>이미지</Label>
                  <ImageUpload>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                      {isUploading ? '업로드 중...' : '클릭하여 이미지 업로드'}
                    </label>
                  </ImageUpload>
                  {formData.images.length > 0 && (
                    <ImagePreviewGrid>
                      {formData.images.map((url, index) => (
                        <ImagePreview key={index}>
                          <img src={url} alt="" />
                          <button type="button" onClick={() => removeImage(index)}>
                            &times;
                          </button>
                        </ImagePreview>
                      ))}
                    </ImagePreviewGrid>
                  )}
                </FormGroup>

                <FormGroup>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={e => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    />
                    공개
                  </CheckboxLabel>
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
