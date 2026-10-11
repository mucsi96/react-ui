import { Check, Plus, Search, Save } from 'lucide-react';
import {
  Button,
  LinkButton,
  SplitButton,
  MenuItem,
  Tooltip,
  useNotifications,
} from '@mucsi96/react-ui';
import type { ButtonVariant, Tone } from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';
import styles from './pages.module.css';

const tones: Tone[] = ['primary', 'success', 'warn', 'error'];
const solidVariants: ButtonVariant[] = ['filled', 'raised', 'fab', 'mini-fab'];

export default function ButtonsPage() {
  const notifications = useNotifications();
  return (
    <>
      <PageHeader
        title="Buttons"
        description="From quiet secondary actions to expressive semantic colors. One component, consistent behavior."
      />
      <Demo
        title="Button variants"
        code={`<Button>Filled</Button>
<Button variant="raised">Raised</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
<Button isDisabled>Disabled</Button>`}
      >
        <Button>Filled</Button>
        <Button variant="raised">Raised</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button isDisabled>Disabled</Button>
        <Button>
          <Save size={16} aria-hidden="true" />
          With icon
        </Button>
      </Demo>
      <Demo
        title="Semantic button colors"
        description="Every solid variant derives its contrasting label and same-hue hover from the same background. Disabled buttons retain a quiet appearance."
        code={`<Button tone="success">Mark as known</Button>
<Button variant="raised" tone="error">Incorrect</Button>
<Button variant="fab" tone="warn">Review</Button>
<Button variant="mini-fab" tone="error" aria-label="Remove"><Trash2 /></Button>`}
        stack
      >
        {tones.map((tone) => (
          <div key={tone} className={styles.row}>
            {solidVariants.map((variant) => (
              <Button
                key={variant}
                variant={variant}
                tone={tone}
                aria-label={variant === 'mini-fab' ? `mini-fab ${tone}` : undefined}
              >
                {variant === 'mini-fab' ? (
                  <Check size={18} aria-hidden="true" />
                ) : (
                  `${variant} ${tone}`
                )}
              </Button>
            ))}
            <Button tone={tone} isDisabled>
              Disabled {tone}
            </Button>
          </div>
        ))}
      </Demo>
      <Demo
        title="Custom colors"
        description="A single background value coordinates the label, hover, and pressed states. CSS Modules can also set --bt-button-bg locally."
        code={`<Button background="#28a745">Correct</Button>
<Button background="#dc3545">Incorrect</Button>
<Button background="#f7d046">Review</Button>`}
      >
        <Button background="#28a745">Correct</Button>
        <Button background="#dc3545">Incorrect</Button>
        <Button background="#f7d046">Review</Button>
        <Button variant="raised" background="#7c3aed">
          Custom raised
        </Button>
      </Demo>
      <Demo
        title="Icon and floating actions"
        code={`<Tooltip content="Search"><Button variant="icon" aria-label="Search"><Search /></Button></Tooltip>
<Button variant="fab" aria-label="Add"><Plus /></Button>
<Button variant="fab"><Plus />New item</Button>`}
      >
        <Tooltip content="Search">
          <Button variant="icon" aria-label="Search">
            <Search size={20} aria-hidden="true" />
          </Button>
        </Tooltip>
        <Button variant="fab" aria-label="Add">
          <Plus size={22} aria-hidden="true" />
        </Button>
        <Button variant="fab">
          <Plus size={20} aria-hidden="true" />
          New item
        </Button>
        <Button variant="mini-fab" aria-label="Add small">
          <Plus size={18} aria-hidden="true" />
        </Button>
      </Demo>
      <Demo
        title="Split button"
        description="Separate a primary action from its secondary menu. Both halves share their tone and disabled state."
        code={`<SplitButton label="Save" menuLabel="Save options" onPress={save}>
  <MenuItem onAction={saveAs}>Save as…</MenuItem>
  <MenuItem onAction={saveAndClose}>Save and close</MenuItem>
</SplitButton>`}
      >
        <SplitButton
          label="Save"
          icon={<Save size={16} aria-hidden="true" />}
          menuLabel="Save options"
          onPress={() => notifications.success('Saved changes')}
        >
          <MenuItem onAction={() => notifications.success('Saved a copy')}>Save as…</MenuItem>
          <MenuItem onAction={() => notifications.success('Saved and closed')}>
            Save and close
          </MenuItem>
        </SplitButton>
        <SplitButton
          label="Delete"
          tone="error"
          menuLabel="Delete options"
          onPress={() => notifications.error('Deleted item')}
        >
          <MenuItem>Move to trash</MenuItem>
          <MenuItem tone="error">Delete forever</MenuItem>
        </SplitButton>
        <SplitButton label="Disabled split" isDisabled>
          <MenuItem>Unreachable action</MenuItem>
        </SplitButton>
      </Demo>
      <Demo
        title="Link buttons"
        description="Navigation uses real links, with the same presentation as actions."
        code={`<LinkButton href="https://github.com/mucsi96/react-ui" variant="outlined">View source</LinkButton>`}
      >
        <LinkButton href="https://github.com/mucsi96/react-ui" variant="outlined">
          View source
        </LinkButton>
      </Demo>
    </>
  );
}
