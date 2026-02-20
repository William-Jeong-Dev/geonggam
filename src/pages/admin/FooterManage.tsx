import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { siteSettingsApi } from '../../lib/supabase';
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
  max-width: 800px;
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
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
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

const PreviewSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
`;

const PreviewTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const PreviewContent = styled.div`
  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
    white-space: pre-line;
  }
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

export function FooterManage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    companyName: defaultFooter.companyName,
    companyDescription: defaultFooter.companyDescription,
    email: defaultFooter.email,
    phone: defaultFooter.phone,
    address: defaultFooter.address,
    copyright: defaultFooter.copyright,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'siteSettings'],
    queryFn: siteSettingsApi.getAll,
  });

  useEffect(() => {
    if (settings) {
      const getSetting = (key: string, defaultValue: string) => {
        const setting = settings.find(s => s.key === key);
        return setting?.value || defaultValue;
      };

      setFormData({
        companyName: getSetting('footer_company_name', defaultFooter.companyName),
        companyDescription: getSetting('footer_company_description', defaultFooter.companyDescription),
        email: getSetting('footer_email', defaultFooter.email),
        phone: getSetting('footer_phone', defaultFooter.phone),
        address: getSetting('footer_address', defaultFooter.address),
        copyright: getSetting('footer_copyright', defaultFooter.copyright),
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        siteSettingsApi.upsert('footer_company_name', formData.companyName),
        siteSettingsApi.upsert('footer_company_description', formData.companyDescription),
        siteSettingsApi.upsert('footer_email', formData.email),
        siteSettingsApi.upsert('footer_phone', formData.phone),
        siteSettingsApi.upsert('footer_address', formData.address),
        siteSettingsApi.upsert('footer_copyright', formData.copyright),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'siteSettings'] });
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
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

  const handleSave = () => {
    saveMutation.mutate();
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <PageHeader>
          <PageTitle>푸터 설정</PageTitle>
        </PageHeader>
        <SettingsCard>로딩 중...</SettingsCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>푸터 설정</PageTitle>
        <PageDescription>
          웹사이트 하단에 표시되는 푸터 정보를 관리합니다.
        </PageDescription>
      </PageHeader>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <SettingsCard>
        <SectionTitle>회사 정보</SectionTitle>

        <FormGroup>
          <Label>회사명</Label>
          <Input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          />
          <HelpText>푸터 상단에 표시되는 회사명입니다.</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>회사 설명</Label>
          <Textarea
            value={formData.companyDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
          />
          <HelpText>회사 소개, 사업자등록번호 등을 입력합니다. 줄바꿈이 반영됩니다.</HelpText>
        </FormGroup>

        <SectionTitle>연락처 정보</SectionTitle>

        <FormGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>전화번호</Label>
          <Input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>주소</Label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </FormGroup>

        <SectionTitle>저작권 정보</SectionTitle>

        <FormGroup>
          <Label>저작권 표시</Label>
          <Input
            type="text"
            value={formData.copyright}
            onChange={(e) => setFormData(prev => ({ ...prev, copyright: e.target.value }))}
          />
          <HelpText>© 2026 [저작권 표시]. All rights reserved. 형식으로 표시됩니다.</HelpText>
        </FormGroup>

        <ButtonGroup>
          <Button
            $variant="primary"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? '저장 중...' : '설정 저장'}
          </Button>
        </ButtonGroup>

        <PreviewSection>
          <PreviewTitle>미리보기</PreviewTitle>
          <PreviewContent>
            <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>
              {formData.companyName}
            </p>
            <p>{formData.companyDescription}</p>
            <p style={{ marginTop: '1rem' }}>
              이메일: {formData.email}<br />
              전화: {formData.phone}<br />
              주소: {formData.address}
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              © {new Date().getFullYear()} {formData.copyright}. All rights reserved.
            </p>
          </PreviewContent>
        </PreviewSection>
      </SettingsCard>
    </PageWrapper>
  );
}
