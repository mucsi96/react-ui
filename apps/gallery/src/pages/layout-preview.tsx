import {
  AppHeader,
  AppHeaderActions,
  AppMain,
  Button,
  Heading,
  LinkButton,
  Menu,
  MenuItem,
  MenuPopover,
  MenuTrigger,
} from '@mucsi96/react-ui';
import styles from './app-layout.module.css';

export default function LayoutPreview() {
  return (
    <>
      <AppHeader>
        <a href="#/layout-preview">My application</a>
        <AppHeaderActions>
          <nav aria-label="Main navigation" className={styles.navigation}>
            <LinkButton href="#/layout-preview" variant="text">
              Overview
            </LinkButton>
            <LinkButton href="#/layout-preview" variant="text">
              Your library
            </LinkButton>
          </nav>
          <MenuTrigger>
            <Button variant="avatar" aria-label="Profile menu">
              IB
            </Button>
            <MenuPopover>
              <Menu aria-label="Profile">
                <MenuItem>Igor Bari</MenuItem>
              </Menu>
            </MenuPopover>
          </MenuTrigger>
        </AppHeaderActions>
      </AppHeader>
      <AppMain>
        <Heading level={1}>Your workspace</Heading>
        <p>
          The header grows when its actions wrap. Page content shares its width and safe-area
          gutters.
        </p>
      </AppMain>
    </>
  );
}
