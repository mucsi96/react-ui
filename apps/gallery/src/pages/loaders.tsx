import { useState } from 'react';
import {
  BarLoader,
  Spinner,
  ProgressBar,
  LoadingArea,
  Button,
  Dialog,
  DialogTrigger,
} from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';
import styles from './loading-area.module.css';

export default function LoadersPage() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <PageHeader
        title="Loaders"
        description="Monochrome progress feedback against dark surfaces. Every animated indicator respects reduced-motion preferences."
      />
      <Demo
        title="Full-page loading"
        code={`<div className={styles.page}>
  <AppHeader>Workspace</AppHeader>
  <AppMain className={styles.main}>
    <LoadingArea label="Loading workspace" fill />
  </AppMain>
</div>`}
      >
        <a href="#/loading-preview">Open full-page loading example</a>
      </Demo>
      <Demo
        title="Section loading"
        code={`<LoadingArea label="Loading recent activity" className={styles.sectionArea} />`}
        stack
      >
        <div className={styles.section}>
          <h3>Recent activity</h3>
          {loading ? (
            <LoadingArea label="Loading recent activity" className={styles.sectionArea} />
          ) : (
            <p>Your activity is up to date.</p>
          )}
          <Button onPress={() => setLoading(!loading)}>
            {loading ? 'Finish section loading' : 'Reload section'}
          </Button>
        </div>
      </Demo>
      <Demo
        title="Dialog loading"
        code={`<DialogTrigger>
  <Button>Open loading dialog</Button>
  <Dialog title="Source options">
    <LoadingArea label="Loading source options" style={{ minBlockSize: '12rem' }} />
  </Dialog>
</DialogTrigger>`}
      >
        <DialogTrigger>
          <Button>Open loading dialog</Button>
          <Dialog
            title="Source options"
            footer={({ close }) => <Button onPress={close}>Cancel</Button>}
          >
            <LoadingArea label="Loading source options" style={{ minBlockSize: '12rem' }} />
          </Dialog>
        </DialogTrigger>
      </Demo>
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
