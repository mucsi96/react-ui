import { BarLoader, Spinner, ProgressBar } from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';

export default function LoadersPage() {
  return (
    <>
      <PageHeader
        title="Loaders"
        description="Monochrome progress feedback against dark surfaces. Every animated indicator respects reduced-motion preferences."
      />
      <Demo
        title="Bar loader"
        code={`<BarLoader label="Loading your workspace" />
<BarLoader label="Syncing changes" color="var(--bt-link-hint)" />`}
      >
        <BarLoader label="Loading your workspace" />
        <BarLoader label="Syncing changes" color="var(--bt-link-hint)" />
      </Demo>
      <Demo title="Spinner" code={`<Spinner label="Fetching results" />`}>
        <Spinner label="Fetching results" />
      </Demo>
      <Demo
        title="Linear progress"
        code={`<ProgressBar label="Uploading" value={65} />
<ProgressBar label="Preparing" isIndeterminate />`}
        stack
      >
        <ProgressBar label="Uploading" value={65} />
        <ProgressBar label="Preparing" isIndeterminate />
      </Demo>
    </>
  );
}
