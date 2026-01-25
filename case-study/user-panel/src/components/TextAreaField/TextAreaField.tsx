import { Form, Input } from 'antd';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './TextAreaField.module.scss';

interface TextAreaFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  rows?: number;
  size?: 'large' | 'middle' | 'small';
}

export function TextAreaField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  rows = 4,
  size = 'large'
}: TextAreaFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Item
          className={styles.textAreaField}
          label={label}
          validateStatus={fieldState.error ? 'error' : ''}
          layout='vertical'
          help={fieldState.error?.message}
        >
          <Input.TextArea {...field} rows={rows} size={size} placeholder={placeholder} />
        </Form.Item>
      )}
    />
  );
}
