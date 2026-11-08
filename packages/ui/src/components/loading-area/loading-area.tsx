import type { ComponentPropsWithRef } from 'react';
import { classes } from '../../internal/classes';
import { BarLoader } from '../loader/loader';
import styles from './loading-area.module.css';

export interface LoadingAreaProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Accessible name for the single indeterminate progress indicator. */
  label: string;
  /** Grow into the available space in a flex or grid container. */
  fill?: boolean;
}

export function LoadingArea({ label, fill = false, className, ...props }: LoadingAreaProps) {
  return (
    <div {...props} className={classes(styles.area, fill && styles.fill, className)}>
      <BarLoader label={label} />
    </div>
  );
}
