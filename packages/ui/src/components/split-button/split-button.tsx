import { MenuTrigger } from 'react-aria-components';
import type { ReactNode } from 'react';
import { Button } from '../button/button';
import type { ButtonProps } from '../button/button';
import { Menu, MenuPopover } from '../menu/menu';
import { classes } from '../../internal/classes';
import { Icon } from '../../internal/icon';
import styles from './split-button.module.css';

export interface SplitButtonProps extends Omit<ButtonProps, 'children' | 'variant' | 'ref'> {
  label: string;
  icon?: ReactNode;
  menuLabel?: string;
  children: ReactNode;
}

export function SplitButton({
  label,
  icon,
  menuLabel = 'More actions',
  children,
  className,
  ...props
}: SplitButtonProps) {
  return (
    <div className={classes(styles.group, className)}>
      <Button {...props} className={styles.primary}>
        {icon}
        {label}
      </Button>
      <MenuTrigger>
        <Button
          tone={props.tone}
          background={props.background}
          isDisabled={props.isDisabled}
          className={styles.trigger}
          aria-label={menuLabel}
        >
          <Icon name="chevron-down" />
        </Button>
        <MenuPopover placement="bottom end">
          <Menu aria-label={menuLabel}>{children}</Menu>
        </MenuPopover>
      </MenuTrigger>
    </div>
  );
}
