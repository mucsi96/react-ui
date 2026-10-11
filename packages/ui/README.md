# @mucsi96/react-ui

Accessible, dark-first React components with CSS Modules, TypeScript, and a cohesive semantic palette.

[Interactive gallery](https://mucsi96.github.io/react-ui/) · [Source](https://github.com/mucsi96/react-ui)

## Getting started

Requires React and React DOM 19.3 or newer within React 19. The package is ESM and includes TypeScript declarations. It is prepared for npm publishing; see the repository README for installing a local tarball before the first release.

Import the stylesheet **once**, at your application entry point:

```tsx
import { Button } from '@mucsi96/react-ui';
import '@mucsi96/react-ui/styles.css';

export function SaveAction() {
  return <Button onPress={() => save()}>Save</Button>;
}
```

Components need no theme provider. The stylesheet defines the dark `--bt-*` tokens and `color-scheme` on `:root`; all component selectors and animations are locally scoped. It does not reset your application's typography or layout. The library entry is marked as a client boundary for React Server Component frameworks.

## Buttons

```tsx
<Button variant="filled" tone="success" onPress={save}>Save</Button>
<Button variant="raised" tone="error">Incorrect</Button>
<Button variant="outlined">Secondary</Button>
<Button variant="text">Cancel</Button>
<Button variant="icon" aria-label="Search"><SearchIcon /></Button>
<Button variant="fab"><PlusIcon />New item</Button>
<Button variant="mini-fab" aria-label="Add"><PlusIcon /></Button>
<Button isDisabled>Unavailable</Button>
<LinkButton href="/settings" variant="outlined">Settings</LinkButton>
```

`tone` accepts `primary` (default), `success`, `warn`, and `error`. Solid variants share the same background, automatically contrasting black/white label, and same-hue hover. Modern relative OKLCH color syntax derives these coordinated colors. Pass `background="#28a745"` or set `--bt-button-bg` in your own CSS Module to customize a solid action. Text/outlined/icon variants use neutral surfaces.

Buttons expose React Aria's press API (`onPress`, `isDisabled`) and React 19's `ref` prop. Set `type="submit"` for form submission. Supply an accessible label for icon-only actions. Icons are ordinary React children; no icon package is imposed on consumers.

## Forms

```tsx
const [email, setEmail] = useState('');
const options = [{ id: 'apple', label: 'Apple' }, { id: 'pear', label: 'Pear' }];

<TextField label="Email" name="email" type="email" isRequired
  value={email} onChange={setEmail} description="We will never share your address." />
<TextField label="Bio" multiline rows={4} appearance="filled" />
<Select label="Fruit" options={options} />
<ComboBox label="Search fruits" options={options} />
<Checkbox defaultSelected>Subscribe</Checkbox>
<RadioGroup label="Size" defaultValue="medium">
  <Radio value="small">Small</Radio>
  <Radio value="medium">Medium</Radio>
</RadioGroup>
<Switch defaultSelected>Notifications</Switch>
```

Labels, descriptions, and validation messages are associated with the input automatically. `TextField`, `Select`, and `ComboBox` accept `error` for application validation. For an externally managed error, use `validationBehavior="aria"` to expose invalid state without waiting for native form submission. Native constraints (`isRequired`, `type`, `minLength`, etc.) also remain available.

Select options have `{ id, label, isDisabled? }`; React Aria handles selection, typeahead, and filtering. Checkbox and switch controlled state uses `isSelected`/`onChange`; radio group state uses `value`/`onChange`. React Aria form `name` props support native form submissions.

## Donut slider

```tsx
const [amount, setAmount] = useState(15);

<DonutSlider
  label="Tip"
  unit="%"
  value={amount}
  onChange={setAmount}
  valuePerTurn={20}
  step={1}
  min={0}
  max={100}
/>;
```

| Prop                 | Default   | Purpose                                        |
| -------------------- | --------- | ---------------------------------------------- |
| `label`              | required  | Visible and accessible name                    |
| `value` / `onChange` | —         | Controlled value and callback                  |
| `defaultValue`       | `0`       | Initial uncontrolled value                     |
| `valuePerTurn`       | `100`     | Value added by one full clockwise turn         |
| `step`               | `1`       | Positive snap grid and keyboard increment      |
| `min` / `max`        | unbounded | Optional limits; negative values are supported |
| `unit`               | `''`      | Readout and accessible-value suffix            |
| `size`               | `220`     | Diameter in pixels, capped by available width  |
| `displayDecimals`    | `0`       | Decimal places in the readout                  |
| `isDisabled`         | `false`   | Prevent pointer/keyboard interaction           |

Tap chooses the nearest revolution; continuous dragging accumulates full turns across the seam. Pointer capture keeps the drag active outside the ring and releases on pointer cancellation. Arrow keys increment/decrement by `step`; Page Up/Down move by one tenth of a turn; Home/End use the supplied bounds. Values snap to zero-based step multiples and then clamp to bounds. The slider is not a native form field; include a hidden input if you need its value in `FormData`.

## Menus and split buttons

```tsx
<MenuTrigger>
  <Button>Actions</Button>
  <MenuPopover>
    <Menu aria-label="Actions">
      <MenuItem onAction={edit}>Edit</MenuItem>
      <MenuItem onAction={duplicate}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem tone="error" onAction={remove}>Delete</MenuItem>
    </Menu>
  </MenuPopover>
</MenuTrigger>

<SplitButton label="Save" onPress={save} menuLabel="Save options">
  <MenuItem onAction={saveAs}>Save as…</MenuItem>
  <MenuItem onAction={saveAndClose}>Save and close</MenuItem>
</SplitButton>
```

For nested actions, compose `SubmenuTrigger` with a `MenuItem` and another `MenuPopover`/`Menu`. Use `textValue` on items containing icons or other complex content. `MenuSeparator` separates groups. `SplitButton` accepts the button's tone, custom background, and disabled props for both halves.

## Dialogs and tooltips

```tsx
<DialogTrigger>
  <Button>Create project</Button>
  <Dialog title="New project" description="Give your next idea a home.">
    {({ close }) => <>
      <TextField label="Project name" />
      <Button onPress={close}>Done</Button>
    </>}
  </Dialog>
</DialogTrigger>

<Tooltip content="Search">
  <Button variant="icon" aria-label="Search"><SearchIcon /></Button>
</Tooltip>
```

Dialog focus is trapped while open and restored to the trigger on close. Escape and outside interaction dismiss by default; `isDismissable={false}` disables outside dismissal, and `isKeyboardDismissDisabled` disables Escape. Use `role="alertdialog"` for important confirmations. Dialogs also support controlled `isOpen`/`onOpenChange` without a `DialogTrigger`. Forms and action layouts are composed as ordinary children. Tooltips accept a single pressable child, `content`, optional `placement`, and `delay`.

## Notifications

```tsx
<NotificationsProvider>
  <App />
</NotificationsProvider>;

function SaveButton() {
  const notifications = useNotifications();
  return <Button onPress={() => notifications.success('Changes saved')}>Save</Button>;
}

<Alert tone="error" title="Unable to save">
  Try again in a moment.
</Alert>;
```

The hook exposes `info`, `success`, `warn`, and `error`, returning a notification ID. Each accepts `{ title?, duration? }`; the default duration is 4000 ms, and `0` keeps it until dismissed. Timers pause while hovered or focused and are cleaned up on unmount. Use `dismiss(id)` or `clear()` to remove notifications. Error notifications use an assertive live region; other tones use a polite status. Toasts render in a body portal, so theme overrides for overlays belong on `:root`.

## Data table

```tsx
const columns: TableColumn<Person>[] = [
  {
    id: 'name',
    label: 'Person',
    renderCell: (row) => row.name,
    compare: (a, b) => a.name.localeCompare(b.name),
  },
  {
    id: 'age',
    label: 'Age',
    renderCell: (row) => row.age,
    compare: (a, b) => a.age - b.age,
    align: 'end',
  },
];

<DataTable
  caption="People"
  rows={people}
  columns={columns}
  getRowKey={(row) => row.id}
  pageSize={10}
  selectedKey={selectedKey}
  onSelectionChange={setSelectedKey}
  getRowLabel={(row) => row.name}
/>;
```

This is a semantic HTML table. Columns with `compare` have three-state sorting (ascending, descending, original order) and `aria-sort` feedback. Sorting precedes pagination. Selection is controlled and exposed through keyboard-accessible row buttons; `getRowLabel` names those buttons. Omitting `onSelectionChange` removes selection entirely. Use `emptyMessage` for empty results. Horizontal overflow stays within the table on narrow screens.

## Loading, surfaces, and typography

```tsx
<BarLoader label="Loading workspace" />
<Spinner label="Fetching results" />
<ProgressBar label="Uploading" value={65} />
<ProgressBar label="Preparing" isIndeterminate />

<Card variant="outlined">
  <Heading level={3}>Workspace</Heading>
  <Text muted>Supporting information.</Text>
  <Divider />
  <Badge tone="success">Active</Badge>
</Card>
```

All loading animations respect reduced motion. `Card` supports `outlined` and `elevated`; `Badge` accepts semantic tones and `neutral`. `Heading` supports semantic levels 1–6, `Text` supports `muted`, and `Code` provides inline monospace styling.

## Customize with CSS Modules

```css
/* Application-level tokens, including portaled overlays */
:root {
  --bt-primary: hsl(280, 80%, 60%);
}

/* MyPanel.module.css */
.panel {
  background: var(--bt-surface-1);
  color: var(--bt-text-default);
}
.customAction {
  --bt-button-bg: #28a745;
}
```

Use `className` to extend styles without reaching into internal module selectors. The public palette includes `surface-0` through `surface-4`, `outline`, `text-strong`, `text-default`, `text-muted`, `text-on-brand`, `primary`, `primary-hover`, `link`, `link-hint`, semantic `success`/`warn`/`error` colors, hover variants, soft variants, and success/error foreground tokens. Shared `--bt-font`, `--bt-font-mono`, `--bt-radius`, `--bt-radius-lg`, and `--bt-shadow` tokens complete the foundation.

MIT © Igor Bari
