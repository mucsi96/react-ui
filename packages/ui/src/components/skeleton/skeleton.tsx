import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { classes } from '../../internal/classes';
import styles from './skeleton.module.css';

export interface SkeletonProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  variant?: 'text' | 'image' | 'row';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={classes(styles.skeleton, className)}
      data-variant={variant}
      style={{ width, height, ...style }}
    />
  );
}

export interface SkeletonGroupProps extends ComponentPropsWithRef<'div'> {
  label: string;
}

export function SkeletonGroup({ label, children, className, ...props }: SkeletonGroupProps) {
  return (
    <div {...props} className={classes(styles.group, className)}>
      <span role="status" className={styles.status}>
        {label}
      </span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
