import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalOverlay, Modal, Dialog as AriaDialog, Heading } from 'react-aria-components';
import type { ModalOverlayProps } from 'react-aria-components';
import { Button } from '../button/button';
import { classes } from '../../internal/classes';
import styles from './dialog.module.css';

export { DialogTrigger } from 'react-aria-components';

export interface DialogProps extends Omit<ModalOverlayProps, 'children' | 'className'> {
  title: string;
  description?: string;
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  role?: 'dialog' | 'alertdialog';
  className?: string;
}

export function Dialog({
  title,
  description,
  children,
  role = 'dialog',
  className,
  isDismissable = true,
  ...props
}: DialogProps) {
  const descriptionId = useId();
  return (
    <ModalOverlay {...props} isDismissable={isDismissable} className={styles.overlay}>
      <Modal className={styles.modal}>
        <AriaDialog
          role={role}
          aria-describedby={description ? descriptionId : undefined}
          className={classes(styles.dialog, className)}
        >
          {({ close }) => (
            <>
              <header className={styles.header}>
                <Heading slot="title" className={styles.title}>
                  {title}
                </Heading>
                <Button variant="icon" aria-label="Close dialog" onPress={close}>
                  ×
                </Button>
              </header>
              {description && (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              )}
              {typeof children === 'function' ? children({ close }) : children}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
