import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { HTMLAttributes, ReactNode } from 'react';
import { classes } from '../../internal/classes';
import { Icon } from '../../internal/icon';
import styles from './notifications.module.css';

export type NotificationTone = 'info' | 'success' | 'warn' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: NotificationTone;
  title?: string;
}

export function Alert({ tone = 'info', title, children, className, role, ...props }: AlertProps) {
  return (
    <div
      {...props}
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
      className={classes(styles.alert, className)}
      data-tone={tone}
    >
      <div>
        {title && <strong className={styles.title}>{title}</strong>}
        {children}
      </div>
    </div>
  );
}

export interface NotificationOptions {
  title?: string;
  /** Set to 0 to keep a notification until it is dismissed. */
  duration?: number;
}

interface Notification extends NotificationOptions {
  id: number;
  message: string;
  tone: NotificationTone;
  duration: number;
}

export interface Notifications {
  info: (message: string, options?: NotificationOptions) => number;
  success: (message: string, options?: NotificationOptions) => number;
  warn: (message: string, options?: NotificationOptions) => number;
  error: (message: string, options?: NotificationOptions) => number;
  dismiss: (id: number) => void;
  clear: () => void;
}

const NotificationsContext = createContext<Notifications | null>(null);

function Toast({
  notification,
  dismiss,
}: {
  notification: Notification;
  dismiss: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(notification.duration);

  useEffect(() => {
    if (hovered || focused || notification.duration <= 0) return;
    const started = Date.now();
    const timer = setTimeout(() => dismiss(notification.id), Math.max(0, remaining.current));
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [hovered, focused, notification.duration, notification.id, dismiss]);

  return (
    <div
      className={styles.alert}
      data-tone={notification.tone}
      role={notification.tone === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div>
        {notification.title && <strong className={styles.title}>{notification.title}</strong>}
        {notification.message}
      </div>
      <button
        className={styles.dismiss}
        onClick={() => dismiss(notification.id)}
        aria-label="Dismiss notification"
      >
        <Icon name="close" />
      </button>
    </div>
  );
}

export interface NotificationsProviderProps {
  children: ReactNode;
  defaultDuration?: number;
}

export function NotificationsProvider({
  children,
  defaultDuration = 4000,
}: NotificationsProviderProps) {
  const [items, setItems] = useState<Notification[]>([]);
  const nextId = useRef(0);
  const dismiss = useCallback(
    (id: number) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);
  const add = useCallback(
    (tone: NotificationTone, message: string, options: NotificationOptions = {}) => {
      const id = ++nextId.current;
      setItems((current) => [
        ...current,
        { ...options, id, tone, message, duration: options.duration ?? defaultDuration },
      ]);
      return id;
    },
    [defaultDuration],
  );
  const api = useMemo<Notifications>(
    () => ({
      info: (message, options) => add('info', message, options),
      success: (message, options) => add('success', message, options),
      warn: (message, options) => add('warn', message, options),
      error: (message, options) => add('error', message, options),
      dismiss,
      clear,
    }),
    [add, dismiss, clear],
  );

  return (
    <NotificationsContext value={api}>
      {children}
      {items.length > 0 &&
        typeof document !== 'undefined' &&
        createPortal(
          <section className={styles.region} aria-label="Notifications" data-react-aria-top-layer>
            {items.map((item) => (
              <Toast key={item.id} notification={item} dismiss={dismiss} />
            ))}
          </section>,
          document.body,
        )}
    </NotificationsContext>
  );
}

export function useNotifications(): Notifications {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider.');
  return context;
}
