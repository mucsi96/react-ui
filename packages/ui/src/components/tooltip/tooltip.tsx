import { TooltipTrigger, Tooltip as AriaTooltip } from 'react-aria-components';
import type { Placement } from 'react-aria-components';
import type { ReactElement, ReactNode } from 'react';
import styles from './tooltip.module.css';

export interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  placement?: Placement;
  delay?: number;
}

export function Tooltip({ children, content, placement = 'top', delay = 500 }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay}>
      {children}
      <AriaTooltip className={styles.tooltip} placement={placement}>
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
