import {
  Select as AriaSelect,
  SelectValue,
  ComboBox as AriaComboBox,
  Label,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  Text,
  FieldError,
  Group,
} from 'react-aria-components';
import type {
  SelectProps as AriaSelectProps,
  ComboBoxProps as AriaComboBoxProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { classes } from '../../internal/classes';
import styles from './forms.module.css';

export interface SelectOption {
  id: string;
  label: string;
  isDisabled?: boolean;
}

interface FieldProps {
  label: string;
  options: readonly SelectOption[];
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  className?: string;
}

export interface SelectProps
  extends
    Omit<AriaSelectProps<SelectOption>, keyof FieldProps | 'children' | 'items'>,
    FieldProps {}

export function Select({
  label,
  options,
  description,
  error,
  placeholder = 'Select an option',
  className,
  ...props
}: SelectProps) {
  return (
    <AriaSelect
      {...props}
      isInvalid={!!error || props.isInvalid}
      className={classes(styles.field, className)}
      placeholder={placeholder}
    >
      <Label className={styles.label}>{label}</Label>
      <Button className={styles.selectButton}>
        <SelectValue />
        <span aria-hidden="true">⌄</span>
      </Button>
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <FieldError className={styles.error}>{error}</FieldError>
      <Popover className={styles.popover}>
        <ListBox items={options} className={styles.list}>
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              isDisabled={option.isDisabled}
              className={styles.option}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export interface ComboBoxProps
  extends
    Omit<AriaComboBoxProps<SelectOption>, keyof FieldProps | 'children' | 'items' | 'defaultItems'>,
    FieldProps {}

export function ComboBox({
  label,
  options,
  description,
  error,
  placeholder = 'Search…',
  className,
  ...props
}: ComboBoxProps) {
  return (
    <AriaComboBox
      {...props}
      defaultItems={options}
      isInvalid={!!error || props.isInvalid}
      className={classes(styles.field, className)}
    >
      <Label className={styles.label}>{label}</Label>
      <Group className={styles.combo}>
        <Input className={styles.input} placeholder={placeholder} />
        <Button className={styles.comboButton} aria-label={`Show ${label.toLowerCase()} options`}>
          ⌄
        </Button>
      </Group>
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <FieldError className={styles.error}>{error}</FieldError>
      <Popover className={styles.popover}>
        <ListBox className={styles.list} renderEmptyState={() => 'No results'}>
          {(option: SelectOption) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              isDisabled={option.isDisabled}
              className={styles.option}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
