import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlideApi, storageApi } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { theme } from '../../styles/GlobalStyles';
import { HeroSlide } from '../../types';

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

const SlideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SlideCard = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

const SlideImage = styled.div<{ $image: string }>`
  aspect-ratio: 16/9;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.backgroundAlt};
`;

const SlideInfo = styled.div`
  padding: 1rem;
`;

const SlideTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const SlideSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.secondary};
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SlideActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.border};
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
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

const Badge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: ${props => props.$active ? '#e6f7ed' : '#fff3e0'};
  color: ${props => props.$active ? '#27ae60' : '#f39c12'};
  margin-bottom: 0.5rem;
`;

const OrderBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: ${theme.colors.backgroundAlt};
  color: ${theme.colors.secondary};
  margin-left: 0.5rem;
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
  min-height: 100px;
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

const ImagePreview = styled.div`
  margin-top: 1rem;

  img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
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
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
`;

interface FormData {
  image_url: string;
  title: string;
  subtitle: string;
  display_order: number;
  is_active: boolean;
}

const initialFormData: FormData = {
  image_url: '',
  title: '',
  subtitle: '',
  display_order: 0,
  is_active: true,
};

export function HeroSlideManage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);

  const { data: slides, isLoading } = useQuery({
    queryKey: ['admin', 'heroSlides'],
    queryFn: heroSlideApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => heroSlideApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HeroSlide> }) =>
      heroSlideApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => heroSlideApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: (slides?.length || 0) + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setFormData({
      image_url: slide.image_url,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      display_order: slide.display_order,
      is_active: slide.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await storageApi.uploadImage(file, 'hero');
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url) {
      alert('이미지를 업로드해주세요.');
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

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>히어로 슬라이드 관리</PageTitle>
        <Button $variant="primary" onClick={openCreateModal}>
          새 슬라이드
        </Button>
      </PageHeader>

      {isLoading ? (
        <EmptyState>로딩 중...</EmptyState>
      ) : slides && slides.length > 0 ? (
        <SlideGrid>
          {slides.map(slide => (
            <SlideCard key={slide.id}>
              <SlideImage $image={slide.image_url} />
              <SlideInfo>
                <div>
                  <Badge $active={slide.is_active}>
                    {slide.is_active ? '활성' : '비활성'}
                  </Badge>
                  <OrderBadge>순서: {slide.display_order}</OrderBadge>
                </div>
                <SlideTitle>{slide.title || '(제목 없음)'}</SlideTitle>
                <SlideSubtitle>{slide.subtitle || '(설명 없음)'}</SlideSubtitle>
                <SlideActions>
                  <ActionButton onClick={() => openEditModal(slide)}>
                    수정
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => handleDelete(slide.id)}
                  >
                    삭제
                  </ActionButton>
                </SlideActions>
              </SlideInfo>
            </SlideCard>
          ))}
        </SlideGrid>
      ) : (
        <EmptyState>
          등록된 슬라이드가 없습니다.<br />
          슬라이드를 추가하면 홈 화면에 이미지가 표시됩니다.
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
                  {editingId ? '슬라이드 수정' : '새 슬라이드'}
                </ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>이미지 *</Label>
                  <ImageUpload>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="heroImageUpload"
                    />
                    <label htmlFor="heroImageUpload" style={{ cursor: 'pointer' }}>
                      {isUploading ? '업로드 중...' : '클릭하여 이미지 업로드'}
                    </label>
                  </ImageUpload>
                  {formData.image_url && (
                    <ImagePreview>
                      <img src={formData.image_url} alt="Preview" />
                    </ImagePreview>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>제목 (선택)</Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="공간에 감성을 더하다"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>설명 (선택)</Label>
                  <Textarea
                    value={formData.subtitle}
                    onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="설명을 입력하세요"
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

                <FormGroup>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                    활성화 (홈 화면에 표시)
                  </CheckboxLabel>
                </FormGroup>

                <ButtonGroup>
                  <Button type="button" $variant="outline" onClick={closeModal}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    $variant="primary"
                    disabled={createMutation.isPending || updateMutation.isPending || isUploading}
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
