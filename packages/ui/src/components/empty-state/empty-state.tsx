import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Heading } from '../surface/surface';
import type { HeadingProps } from '../surface/surface';
import { classes } from '../../internal/classes';
import styles from './empty-state.module.css';

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  headingLevel?: HeadingProps['level'];
}

export function EmptyState({
  title,
  description,
  action,
  headingLevel = 2,
  children,
  className,
  ...props
}: EmptyStateProps) {
  const titleId = useId();
  return (
    <section {...props} aria-labelledby={titleId} className={classes(styles.empty, className)}>
      <Heading id={titleId} level={headingLevel}>
        {title}
      </Heading>
      {description && <div className={styles.description}>{description}</div>}
      {children}
      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}
