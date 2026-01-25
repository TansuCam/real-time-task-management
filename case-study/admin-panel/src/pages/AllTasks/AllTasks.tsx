import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag, Select, Input, Empty, Button, DatePicker } from 'antd';
import { InboxOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { RootState } from '../../store';
import { Task } from '../../types';
import TaskDetailModal from './TaskDetailModal';
import styles from './AllTasks.module.scss';

export default function AllTasks() {
  const { t } = useTranslation();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Applied filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Temporary filters (for form)
  const [tempStatusFilter, setTempStatusFilter] = useState<string>('all');
  const [tempPriorityFilter, setTempPriorityFilter] = useState<string>('all');
  const [tempSearchText, setTempSearchText] = useState('');
  const [tempDateRange, setTempDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Detail modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleViewDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());

    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const taskDate = dayjs(task.createdAt);
      matchesDate = taskDate.isAfter(dateRange[0]) && taskDate.isBefore(dateRange[1].add(1, 'day'));
    }

    return matchesStatus && matchesPriority && matchesSearch && matchesDate;
  });

  const handleApplyFilters = () => {
    setSearchText(tempSearchText);
    setStatusFilter(tempStatusFilter);
    setPriorityFilter(tempPriorityFilter);
    setDateRange(tempDateRange);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDateRange(null);
    setTempSearchText('');
    setTempStatusFilter('all');
    setTempPriorityFilter('all');
    setTempDateRange(null);
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
      title: t('tasks.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{t(`tasks.${status}`)}</Tag>
      )
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
      title: t('tasks.rejectionReason'),
      dataIndex: 'rejectionReason',
      key: 'rejectionReason',
      render: (reason?: string) => reason || '-'
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Task) => (
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
          <span className={styles.cardLabel}>{t('tasks.createdBy')}</span>
          <span className={styles.cardValue}>{task.createdBy}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>{t('tasks.createdAt')}</span>
          <span className={styles.cardValue}>{new Date(task.createdAt).toLocaleString()}</span>
        </div>
        <div className={styles.cardActions}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(task)}
            block
          >
            {t('common.view')}
          </Button>
        </div>
        {task.rejectionReason && (
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('tasks.rejectionReason')}</span>
            <span className={styles.cardValue}>{task.rejectionReason}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.tasksPage}>
      <h1>{t('tasks.allTasks')}</h1>

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
            value={tempStatusFilter}
            onChange={setTempStatusFilter}
            size="large"
          >
            <Select.Option value="all">{t('tasks.allStatus')}</Select.Option>
            <Select.Option value="pending">{t('tasks.pending')}</Select.Option>
            <Select.Option value="approved">{t('tasks.approved')}</Select.Option>
            <Select.Option value="rejected">{t('tasks.rejected')}</Select.Option>
          </Select>
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
          <DatePicker.RangePicker
            className={styles.dateRangePicker}
            value={tempDateRange}
            onChange={(dates) => setTempDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
            format="DD/MM/YYYY"
            size="large"
            placeholder={[t('tasks.startDate'), t('tasks.endDate')]}
          />
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
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
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
        {filteredTasks.length > 0 ? (
          filteredTasks.map(renderMobileCard)
        ) : (
          <div className={styles.emptyState}>
            <InboxOutlined />
            <p>{t('tasks.noTasks')}</p>
          </div>
        )}
      </div>

      <TaskDetailModal
        visible={detailModalVisible}
        task={selectedTask}
        onClose={() => setDetailModalVisible(false)}
      />
    </div>
  );
}
