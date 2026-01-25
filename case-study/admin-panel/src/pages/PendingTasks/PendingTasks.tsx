import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Tag, Button, Modal, message, Tooltip, Empty, Select, Input } from 'antd';
import { CheckOutlined, CloseOutlined, InboxOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextAreaField } from '../../components/TextAreaField';
import { RootState, AppDispatch } from '../../store';
import { Task } from '../../types';
import { approveTask, rejectTask } from '../../store/tasksSlice';
import styles from './PendingTasks.module.scss';

interface RejectForm {
  rejectionReason: string;
}

export default function PendingTasks() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Applied filters
  const [searchText, setSearchText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Temporary filters (for form)
  const [tempSearchText, setTempSearchText] = useState('');
  const [tempPriorityFilter, setTempPriorityFilter] = useState<string>('all');
  const [tempCategoryFilter, setTempCategoryFilter] = useState<string>('all');
  
  const { control, handleSubmit, reset } = useForm<RejectForm>();

  const pendingTasks = tasks
    .filter(t => t.status === 'pending')
    .filter(task => {
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      const matchesSearch = 
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.createdBy.toLowerCase().includes(searchText.toLowerCase());
      return matchesPriority && matchesCategory && matchesSearch;
    });
  const canModify = admin?.role === 'Admin' || admin?.role === 'Moderator';

  const handleApplyFilters = () => {
    setSearchText(tempSearchText);
    setPriorityFilter(tempPriorityFilter);
    setCategoryFilter(tempCategoryFilter);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setTempSearchText('');
    setTempPriorityFilter('all');
    setTempCategoryFilter('all');
  };

  const handleApprove = async (taskId: string) => {
    try {
      await dispatch(approveTask(taskId)).unwrap();
      message.success(t('tasks.taskApproved'));
    } catch (err) {
      const error = err as string;
      message.error(error || t('tasks.failedToApprove'));
    }
  };

  const handleRejectClick = (task: Task) => {
    setSelectedTask(task);
    setRejectModalOpen(true);
  };

  const onRejectSubmit = async (data: RejectForm) => {
    if (!selectedTask) return;

    try {
      await dispatch(rejectTask({ taskId: selectedTask.id, reason: data.rejectionReason })).unwrap();
      message.success(t('tasks.taskRejected'));
      setRejectModalOpen(false);
      reset();
      setSelectedTask(null);
    } catch (err) {
      const error = err as string;
      message.error(error || t('tasks.failedToReject'));
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'blue',
      normal: 'green',
      high: 'orange',
      urgent: 'red'
    };
    return colors[priority];
  };

  const columns: ColumnsType<Task> = [
    {
      title: t('tasks.title'),
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: t('tasks.description'),
      dataIndex: 'description',
      key: 'description',
      width: 300
    },
    {
      title: t('tasks.priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{t(`tasks.${priority}`)}</Tag>
      )
    },
    {
      title: t('tasks.category'),
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: t('tasks.createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: t('tasks.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Tooltip title={!canModify ? t('tasks.noPermissionApprove') : ''}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
              loading={loading}
              disabled={!canModify}
            >
              {t('tasks.approve')}
            </Button>
          </Tooltip>
          <Tooltip title={!canModify ? t('tasks.noPermissionReject') : ''}>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleRejectClick(record)}
              disabled={!canModify}
            >
              {t('tasks.reject')}
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  const renderMobileCard = (task: Task) => (
    <div key={task.id} className={styles.taskCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{task.title}</h3>
        <Tag color={getPriorityColor(task.priority)}>{t(`tasks.${task.priority}`)}</Tag>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>{t('tasks.description')}</span>
          <span className={styles.cardValue}>{task.description}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>{t('tasks.category')}</span>
          <span className={styles.cardValue}>{task.category}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>{t('tasks.createdBy')}</span>
          <span className={styles.cardValue}>{task.createdBy}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>{t('tasks.createdAt')}</span>
          <span className={styles.cardValue}>{new Date(task.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className={styles.cardActions}>
        <Tooltip title={!canModify ? t('tasks.noPermissionApprove') : ''}>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(task.id)}
            loading={loading}
            disabled={!canModify}
            block
          >
            {t('tasks.approve')}
          </Button>
        </Tooltip>
        <Tooltip title={!canModify ? t('tasks.noPermissionReject') : ''}>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleRejectClick(task)}
            disabled={!canModify}
            block
          >
            {t('tasks.reject')}
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <div className={styles.tasksPage}>
      <h1>{t('tasks.pendingTasks')}</h1>
      
      <div className={styles.filterContainer}>
        <div className={styles.filterSection}>
          <Input
            className={styles.searchInput}
            placeholder={t('tasks.searchTasks')}
            value={tempSearchText}
            onChange={(e) => setTempSearchText(e.target.value)}
            size="large"
          />
          <Select
            className={styles.filterSelect}
            value={tempPriorityFilter}
            onChange={setTempPriorityFilter}
            size="large"
          >
            <Select.Option value="all">{t('tasks.allPriorities')}</Select.Option>
            <Select.Option value="low">{t('tasks.low')}</Select.Option>
            <Select.Option value="normal">{t('tasks.normal')}</Select.Option>
            <Select.Option value="high">{t('tasks.high')}</Select.Option>
            <Select.Option value="urgent">{t('tasks.urgent')}</Select.Option>
          </Select>
          <Select
            className={styles.filterSelect}
            value={tempCategoryFilter}
            onChange={setTempCategoryFilter}
            size="large"
          >
            <Select.Option value="all">{t('tasks.allCategories')}</Select.Option>
            <Select.Option value="Teknik Destek">{t('tasks.technicalSupport')}</Select.Option>
            <Select.Option value="İzin Talebi">{t('tasks.leaveRequest')}</Select.Option>
            <Select.Option value="Satın Alma">{t('tasks.purchasing')}</Select.Option>
            <Select.Option value="Diğer">{t('tasks.other')}</Select.Option>
          </Select>
        </div>
        <div className={styles.filterButtons}>
          <Button type="primary" onClick={handleApplyFilters} size="large">
            {t('tasks.applyFilters')}
          </Button>
          <Button onClick={handleClearFilters} size="large">
            {t('tasks.clearFilters')}
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={styles.desktopTable}>
        <Table
          columns={columns}
          dataSource={pendingTasks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('tasks.noTasks')}
              />
            )
          }}
        />
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCards}>
        {pendingTasks.length > 0 ? (
          pendingTasks.map(renderMobileCard)
        ) : (
          <div className={styles.emptyState}>
            <InboxOutlined />
            <p>{t('tasks.noTasks')}</p>
          </div>
        )}
      </div>

      <Modal
        title={t('tasks.rejectTask')}
        open={rejectModalOpen}
        onCancel={() => {
          setRejectModalOpen(false);
          reset();
          setSelectedTask(null);
        }}
        footer={null}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onRejectSubmit)(e);
        }}>
          <TextAreaField
            name="rejectionReason"
            control={control}
            label={t('tasks.rejectionReason')}
            rules={{ required: t('tasks.enterRejectionReason') }}
            rows={4}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => {
              setRejectModalOpen(false);
              reset();
              setSelectedTask(null);
            }}>
              {t('common.cancel')}
            </Button>
            <Button type="primary" danger htmlType="submit" loading={loading}>
              {t('tasks.reject')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
