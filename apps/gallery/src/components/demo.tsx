import type { ReactNode } from 'react';
import { useId } from 'react';
import { Heading, Text } from '@mucsi96/react-ui';
import styles from './demo.module.css';

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className={styles.pageHeader}>
      <span className={styles.eyebrow}>COMPONENT LIBRARY</span>
      <Heading level={1}>{title}</Heading>
      <Text muted>{description}</Text>
    </header>
  );
}

export function Demo({
  title,
  description,
  code,
  children,
  stack = false,
}: {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
  stack?: boolean;
}) {
  const titleId = useId();
  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Heading level={2} id={titleId}>
        {title}
      </Heading>
      {description && <Text muted>{description}</Text>}
      <div className={`${styles.preview} ${stack ? styles.stack : ''}`}>{children}</div>
      <details className={styles.code}>
        <summary>View React example</summary>
        <pre>
          <code>{code}</code>
        </pre>
      </details>
    </section>
  );
}
