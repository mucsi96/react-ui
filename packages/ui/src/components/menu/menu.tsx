import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Popover,
  Separator,
} from 'react-aria-components';
import type {
  MenuProps as AriaMenuProps,
  MenuItemProps as AriaMenuItemProps,
  PopoverProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { classes } from '../../internal/classes';
import styles from './menu.module.css';

export { MenuTrigger, SubmenuTrigger } from 'react-aria-components';

export interface MenuProps<T extends object> extends Omit<AriaMenuProps<T>, 'className'> {
  className?: string;
}

export function Menu<T extends object>({ className, ...props }: MenuProps<T>) {
  return <AriaMenu {...props} className={classes(styles.menu, className)} />;
}

export interface MenuItemProps extends Omit<AriaMenuItemProps, 'className' | 'children'> {
  className?: string;
  children: ReactNode;
  tone?: 'default' | 'error';
}

export function MenuItem({ className, tone = 'default', ...props }: MenuItemProps) {
  return <AriaMenuItem {...props} className={classes(styles.item, className)} data-tone={tone} />;
}

export interface MenuPopoverProps extends Omit<PopoverProps, 'className'> {
  className?: string;
}

export function MenuPopover({ className, ...props }: MenuPopoverProps) {
  return <Popover {...props} className={classes(styles.popover, className)} />;
}

export function MenuSeparator() {
  return <Separator className={styles.separator} />;
}
