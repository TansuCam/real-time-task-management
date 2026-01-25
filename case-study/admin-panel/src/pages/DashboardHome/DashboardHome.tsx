import { Card, Statistic, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';

export default function DashboardHome() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { t } = useTranslation();

  // Total pending tasks count
  const pending = tasks.filter(t => t.status === 'pending').length;

  // Today's approved/rejected tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const approvedToday = tasks.filter(t => {
    const taskDate = new Date(t.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return t.status === 'approved' && taskDate.getTime() === today.getTime();
  }).length;

  const rejectedToday = tasks.filter(t => {
    const taskDate = new Date(t.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return t.status === 'rejected' && taskDate.getTime() === today.getTime();
  }).length;

  // Priority-based distribution
  const lowPriority = tasks.filter(t => t.priority === 'low').length;
  const normalPriority = tasks.filter(t => t.priority === 'normal').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const urgentPriority = tasks.filter(t => t.priority === 'urgent').length;

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('dashboard.pendingTasks')}
              value={pending}
              valueStyle={{ color: '#faad14', fontSize: '32px' }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title={t('dashboard.approvedToday')}
              value={approvedToday}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title={t('dashboard.rejectedToday')}
              value={rejectedToday}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Priority Distribution */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title={t('dashboard.priorityDistribution')}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title={t('tasks.low')}
                  value={lowPriority}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('tasks.normal')}
                  value={normalPriority}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('tasks.high')}
                  value={highPriority}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('tasks.urgent')}
                  value={urgentPriority}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
