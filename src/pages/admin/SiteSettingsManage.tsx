import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { siteSettingsApi, storageApi } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { theme } from '../../styles/GlobalStyles';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

const PageDescription = styled.p`
  margin-top: 0.5rem;
  color: ${theme.colors.secondary};
  font-size: 0.95rem;
`;

const SettingsCard = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 2rem;
  max-width: 600px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const HelpText = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.secondary};
  margin-top: 0.5rem;
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

const LogoPreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${theme.colors.backgroundAlt};
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    max-height: 60px;
    max-width: 200px;
    object-fit: contain;
  }
`;

const RemoveButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${theme.colors.error};
  border: 1px solid ${theme.colors.error};
  transition: all ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: #e6f7ed;
  color: #27ae60;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fdecea;
  color: ${theme.colors.error};
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

export function SiteSettingsManage() {
  const queryClient = useQueryClient();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'siteSettings'],
    queryFn: siteSettingsApi.getAll,
  });

  useEffect(() => {
    if (settings) {
      const logoSetting = settings.find(s => s.key === 'logo_url');
      if (logoSetting) {
        setLogoUrl(logoSetting.value);
      }
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await siteSettingsApi.setLogoUrl(logoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'siteSettings'] });
      queryClient.invalidateQueries({ queryKey: ['siteSettings', 'logo'] });
      setSuccessMessage('설정이 저장되었습니다.');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrorMessage('저장 중 오류가 발생했습니다.');
      setSuccessMessage('');
      console.error('Save error:', error);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage('');
    try {
      const url = await storageApi.uploadImage(file, 'logo');
      setLogoUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <PageHeader>
          <PageTitle>사이트 설정</PageTitle>
        </PageHeader>
        <SettingsCard>로딩 중...</SettingsCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>사이트 설정</PageTitle>
        <PageDescription>
          사이트의 기본 설정을 관리합니다.
        </PageDescription>
      </PageHeader>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <SettingsCard>
        <SectionTitle>로고 설정</SectionTitle>

        <FormGroup>
          <Label>사이트 로고</Label>
          <ImageUpload>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="logoUpload"
            />
            <label htmlFor="logoUpload" style={{ cursor: 'pointer' }}>
              {isUploading ? '업로드 중...' : '클릭하여 로고 이미지 업로드'}
            </label>
          </ImageUpload>
          <HelpText>
            권장 사이즈: 가로 200px 이상, 투명 배경 PNG 파일 권장
          </HelpText>

          {logoUrl && (
            <LogoPreview>
              <img src={logoUrl} alt="로고 미리보기" />
              <RemoveButton onClick={handleRemoveLogo}>
                로고 삭제
              </RemoveButton>
            </LogoPreview>
          )}
        </FormGroup>

        <ButtonGroup>
          <Button
            $variant="primary"
            onClick={handleSave}
            disabled={saveMutation.isPending || isUploading}
          >
            {saveMutation.isPending ? '저장 중...' : '설정 저장'}
          </Button>
        </ButtonGroup>
      </SettingsCard>
    </PageWrapper>
  );
}
