import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag, Select, Input, Empty, Button } from 'antd';
import { InboxOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { Task } from '../../types';
import TaskDetailModal from './TaskDetailModal';
import styles from './MyTasks.module.scss';

export default function MyTasks() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { t } = useTranslation();

  const handleViewDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'blue',
      normal: 'green',
      high: 'orange',
      urgent: 'red'
    };
    return colors[priority];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'gold',
      approved: 'green',
      rejected: 'red'
    };
    return colors[status];
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
      width: 300,
      ellipsis: true
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
      title: t('tasks.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{t(`tasks.${status}`)}</Tag>
      )
    },
    {
      title: t('tasks.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 100,
      render: (_: any, record: Task) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        />
      )
    }
  ];

  const renderMobileCard = (task: Task) => (
    <div key={task.id} className={styles.taskCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{task.title}</h3>
        <div className={styles.cardBadges}>
          <Tag color={getPriorityColor(task.priority)}>{t(`tasks.${task.priority}`)}</Tag>
          <Tag color={getStatusColor(task.status)}>{t(`tasks.${task.status}`)}</Tag>
        </div>
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
          <span className={styles.cardLabel}>{t('tasks.createdAt')}</span>
          <span className={styles.cardValue}>{new Date(task.createdAt).toLocaleString()}</span>
        </div>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(task)}
          block
        >
          {t('common.view')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.tasksPage}>
      <h1>{t('tasks.myTasks')}</h1>
      <div className={styles.filterSection}>
        <Input
          className={styles.searchInput}
          placeholder={t('tasks.searchTasks')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="large"
        />
        <Select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={setStatusFilter}
          size="large"
        >
          <Select.Option value="all">{t('tasks.allStatus')}</Select.Option>
          <Select.Option value="pending">{t('tasks.pending')}</Select.Option>
          <Select.Option value="approved">{t('tasks.approved')}</Select.Option>
          <Select.Option value="rejected">{t('tasks.rejected')}</Select.Option>
        </Select>
      </div>

      {/* Desktop Table View */}
      <div className={styles.desktopTable}>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('tasks.searchTasks')}
              />
            )
          }}
        />
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCards}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(renderMobileCard)
        ) : (
          <div className={styles.emptyState}>
            <InboxOutlined />
            <p>No tasks found</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        visible={detailModalVisible}
        task={selectedTask}
        onClose={() => setDetailModalVisible(false)}
      />
    </div>
  );
}
