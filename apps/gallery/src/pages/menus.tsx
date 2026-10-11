import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Button,
  Menu,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
  useNotifications,
} from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';

export default function MenusPage() {
  const notifications = useNotifications();
  return (
    <>
      <PageHeader
        title="Menus"
        description="Composable action surfaces with keyboard navigation, typeahead, and nested submenus."
      />
      <Demo
        title="Dropdown menu"
        code={`<MenuTrigger>
  <Button>Actions</Button>
  <MenuPopover>
    <Menu aria-label="Actions">
      <MenuItem onAction={edit}>Edit</MenuItem>
      <MenuItem onAction={duplicate}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem tone="error" onAction={remove}>Delete</MenuItem>
    </Menu>
  </MenuPopover>
</MenuTrigger>`}
      >
        <MenuTrigger>
          <Button>
            Actions <span aria-hidden="true">⌄</span>
          </Button>
          <MenuPopover>
            <Menu aria-label="Actions">
              <MenuItem textValue="Edit" onAction={() => notifications.info('Editing item')}>
                <Edit size={16} aria-hidden="true" />
                Edit
              </MenuItem>
              <MenuItem
                textValue="Duplicate"
                onAction={() => notifications.success('Duplicated item')}
              >
                <Copy size={16} aria-hidden="true" />
                Duplicate
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                textValue="Delete"
                tone="error"
                onAction={() => notifications.error('Deleted item')}
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete
              </MenuItem>
            </Menu>
          </MenuPopover>
        </MenuTrigger>
        <MenuTrigger>
          <Button variant="icon" aria-label="More">
            <MoreHorizontal size={20} aria-hidden="true" />
          </Button>
          <MenuPopover>
            <Menu aria-label="More actions">
              <MenuItem>Pin</MenuItem>
              <MenuItem>Archive</MenuItem>
              <MenuItem isDisabled>Move (disabled)</MenuItem>
            </Menu>
          </MenuPopover>
        </MenuTrigger>
      </Demo>
      <Demo
        title="Nested submenu"
        description="Submenus retain the same focus and dismissal behavior. Use Right Arrow to enter and Left Arrow to return."
        code={`<MenuTrigger>
  <Button variant="outlined">Formatting</Button>
  <MenuPopover>
    <Menu aria-label="Formatting">
      <SubmenuTrigger>
        <MenuItem>Text style</MenuItem>
        <MenuPopover><Menu aria-label="Text style">
          <MenuItem>Bold</MenuItem><MenuItem>Italic</MenuItem>
        </Menu></MenuPopover>
      </SubmenuTrigger>
      <MenuItem>Reset</MenuItem>
    </Menu>
  </MenuPopover>
</MenuTrigger>`}
      >
        <MenuTrigger>
          <Button variant="outlined">Formatting</Button>
          <MenuPopover>
            <Menu aria-label="Formatting">
              <SubmenuTrigger>
                <MenuItem>Text style</MenuItem>
                <MenuPopover>
                  <Menu aria-label="Text style">
                    <MenuItem>Bold</MenuItem>
                    <MenuItem>Italic</MenuItem>
                    <MenuItem>Underline</MenuItem>
                  </Menu>
                </MenuPopover>
              </SubmenuTrigger>
              <SubmenuTrigger>
                <MenuItem>Alignment</MenuItem>
                <MenuPopover>
                  <Menu aria-label="Alignment">
                    <MenuItem>Left</MenuItem>
                    <MenuItem>Center</MenuItem>
                    <MenuItem>Right</MenuItem>
                  </Menu>
                </MenuPopover>
              </SubmenuTrigger>
              <MenuItem>Reset</MenuItem>
            </Menu>
          </MenuPopover>
        </MenuTrigger>
      </Demo>
    </>
  );
}
