import { Link } from 'react-router';
import { ArrowRight, Accessibility, Braces, Palette } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Heading,
  Text,
  Code,
  DonutSlider,
  BarLoader,
} from '@mucsi96/react-ui';
import { Demo } from '../components/demo';
import styles from './pages.module.css';

const tokens = [
  'surface-0',
  'surface-1',
  'surface-2',
  'outline',
  'primary',
  'link',
  'success',
  'warn',
  'error',
  'success-soft',
  'warn-soft',
  'error-soft',
];

export default function OverviewPage() {
  return (
    <>
      <div className={styles.hero}>
        <Badge tone="primary">React 19 · TypeScript · CSS Modules</Badge>
        <Heading level={1}>
          A clear foundation.
          <br />
          <span className={styles.accent}>A cohesive interface.</span>
        </Heading>
        <Text muted>
          A dark-first component library with a considered palette, accessible interactions, and
          simple functional APIs. Make every screen feel like it belongs.
        </Text>
        <div className={styles.row}>
          <Link to="/buttons" className={styles.cta}>
            Explore components <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Code>@mucsi96/react-ui</Code>
        </div>
      </div>
      <div className={styles.featureGrid}>
        {[
          {
            icon: Accessibility,
            title: 'Accessible by design',
            description:
              'Keyboard navigation, focus management, and screen-reader support with React Aria.',
          },
          {
            icon: Braces,
            title: 'React all the way',
            description:
              'Functional components, controlled state, composable children, and fully typed props.',
          },
          {
            icon: Palette,
            title: 'Your style, scoped',
            description:
              'CSS Modules keep component styles local. CSS custom properties make the palette yours.',
          },
        ].map(({ icon: Icon, title, description }) => (
          <Card key={title} className={styles.feature}>
            <Icon size={22} aria-hidden="true" />
            <Heading level={3}>{title}</Heading>
            <Text muted>{description}</Text>
          </Card>
        ))}
      </div>
      <Demo
        title="Designed to work together"
        description="The same surfaces, shape, typography, and semantic colors across every component."
        code={`<Button tone="success">Mark as known</Button>
<DonutSlider label="Tip" unit="%" defaultValue={15} valuePerTurn={20} min={0} max={100} />
<BarLoader label="Loading your workspace" />`}
      >
        <div className={styles.stack}>
          <Badge tone="success">All systems ready</Badge>
          <Heading level={3}>A productive little workspace</Heading>
          <Text muted>Thoughtful defaults. Room to make it your own.</Text>
          <div className={styles.row}>
            <Button>Get started</Button>
            <Button variant="outlined">Learn more</Button>
          </div>
        </div>
        <DonutSlider
          label="Tip"
          unit="%"
          defaultValue={15}
          valuePerTurn={20}
          min={0}
          max={100}
          size={180}
        />
        <BarLoader label="Loading your workspace" />
      </Demo>
      <Demo
        title="Design tokens"
        language="css"
        description="The complete original --bt-* palette is preserved. Override any token in your own stylesheet."
        code={`:root {
  --bt-primary: hsl(280, 80%, 60%);
}

.panel { background: var(--bt-surface-1); }`}
      >
        <div className={styles.tokenGrid}>
          {tokens.map((token) => (
            <div key={token} className={styles.token}>
              <span style={{ background: `var(--bt-${token})` }} />
              <Code>{token}</Code>
            </div>
          ))}
        </div>
      </Demo>
      <Demo
        title="Start with a small import"
        description="Load the stylesheet once at your application entry point. Components do not require a theme provider."
        code={`import { Button } from '@mucsi96/react-ui';
import '@mucsi96/react-ui/styles.css';

export function SaveAction() {
  return <Button tone="success" onPress={() => save()}>Save changes</Button>;
}`}
        stack
      >
        <Text>
          Browse working examples using the navigation. Every preview includes its React source.
        </Text>
      </Demo>
    </>
  );
}
