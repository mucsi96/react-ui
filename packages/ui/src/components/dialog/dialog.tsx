import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ModalOverlay, Modal, Dialog as AriaDialog, Heading } from 'react-aria-components';
import type { ModalOverlayProps } from 'react-aria-components';
import { Button } from '../button/button';
import { classes } from '../../internal/classes';
import { Icon } from '../../internal/icon';
import styles from './dialog.module.css';

export { DialogTrigger } from 'react-aria-components';

export interface DialogProps extends Omit<ModalOverlayProps, 'children' | 'className'> {
  title: string;
  description?: string;
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  role?: 'dialog' | 'alertdialog';
  className?: string;
  size?: 'small' | 'medium' | 'large';
  maxWidth?: CSSProperties['maxWidth'];
  footer?: ReactNode | ((props: { close: () => void }) => ReactNode);
}

export function Dialog({
  title,
  description,
  children,
  role = 'dialog',
  className,
  size = 'medium',
  maxWidth,
  footer,
  isDismissable = true,
  ...props
}: DialogProps) {
  const descriptionId = useId();
  return (
    <ModalOverlay {...props} isDismissable={isDismissable} className={styles.overlay}>
      <Modal className={styles.modal} data-size={size} style={{ maxWidth }}>
        <AriaDialog
          role={role}
          aria-describedby={description ? descriptionId : undefined}
          className={classes(styles.dialog, className)}
          data-layout={footer ? 'fixed-footer' : undefined}
        >
          {({ close }) => (
            <>
              <header className={styles.header}>
                <Heading slot="title" className={styles.title}>
                  {title}
                </Heading>
                <Button variant="icon" aria-label="Close dialog" onPress={close}>
                  <Icon name="close" />
                </Button>
              </header>
              <div className={styles.body}>
                {description && (
                  <p id={descriptionId} className={styles.description}>
                    {description}
                  </p>
                )}
                {typeof children === 'function' ? children({ close }) : children}
              </div>
              {footer && (
                <footer className={styles.footer}>
                  {typeof footer === 'function' ? footer({ close }) : footer}
                </footer>
              )}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
