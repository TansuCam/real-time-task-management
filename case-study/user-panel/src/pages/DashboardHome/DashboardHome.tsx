import { Card, Statistic, Row, Col, Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '../../store';
import { Task } from '../../types';

export default function DashboardHome() {
  const { t } = useTranslation();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const pending = tasks.filter(t => t.status === 'pending').length;
  const approved = tasks.filter(t => t.status === 'approved').length;
  const rejected = tasks.filter(t => t.status === 'rejected').length;

  // Son 5 talep
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
      key: 'title',
      ellipsis: true,
    },
    {
      title: t('tasks.priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{t(`tasks.${priority}`)}</Tag>
      ),
      width: 100,
    },
    {
      title: t('tasks.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{t(`tasks.${status}`)}</Tag>
      ),
      width: 100,
    },
    {
      title: t('tasks.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 120,
    },
  ];

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title={t('dashboard.myTasks')} value={tasks.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title={t('dashboard.pending')} value={pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title={t('dashboard.approved')} value={approved} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title={t('dashboard.rejected')} value={rejected} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      {/* Recent Tasks Summary */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title={t('dashboard.recentTasks')}>
            <Table
              columns={columns}
              dataSource={recentTasks}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
