import { AppHeader, AppMain, Button, LoadingArea } from '@mucsi96/react-ui';
import { useState } from 'react';
import styles from './loading-area.module.css';

export default function LoadingPreview() {
  const [loading, setLoading] = useState(true);
  return (
    <div className={styles.page}>
      <AppHeader>
        <h1>Workspace</h1>
        <Button onPress={() => setLoading(!loading)}>
          {loading ? 'Finish loading' : 'Reload workspace'}
        </Button>
        <a href="#/loaders">Back to loaders</a>
      </AppHeader>
      <AppMain className={styles.main}>
        {loading ? <LoadingArea label="Loading workspace" fill /> : <p>Workspace ready.</p>}
      </AppMain>
    </div>
  );
}
