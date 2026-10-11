import { ProgressBar as AriaProgressBar, Label } from 'react-aria-components';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import type { CSSProperties } from 'react';
import { classes } from '../../internal/classes';
import styles from './loader.module.css';

export interface BarLoaderProps {
  label?: string;
  color?: string;
  className?: string;
}

export function BarLoader({ label = 'Loading', color, className }: BarLoaderProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-busy="true"
      className={classes(styles.bars, className)}
      style={{ '--bt-bar-loader-color': color } as CSSProperties}
    >
      {[0, 1, 2, 3, 4].map((bar) => (
        <span key={bar} aria-hidden="true" />
      ))}
    </div>
  );
}

export function Spinner({ label = 'Loading', className }: Omit<BarLoaderProps, 'color'>) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-busy="true"
      className={classes(styles.spinner, className)}
    />
  );
}

export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'children' | 'className'> {
  label: string;
  className?: string;
}

export function ProgressBar({ label, className, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar {...props} className={classes(styles.progress, className)}>
      {({ percentage, isIndeterminate }) => (
        <>
          <Label>{label}</Label>
          <div className={styles.track}>
            <div
              className={styles.fill}
              data-indeterminate={isIndeterminate || undefined}
              style={{ width: isIndeterminate ? '35%' : `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
