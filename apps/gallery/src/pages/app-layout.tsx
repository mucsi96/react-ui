import { Demo, PageHeader } from '../components/demo';
import styles from './app-layout.module.css';

export default function AppLayoutPage() {
  return (
    <>
      <PageHeader
        title="App layout"
        description="Safe-area-aware headers and aligned page content with wrapping actions."
      />
      <Demo
        title="Application header"
        code={`<AppHeader>
  <a href="/">My application</a>
  <AppHeaderActions>
    <nav aria-label="Main navigation">…</nav>
    <ProfileMenu />
  </AppHeaderActions>
</AppHeader>
<AppMain>Page content</AppMain>`}
      >
        <iframe
          className={styles.preview}
          title="Application layout preview"
          src="#/layout-preview"
        />
      </Demo>
    </>
  );
}
