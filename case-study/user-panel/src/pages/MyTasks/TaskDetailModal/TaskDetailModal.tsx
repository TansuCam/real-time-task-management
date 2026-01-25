import { Modal, Button, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Task } from '../../../types';
import styles from './TaskDetailModal.module.scss';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

export default function TaskDetailModal({ visible, task, onClose }: TaskDetailModalProps) {
  const { t } = useTranslation();

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

  return (
    <Modal
      title={t('tasks.taskDetails')}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('common.cancel')}
        </Button>
      ]}
      width={700}
    >
      {task && (
        <div className={styles.detailContent}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('tasks.title')}:</span>
            <span className={styles.detailValue}>{task.title}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('tasks.description')}:</span>
            <span className={styles.detailValue}>{task.description}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('tasks.priority')}:</span>
            <Tag color={getPriorityColor(task.priority)}>{t(`tasks.${task.priority}`)}</Tag>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('tasks.category')}:</span>
            <span className={styles.detailValue}>{task.category}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('tasks.status')}:</span>
            <Tag color={getStatusColor(task.status)}>{t(`tasks.${task.status}`)}</Tag>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('tasks.createdAt')}:</span>
            <span className={styles.detailValue}>{new Date(task.createdAt).toLocaleString()}</span>
          </div>
          {task.rejectionReason && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t('tasks.rejectionReason')}:</span>
              <span className={styles.detailValue}>{task.rejectionReason}</span>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
