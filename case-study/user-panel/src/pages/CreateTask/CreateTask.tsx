import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { InputField } from '../../components/InputField';
import { TextAreaField } from '../../components/TextAreaField';
import { SelectField } from '../../components/SelectField';
import api from '../../api';
import { addTask } from '../../store/tasksSlice';
import styles from './CreateTask.module.scss';

interface TaskForm {
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'Teknik Destek' | 'İzin Talebi' | 'Satın Alma' | 'Diğer';
}

export default function CreateTask() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<TaskForm>({
    defaultValues: {
      priority: 'normal',
      category: 'Teknik Destek'
    }
  });

  const onSubmit = async (data: TaskForm) => {
    setLoading(true);
    try {
      const response = await api.post('/tasks', data);
      dispatch(addTask(response.data));
      message.success(t('tasks.taskCreated'));
      reset();
      navigate('/my-tasks');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      message.error(error.response?.data?.message || t('tasks.taskCreateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createTaskPage}>
      <h1>{t('tasks.createTask')}</h1>
      <div className={styles.taskForm}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}>
          <InputField
            name="title"
            control={control}
            label={t('tasks.title')}
            rules={{ required: t('tasks.titleRequired') }}
          />
          <TextAreaField
            name="description"
            control={control}
            label={t('tasks.description')}
            rules={{ required: t('tasks.descriptionRequired') }}
            rows={4}
          />
          <SelectField
            name="priority"
            control={control}
            label={t('tasks.priority')}
            rules={{ required: t('tasks.priorityRequired') }}
            options={[
              { value: 'low', label: t('tasks.low') },
              { value: 'normal', label: t('tasks.normal') },
              { value: 'high', label: t('tasks.high') },
              { value: 'urgent', label: t('tasks.urgent') }
            ]}
          />
          <SelectField
            name="category"
            control={control}
            label={t('tasks.category')}
            rules={{ required: t('tasks.categoryRequired') }}
            options={[
              { value: 'Teknik Destek', label: 'Teknik Destek' },
              { value: 'İzin Talebi', label: 'İzin Talebi' },
              { value: 'Satın Alma', label: 'Satın Alma' },
              { value: 'Diğer', label: 'Diğer' }
            ]}
          />
          <Button type="primary" htmlType="submit" loading={loading} className={styles.submitButton}>
            {t('tasks.createTask')}
          </Button>
        </form>
      </div>
    </div>
  );
}
