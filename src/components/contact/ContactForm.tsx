import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { theme } from '../../styles/GlobalStyles';
import { inquiryApi } from '../../lib/supabase';
import { ContactFormData } from '../../types';

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
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

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};
  font-size: 1rem;
  transition: border-color ${theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.accent};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  transition: border-color ${theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.accent};
  }
`;

const ErrorMessage = styled.span`
  display: block;
  color: ${theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  background-color: ${theme.colors.backgroundAlt};

  h3 {
    font-size: 1.5rem;
    color: ${theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${theme.colors.secondary};
  }
`;

const PrivacyNotice = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    }

    if (!formData.message.trim()) {
      newErrors.message = '문의 내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await inquiryApi.create(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <SuccessMessage
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>문의가 접수되었습니다</h3>
        <p>빠른 시일 내에 연락드리겠습니다.</p>
      </SuccessMessage>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">이름 *</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="홍길동"
        />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">이메일 *</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="phone">연락처 *</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
        />
        {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message">문의 내용 *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="문의하실 내용을 자세히 적어주세요."
        />
        {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
      </FormGroup>

      <PrivacyNotice>
        입력하신 개인정보는 문의 응대 목적으로만 사용되며,
        문의 처리 완료 후 안전하게 파기됩니다.
      </PrivacyNotice>

      <Button
        type="submit"
        $variant="primary"
        $size="large"
        $fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? '전송 중...' : '문의하기'}
      </Button>
    </Form>
  );
}
