import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Typography, Select } from 'antd';
import { LogoutOutlined, DashboardOutlined, PlusOutlined, UnorderedListOutlined, MenuOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { setTasks, updateTask } from '../../store/tasksSlice';
import api from '../../api';
import socket from '../../socket';
import styles from './MainLayout.module.scss';

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { t, i18n } = useTranslation();
  const [siderOpen, setSiderOpen] = useState(false);

  useEffect(() => {
    loadTasks();

    socket.on('task:updated', (task) => {
      dispatch(updateTask(task));
    });

    return () => {
      socket.off('task:updated');
    };
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks');
      dispatch(setTasks(response.data));
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`${styles.mobileOverlay} ${siderOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSiderOpen(false)}
      />
      <Layout className={styles.mainLayout}>
        <Sider className={`${styles.sider} ${siderOpen ? styles.siderOpen : ''}`} width={250} collapsed={false}>
          <div className={styles.siderHeader}>
            <Title level={4}>{t('auth.userPanel')}</Title>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[window.location.pathname]}
            onClick={() => setSiderOpen(false)}
            items={[
              {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: t('menu.dashboard'),
                onClick: () => navigate('/dashboard')
              },
              {
                key: '/create',
                icon: <PlusOutlined />,
                label: t('menu.createTask'),
                onClick: () => navigate('/create')
              },
              {
                key: '/my-tasks',
                icon: <UnorderedListOutlined />,
                label: t('menu.myTasks'),
                onClick: () => navigate('/my-tasks')
              }
            ]}
          />
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <div className={styles.headerLeft}>
              <Button 
                className={styles.menuButton}
                icon={<MenuOutlined />} 
                onClick={() => setSiderOpen(!siderOpen)}
                type="text"
              />
              <div className={styles.headerUser}>
                <span>{t('common.welcome')}, {user?.email}</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <Select
                className={styles.languageSelector}
                value={i18n.language}
                onChange={(value) => i18n.changeLanguage(value)}
                options={[
                  { value: 'tr', label: 'Türkçe' },
                  { value: 'en', label: 'English' }
                ]}
              />
              <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                <span className="logout-text">{t('common.logout')}</span>
              </Button>
            </div>
          </Header>
          <Content className={styles.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
