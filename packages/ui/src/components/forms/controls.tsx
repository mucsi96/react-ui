import {
  Checkbox as AriaCheckbox,
  RadioGroup as AriaRadioGroup,
  Radio as AriaRadio,
  Switch as AriaSwitch,
  Label,
} from 'react-aria-components';
import type {
  CheckboxProps as AriaCheckboxProps,
  RadioGroupProps as AriaRadioGroupProps,
  RadioProps as AriaRadioProps,
  SwitchProps as AriaSwitchProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { classes } from '../../internal/classes';
import styles from './forms.module.css';

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children' | 'className'> {
  children: ReactNode;
  className?: string;
}

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={classes(styles.control, className)}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <span className={styles.check} aria-hidden="true">
            {isIndeterminate ? '−' : isSelected ? '✓' : ''}
          </span>
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children' | 'className'> {
  label: string;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({ label, children, className, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={classes(styles.field, className)}>
      <Label className={styles.label}>{label}</Label>
      {children}
    </AriaRadioGroup>
  );
}

export interface RadioProps extends Omit<AriaRadioProps, 'children' | 'className'> {
  children: ReactNode;
  className?: string;
}

export function Radio({ children, className, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={classes(styles.control, className)}>
      <span className={styles.radio} aria-hidden="true" />
      {children}
    </AriaRadio>
  );
}

export interface SwitchProps extends Omit<AriaSwitchProps, 'children' | 'className'> {
  children: ReactNode;
  className?: string;
}

export function Switch({ children, className, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props} className={classes(styles.control, className)}>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {children}
    </AriaSwitch>
  );
}
