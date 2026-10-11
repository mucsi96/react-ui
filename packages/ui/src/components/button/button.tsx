import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps, LinkProps } from 'react-aria-components';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { classes } from '../../internal/classes';
import type { Tone } from '../../types';
import styles from './button.module.css';

export type ButtonVariant = 'filled' | 'raised' | 'outlined' | 'text' | 'icon' | 'fab' | 'mini-fab';

interface Appearance {
  variant?: ButtonVariant;
  tone?: Tone;
  background?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export interface ButtonProps extends Omit<AriaButtonProps, keyof Appearance>, Appearance {
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'filled',
  tone = 'primary',
  background,
  className,
  style,
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      ref={ref}
      className={classes(styles.button, className)}
      data-variant={variant}
      data-tone={tone}
      style={{ ...style, '--bt-button-bg': background } as CSSProperties}
    >
      {children}
    </AriaButton>
  );
}

export interface LinkButtonProps extends Omit<LinkProps, keyof Appearance>, Appearance {
  ref?: Ref<HTMLAnchorElement>;
}

export function LinkButton({
  variant = 'filled',
  tone = 'primary',
  background,
  className,
  style,
  children,
  ref,
  ...props
}: LinkButtonProps) {
  return (
    <AriaLink
      {...props}
      ref={ref}
      className={classes(styles.button, className)}
      data-variant={variant}
      data-tone={tone}
      style={{ ...style, '--bt-button-bg': background } as CSSProperties}
    >
      {children}
    </AriaLink>
  );
}
