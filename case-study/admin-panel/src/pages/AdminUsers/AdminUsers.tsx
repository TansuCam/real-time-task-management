import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Modal, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InputField } from '../../components/InputField';
import { PasswordField } from '../../components/PasswordField';
import { SelectField } from '../../components/SelectField';
import { RootState, AppDispatch } from '../../store';
import { AdminUser } from '../../types';
import { createAdminUser, updateAdminUserAsync, deleteAdminUser } from '../../store/adminUsersSlice';

interface AdminUserForm {
  name: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'Viewer';
  password?: string;
}

export default function AdminUsers() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const adminUsers = useSelector((state: RootState) => state.adminUsers.adminUsers);
  const loading = useSelector((state: RootState) => state.adminUsers.loading);
  const currentAdmin = useSelector((state: RootState) => state.auth.admin);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const { control, handleSubmit, reset } = useForm<AdminUserForm>();

  const handleCreate = () => {
    reset({ name: '', email: '', role: 'Viewer', password: '' });
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    reset({ name: user.name, email: user.email, role: user.role });
    setEditingUser(user);
    setModalOpen(true);
  };

  const onSubmit = async (data: AdminUserForm) => {
    try {
      if (editingUser) {
        await dispatch(updateAdminUserAsync({ id: editingUser.id, data })).unwrap();
        message.success(t('adminUsers.userUpdated'));
      } else {
        await dispatch(createAdminUser(data as { name: string; email: string; role: string; password: string })).unwrap();
        message.success(t('adminUsers.userCreated'));
      }
      setModalOpen(false);
      reset();
      setEditingUser(null);
    } catch (err) {
      const error = err as string;
      message.error(error || t(editingUser ? 'adminUsers.failedToUpdate' : 'adminUsers.failedToCreate'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteAdminUser(id)).unwrap();
      message.success(t('adminUsers.userDeleted'));
    } catch (err) {
      const error = err as string;
      message.error(error || t('adminUsers.failedToDelete'));
    }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: t('adminUsers.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('adminUsers.email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: t('adminUsers.role'),
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('adminUsers.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger icon={<DeleteOutlined />}>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (currentAdmin?.role !== 'Admin') {
    return (
      <div>
        <h1>{t('adminUsers.title')}</h1>
        <p>{t('adminUsers.noPermission')}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>{t('adminUsers.title')}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('adminUsers.addUser')}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={adminUsers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? t('adminUsers.editUser') : t('adminUsers.addUser')}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          reset();
          setEditingUser(null);
        }}
        footer={null}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}>
          <InputField
            name="name"
            control={control}
            label={t('adminUsers.name')}
            rules={{ required: t('adminUsers.name') + ' ' + t('common.required') }}
          />
          <InputField
            name="email"
            control={control}
            label={t('adminUsers.email')}
            rules={{ required: t('adminUsers.email') + ' ' + t('common.required') }}
            type="email"
          />
          <SelectField
            name="role"
            control={control}
            label={t('adminUsers.role')}
            rules={{ required: t('adminUsers.role') + ' ' + t('common.required') }}
            options={[
              { value: 'Admin', label: t('adminUsers.admin') },
              { value: 'Moderator', label: t('adminUsers.moderator') },
              { value: 'Viewer', label: t('adminUsers.viewer') }
            ]}
          />
          <PasswordField
            name="password"
            control={control}
            label={t('auth.password')}
            rules={{ required: !editingUser ? t('auth.password') + ' ' + t('common.required') : false }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => {
              setModalOpen(false);
              reset();
              setEditingUser(null);
            }}>
              {t('common.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingUser ? t('common.save') : t('adminUsers.addUser')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
