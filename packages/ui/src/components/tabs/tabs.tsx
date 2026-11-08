import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
} from 'react-aria-components';
import type {
  TabsProps as AriaTabsProps,
  TabListProps as AriaTabListProps,
  TabProps as AriaTabProps,
  TabPanelProps as AriaTabPanelProps,
} from 'react-aria-components';
import { classes } from '../../internal/classes';
import styles from './tabs.module.css';

export interface TabsProps extends Omit<AriaTabsProps, 'className'> {
  className?: string;
}
export interface TabListProps<T extends object> extends Omit<AriaTabListProps<T>, 'className'> {
  className?: string;
}
export interface TabProps extends Omit<AriaTabProps, 'className'> {
  className?: string;
}
export interface TabPanelProps extends Omit<AriaTabPanelProps, 'className'> {
  className?: string;
}

export function Tabs({ className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={classes(styles.tabs, className)} />;
}
export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <AriaTabList {...props} className={classes(styles.list, className)} />;
}
export function Tab({ className, ...props }: TabProps) {
  return <AriaTab {...props} className={classes(styles.tab, className)} />;
}
export function TabPanel({ className, ...props }: TabPanelProps) {
  return <AriaTabPanel {...props} className={classes(styles.panel, className)} />;
}
