import {
  NumberField as AriaNumberField,
  Group,
  Input,
  Label,
  Text,
  FieldError,
  Button,
} from 'react-aria-components';
import type { NumberFieldProps as AriaNumberFieldProps } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { classes } from '../../internal/classes';
import styles from './forms.module.css';

export interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'children' | 'className'> {
  label: string;
  description?: ReactNode;
  error?: ReactNode;
  appearance?: 'outlined' | 'filled';
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function NumberField({
  label,
  description,
  error,
  appearance = 'filled',
  className,
  ref,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField
      {...props}
      ref={ref}
      isInvalid={!!error || props.isInvalid}
      className={classes(styles.field, className)}
      data-appearance={appearance}
    >
      <Group className={classes(styles.surface, styles.number)}>
        <Label className={styles.floatingLabel}>
          {label}
          {props.isRequired && <span aria-hidden="true"> *</span>}
        </Label>
        <Input className={styles.input} />
        <Button slot="decrement" className={styles.stepper}>
          −
        </Button>
        <Button slot="increment" className={styles.stepper}>
          +
        </Button>
      </Group>
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <FieldError className={styles.error}>{error}</FieldError>
    </AriaNumberField>
  );
}
