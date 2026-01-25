import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Typography, Tag, Select } from 'antd';
import { LogoutOutlined, DashboardOutlined, ClockCircleOutlined, UnorderedListOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { setTasks, addTask, updateTask } from '../../store/tasksSlice';
import { setAdminUsers, addAdminUser, updateAdminUser, removeAdminUser } from '../../store/adminUsersSlice';
import api from '../../api';
import socket from '../../socket';
import { AdminUser } from '../../types';
import styles from './MainLayout.module.scss';

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.auth.admin);
  const { t, i18n } = useTranslation();
  const [siderOpen, setSiderOpen] = useState(false);

  useEffect(() => {
    loadTasks();
    if (admin?.role === 'Admin') {
      loadAdminUsers();
    }

    socket.on('task:created', (task) => {
      dispatch(addTask(task));
    });

    socket.on('task:updated', (task) => {
      dispatch(updateTask(task));
    });

    socket.on('adminUser:changed', (data: { type: 'created' | 'updated' | 'deleted'; data?: AdminUser; id?: string }) => {
      if (data.type === 'created' && data.data) {
        dispatch(addAdminUser(data.data));
      } else if (data.type === 'updated' && data.data) {
        dispatch(updateAdminUser(data.data));
      } else if (data.type === 'deleted' && data.id) {
        dispatch(removeAdminUser(data.id));
      }
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('adminUser:changed');
    };
  }, [admin?.role]);

  const loadTasks = async () => {
    try {
      const response = await api.get('/admin/tasks');
      dispatch(setTasks(response.data));
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const response = await api.get('/admin-users');
      dispatch(setAdminUsers(response.data));
    } catch (error) {
      console.error('Failed to load admin users', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('menu.dashboard'),
      onClick: () => navigate('/dashboard')
    },
    {
      key: '/pending',
      icon: <ClockCircleOutlined />,
      label: t('menu.pendingTasks'),
      onClick: () => navigate('/pending')
    }
  ];

  if (admin?.role !== 'Viewer') {
    menuItems.push({
      key: '/tasks',
      icon: <UnorderedListOutlined />,
      label: t('menu.allTasks'),
      onClick: () => navigate('/tasks')
    });
  }

  if (admin?.role === 'Admin') {
    menuItems.push({
      key: '/admin-users',
      icon: <UserOutlined />,
      label: t('menu.adminUsers'),
      onClick: () => navigate('/admin-users')
    });
  }

  return (
    <>
      <div 
        className={`${styles.mobileOverlay} ${siderOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSiderOpen(false)}
      />
      <Layout className={styles.mainLayout}>
        <Sider className={`${styles.sider} ${siderOpen ? styles.siderOpen : ''}`} width={250} collapsed={false}>
          <div className={styles.siderHeader}>
            <Title level={4}>{t('auth.adminPanel')}</Title>
          </div>
          <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={[window.location.pathname]} 
            items={menuItems}
            onClick={() => setSiderOpen(false)}
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
                <span>{t('common.welcome')}, {admin?.name}</span>
                <Tag color="blue">{t(`adminUsers.${admin?.role?.toLowerCase()}`)}</Tag>
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
