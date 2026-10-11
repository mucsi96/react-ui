import { lazy, Suspense, useEffect, useRef } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router';
import { Boxes, CodeXml, ArrowUpRight } from 'lucide-react';
import { Badge, BarLoader } from '@mucsi96/react-ui';
import styles from './app.module.css';

const pages = [
  { path: '/', label: 'Overview', component: lazy(() => import('./pages/overview')) },
  { path: '/buttons', label: 'Buttons', component: lazy(() => import('./pages/buttons')) },
  { path: '/inputs', label: 'Inputs', component: lazy(() => import('./pages/inputs')) },
  { path: '/menus', label: 'Menus', component: lazy(() => import('./pages/menus')) },
  { path: '/dialogs', label: 'Dialogs', component: lazy(() => import('./pages/dialogs')) },
  { path: '/table', label: 'Data table', component: lazy(() => import('./pages/table')) },
  {
    path: '/notifications',
    label: 'Notifications',
    component: lazy(() => import('./pages/notifications')),
  },
  { path: '/loaders', label: 'Loaders', component: lazy(() => import('./pages/loaders')) },
  { path: '/typography', label: 'Typography', component: lazy(() => import('./pages/typography')) },
];

const OverviewPage = pages[0]!.component;

export function App() {
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    document.title = `${pages.find((page) => page.path === location.pathname)?.label ?? 'Not found'} — React UI`;
    window.scrollTo(0, 0);
    main.current?.focus();
  }, [location.pathname]);

  return (
    <div className={styles.app}>
      <a
        href="#main-content"
        className={styles.skip}
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand}>
          <Boxes size={24} aria-hidden="true" />
          <span>
            react<span className={styles.brandAccent}>ui</span>
          </span>
          <Badge>0.1</Badge>
        </NavLink>
        <a href="https://github.com/mucsi96/react-ui" className={styles.github}>
          <CodeXml size={18} aria-hidden="true" />
          <span>Source</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.navHeading}>THE LIBRARY</p>
          <nav aria-label="Component documentation" className={styles.navigation}>
            {pages.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                end
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {page.label}
              </NavLink>
            ))}
          </nav>
          <p className={styles.sidebarNote}>
            Built with React.
            <br />
            Designed for clarity.
          </p>
        </aside>
        <main id="main-content" ref={main} tabIndex={-1} className={styles.main}>
          <Suspense fallback={<BarLoader label="Loading documentation" />}>
            <Routes>
              {pages.map(({ path, component: Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
              <Route path="*" element={<OverviewPage />} />
            </Routes>
          </Suspense>
          <footer className={styles.footer}>
            React UI · Functional components, thoughtful defaults.{' '}
            <a href="https://github.com/mucsi96/react-ui/blob/main/LICENSE">MIT licensed</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
