import type { ComponentPropsWithRef } from 'react';
import { classes } from '../../internal/classes';
import styles from './app-layout.module.css';

export type AppHeaderProps = ComponentPropsWithRef<'header'>;
export type AppHeaderActionsProps = ComponentPropsWithRef<'div'>;
export type AppMainProps = ComponentPropsWithRef<'main'>;

export function AppHeader({ children, className, ...props }: AppHeaderProps) {
  return (
    <header {...props} className={classes(styles.header, className)}>
      <div className={styles.headerContent}>{children}</div>
    </header>
  );
}

export function AppHeaderActions({ className, ...props }: AppHeaderActionsProps) {
  return <div {...props} className={classes(styles.actions, className)} />;
}

export function AppMain({ className, ...props }: AppMainProps) {
  return <main {...props} className={classes(styles.main, className)} />;
}
