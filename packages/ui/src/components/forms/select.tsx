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
import { Icon } from '../../internal/icon';
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
  appearance?: 'outlined' | 'filled';
  className?: string;
}

export interface SelectProps<M extends 'single' | 'multiple' = 'single'>
  extends
    Omit<AriaSelectProps<SelectOption, M>, keyof FieldProps | 'children' | 'items'>,
    FieldProps {}

export function Select<M extends 'single' | 'multiple' = 'single'>({
  label,
  options,
  description,
  error,
  placeholder = 'Select an option',
  appearance = 'filled',
  className,
  ...props
}: SelectProps<M>) {
  return (
    <AriaSelect
      {...props}
      isInvalid={!!error || props.isInvalid}
      className={classes(styles.field, className)}
      placeholder={placeholder}
      data-appearance={appearance}
    >
      <div className={classes(styles.surface, styles.selectSurface)}>
        <Label className={styles.floatingLabel}>
          {label}
          {props.isRequired && <span aria-hidden="true"> *</span>}
        </Label>
        <Button className={styles.selectButton}>
          <SelectValue className={styles.selectValue} />
          <Icon name="chevron-down" />
        </Button>
      </div>
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

export type MultiSelectProps = Omit<
  SelectProps<'multiple'>,
  'selectionMode' | 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange'
>;

export function MultiSelect(props: MultiSelectProps) {
  return <Select {...props} selectionMode="multiple" />;
}

export function ComboBox({
  label,
  options,
  description,
  error,
  placeholder = 'Search…',
  appearance = 'filled',
  className,
  ...props
}: ComboBoxProps) {
  return (
    <AriaComboBox
      {...props}
      defaultItems={options}
      isInvalid={!!error || props.isInvalid}
      className={classes(styles.field, className)}
      data-appearance={appearance}
    >
      <div className={styles.surface}>
        <Label className={styles.floatingLabel}>
          {label}
          {props.isRequired && <span aria-hidden="true"> *</span>}
        </Label>
        <Group className={styles.combo}>
          <Input className={styles.input} placeholder={placeholder} />
          <Button className={styles.comboButton} aria-label={`Show ${label.toLowerCase()} options`}>
            <Icon name="chevron-down" />
          </Button>
        </Group>
      </div>
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
