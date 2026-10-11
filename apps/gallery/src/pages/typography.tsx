import { Heading, Text, Code, Card, Badge, Divider } from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';

export default function TypographyPage() {
  return (
    <>
      <PageHeader
        title="Typography"
        description="A system-font foundation with a compact hierarchy, comfortable reading rhythm, and useful surface primitives."
      />
      <Demo
        title="Type scale"
        code={`<Heading level={1}>Display heading</Heading>
<Heading level={2}>Section heading</Heading>
<Heading level={3}>Card heading</Heading>
<Text>Body text for everyday content.</Text>
<Text muted>Supporting information.</Text>
<Code>const ready = true;</Code>`}
        stack
      >
        <Heading level={2}>Section heading</Heading>
        <Heading level={3}>Card heading</Heading>
        <Heading level={4}>Small heading</Heading>
        <Text>
          Body text for everyday content. A comfortable line height lets the interface breathe.
        </Text>
        <Text muted>Supporting information steps back without disappearing.</Text>
        <Code>const ready = true;</Code>
      </Demo>
      <Demo
        title="Cards and badges"
        code={`<Card variant="outlined">
  <Heading level={3}>Workspace</Heading>
  <Text muted>A little structure goes a long way.</Text>
  <Divider />
  <Badge tone="success">Active</Badge>
</Card>`}
      >
        <Card>
          <Heading level={3}>Workspace</Heading>
          <Text muted>A little structure goes a long way.</Text>
          <Divider />
          <Badge tone="success">Active</Badge>
        </Card>
        <Card variant="elevated">
          <Heading level={3}>Elevated surface</Heading>
          <Text muted>For a little more emphasis.</Text>
          <Divider />
          <Badge tone="primary">New</Badge>
        </Card>
      </Demo>
    </>
  );
}
