import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Select, message } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { AxiosError } from 'axios';
import { InputField } from '../../components/InputField';
import { PasswordField } from '../../components/PasswordField';
import api from '../../api';
import { setAuth } from '../../store/authSlice';
import styles from './Login.module.scss';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<LoginForm>();
  const { t, i18n } = useTranslation();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/admin/login', data, { skipAuthRedirect: true });
      dispatch(setAuth(response.data));
      message.success(t('auth.loginSuccess'), 2);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status === 401) {
        message.error(t('auth.invalidCredentials'), 3);
      } else {
        message.error(error.response?.data?.message || t('auth.loginFailed'), 3);
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>{t('auth.adminPanel')}</h2>
          <p>{t('auth.pleaseSignIn')}</p>
        </div>
        <div className={styles.loginBody}>
          <div className={styles.languageSelector}>
            <label><GlobalOutlined /> {t('auth.language')}</label>
            <Select
              value={i18n.language}
              onChange={(value) => i18n.changeLanguage(value)}
              style={{ width: '100%' }}
              options={[
                { value: 'tr', label: 'Türkçe' },
                { value: 'en', label: 'English' }
              ]}
            />
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}>
            <InputField
              name="email"
              control={control}
              label={t('auth.email')}
              rules={{ required: t('auth.email') + ' ' + t('common.required') }}
              type="email"
              prefix={<UserOutlined />}
              placeholder="admin@example.com"
            />
            <PasswordField
              name="password"
              control={control}
              label={t('auth.password')}
              rules={{ required: t('auth.password') + ' ' + t('common.required') }}
              prefix={<LockOutlined />}
              placeholder="••••••••"
            />
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className={styles.submitButton}
              size="large"
            >
              {t('auth.loginButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
