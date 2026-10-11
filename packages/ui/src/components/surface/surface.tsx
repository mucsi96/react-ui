import type { HTMLAttributes, ReactNode } from 'react';
import { classes } from '../../internal/classes';
import type { Tone } from '../../types';
import styles from './surface.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'elevated' | 'outlined';
}

export function Card({ variant = 'outlined', className, ...props }: CardProps) {
  return <section {...props} className={classes(styles.card, className)} data-variant={variant} />;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone | 'neutral';
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return <span {...props} className={classes(styles.badge, className)} data-tone={tone} />;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...props} className={classes(styles.heading, className)} />;
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  muted?: boolean;
}

export function Text({ muted = false, className, ...props }: TextProps) {
  return <p {...props} className={classes(styles.text, muted && styles.muted, className)} />;
}

export function Code({ children }: { children: ReactNode }) {
  return <code className={styles.code}>{children}</code>;
}

export function Divider() {
  return <hr className={styles.divider} />;
}
