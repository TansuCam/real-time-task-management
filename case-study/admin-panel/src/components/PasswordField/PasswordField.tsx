import { Form, Input } from 'antd';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './PasswordField.module.scss';

interface PasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  prefix?: React.ReactNode;
  size?: 'large' | 'middle' | 'small';
}

export function PasswordField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  prefix,
  size = 'large'
}: PasswordFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Item
          className={styles.passwordField}
          label={label}
          layout='vertical'
          validateStatus={fieldState.error ? 'error' : ''}
          help={fieldState.error?.message}
        >
          <Input.Password {...field} prefix={prefix} size={size} placeholder={placeholder} />
        </Form.Item>
      )}
    />
  );
}
