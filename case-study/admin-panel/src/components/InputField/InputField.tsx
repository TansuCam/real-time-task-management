import { Form, Input } from 'antd';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './InputField.module.scss';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: 'text' | 'email';
  placeholder?: string;
  rules?: RegisterOptions<T>;
  prefix?: React.ReactNode;
  size?: 'large' | 'middle' | 'small';
}

export function InputField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  rules,
  prefix,
  size = 'large'
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Item
          className={styles.inputField}
          label={label}
          validateStatus={fieldState.error ? 'error' : ''}
          help={fieldState.error?.message}
          layout='vertical'
        >
          <Input {...field} type={type} prefix={prefix} size={size} placeholder={placeholder} />
        </Form.Item>
      )}
    />
  );
}
