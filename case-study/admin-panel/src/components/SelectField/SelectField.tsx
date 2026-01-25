import { Form, Select } from 'antd';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './SelectField.module.scss';

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  options: { value: string; label: string }[];
  size?: 'large' | 'middle' | 'small';
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  options,
  size = 'large'
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Item
          className={styles.selectField}
          label={label}
          validateStatus={fieldState.error ? 'error' : ''}
          layout='vertical'
          help={fieldState.error?.message}
        >
          <Select {...field} size={size} placeholder={placeholder}>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
    />
  );
}
