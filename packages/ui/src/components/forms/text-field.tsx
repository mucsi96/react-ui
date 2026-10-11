import {
  TextField as AriaTextField,
  Label,
  Input,
  TextArea,
  Text,
  FieldError,
} from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { classes } from '../../internal/classes';
import styles from './forms.module.css';

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'children' | 'className'> {
  label: string;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  appearance?: 'outlined' | 'filled';
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TextField({
  label,
  description,
  error,
  placeholder,
  multiline = false,
  rows = 3,
  appearance = 'outlined',
  className,
  ref,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      ref={ref}
      isInvalid={!!error || props.isInvalid}
      className={classes(styles.field, className)}
      data-appearance={appearance}
    >
      <Label className={styles.label}>{label}</Label>
      {multiline ? (
        <TextArea className={styles.input} placeholder={placeholder} rows={rows} />
      ) : (
        <Input className={styles.input} placeholder={placeholder} />
      )}
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <FieldError className={styles.error}>{error}</FieldError>
    </AriaTextField>
  );
}
