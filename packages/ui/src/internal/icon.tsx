import type { SVGProps } from 'react';
import { classes } from './classes';
import styles from './icon.module.css';

const paths = {
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-right': 'm9 6 6 6-6 6',
  'arrow-left': 'm12 19-7-7 7-7M5 12h14',
  'arrow-right': 'm12 5 7 7-7 7M5 12h14',
  'arrow-up': 'm5 12 7-7 7 7M12 5v14',
  'arrow-down': 'm5 12 7 7 7-7M12 5v14',
  sort: 'm8 3-4 4h8M8 3v18m8 0 4-4h-8m4-14v18',
  close: 'm6 6 12 12M6 18 18 6',
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof paths;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classes(styles.icon, className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
