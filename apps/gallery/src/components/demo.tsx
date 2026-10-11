import type { ReactNode } from 'react';
import { lazy, Suspense, useId, useState } from 'react';
import { Heading, Text } from '@mucsi96/react-ui';
import styles from './demo.module.css';
import codeStyles from './code-block.module.css';
import type { CodeLanguage } from './code-block';

const CodeBlock = lazy(() => import('./code-block'));

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
  language = 'tsx',
}: {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
  stack?: boolean;
  language?: CodeLanguage;
}) {
  const titleId = useId();
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Heading level={2} id={titleId}>
        {title}
      </Heading>
      {description && <Text muted>{description}</Text>}
      <div className={`${styles.preview} ${stack ? styles.stack : ''}`}>{children}</div>
      <details
        className={styles.code}
        onToggle={(event) => setIsCodeOpen(event.currentTarget.open)}
      >
        <summary>{language === 'css' ? 'View CSS example' : 'View React example'}</summary>
        {isCodeOpen && (
          <Suspense
            fallback={
              <pre className={codeStyles.block}>
                <code>{code}</code>
              </pre>
            }
          >
            <CodeBlock code={code} language={language} />
          </Suspense>
        )}
      </details>
    </section>
  );
}
