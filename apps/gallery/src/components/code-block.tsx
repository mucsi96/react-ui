import { Fragment } from 'react';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from '@shikijs/langs/tsx';
import css from '@shikijs/langs/css';
import githubDark from '@shikijs/themes/github-dark-default';
import styles from './code-block.module.css';

export type CodeLanguage = 'tsx' | 'css';

const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  langs: [tsx, css],
  themes: [githubDark],
});

export default function CodeBlock({ code, language }: { code: string; language: CodeLanguage }) {
  const { tokens } = highlighter.codeToTokens(code, {
    lang: language,
    theme: 'github-dark-default',
  });
  return (
    <pre
      className={styles.block}
      data-language={language}
      role="region"
      tabIndex={0}
      aria-label={`${language.toUpperCase()} code example`}
    >
      <code>
        {tokens.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && '\n'}
            {line.map((token, tokenIndex) => (
              <span
                key={tokenIndex}
                style={{
                  color: token.color,
                  fontStyle: (token.fontStyle ?? 0) & 1 ? 'italic' : undefined,
                  fontWeight: (token.fontStyle ?? 0) & 2 ? 600 : undefined,
                  textDecoration: (token.fontStyle ?? 0) & 4 ? 'underline' : undefined,
                }}
              >
                {token.content}
              </span>
            ))}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
