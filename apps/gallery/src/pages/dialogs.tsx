import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  TextField,
  Text,
  useNotifications,
} from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';
import styles from './pages.module.css';

export default function DialogsPage() {
  const [name, setName] = useState('');
  const notifications = useNotifications();
  return (
    <>
      <PageHeader
        title="Dialogs"
        description="Focused conversations with your interface. Focus is trapped while open and returns to the trigger when dismissed."
      />
      <Demo
        title="Confirmation dialog"
        description="Escape and outside interaction dismiss by default. Use alertdialog for an important confirmation."
        code={`<DialogTrigger>
  <Button tone="error">Delete item</Button>
  <Dialog title="Delete this item?" description="This action cannot be undone." role="alertdialog">
    {({ close }) => <>
      <Button variant="text" onPress={close}>Cancel</Button>
      <Button tone="error" onPress={() => { remove(); close(); }}>Delete</Button>
    </>}
  </Dialog>
</DialogTrigger>`}
      >
        <DialogTrigger>
          <Button tone="error">Delete item</Button>
          <Dialog
            title="Delete this item?"
            description="This action cannot be undone."
            role="alertdialog"
          >
            {({ close }) => (
              <div className={styles.actions}>
                <Button variant="text" onPress={close}>
                  Cancel
                </Button>
                <Button
                  tone="error"
                  onPress={() => {
                    notifications.success('Item deleted');
                    close();
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </Dialog>
        </DialogTrigger>
      </Demo>
      <Demo
        title="Form dialog"
        description="Keep form state in React and compose standard fields inside the dialog."
        code={`<DialogTrigger>
  <Button>Create project</Button>
  <Dialog title="New project" description="Give your next idea a home.">
    {({ close }) => <form onSubmit={handleSubmit}>
      <TextField label="Project name" name="name" isRequired />
      <Button type="submit">Create</Button>
    </form>}
  </Dialog>
</DialogTrigger>`}
      >
        <DialogTrigger>
          <Button>Create project</Button>
          <Dialog title="New project" description="Give your next idea a home.">
            {({ close }) => (
              <form
                className={styles.stack}
                onSubmit={(event) => {
                  event.preventDefault();
                  notifications.success(`Created ${name}`);
                  close();
                  setName('');
                }}
              >
                <TextField
                  label="Project name"
                  name="name"
                  value={name}
                  onChange={setName}
                  isRequired
                />
                <TextField label="Project description" multiline />
                <Text muted>You can invite your team later.</Text>
                <div className={styles.actions}>
                  <Button variant="text" onPress={close}>
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            )}
          </Dialog>
        </DialogTrigger>
      </Demo>
    </>
  );
}
