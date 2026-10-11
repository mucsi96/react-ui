import { Alert, Button, useNotifications } from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';

export default function NotificationsPage() {
  const notifications = useNotifications();
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Clear feedback where it matters. Inline alerts stay in context, while toasts bring brief updates to the foreground."
      />
      <Demo
        title="Inline alerts"
        code={`<Alert title="A little context">Your workspace is ready.</Alert>
<Alert tone="success" title="Changes saved">Everything is up to date.</Alert>
<Alert tone="error" title="Unable to save">Check your connection and try again.</Alert>`}
        stack
      >
        <Alert title="A little context">Your workspace is ready.</Alert>
        <Alert tone="success" title="Changes saved">
          Everything is up to date.
        </Alert>
        <Alert tone="warn" title="Almost at your limit">
          You have used 90% of your storage.
        </Alert>
        <Alert tone="error" title="Unable to save">
          Check your connection and try again.
        </Alert>
      </Demo>
      <Demo
        title="Toast notifications"
        description="Toasts dismiss after four seconds by default. Hovering or focusing pauses the timer. Set duration to 0 for persistent feedback."
        code={`// Wrap your app once:
<NotificationsProvider><App /></NotificationsProvider>

// Inside any child component:
const notifications = useNotifications();
notifications.success('Changes saved');
notifications.error('Unable to save', { duration: 0 });`}
      >
        <Button
          tone="success"
          onPress={() => notifications.success('Changes saved', { title: 'Success' })}
        >
          Show success
        </Button>
        <Button
          tone="error"
          onPress={() =>
            notifications.error('Unable to save', { title: 'Something went wrong', duration: 0 })
          }
        >
          Show error
        </Button>
        <Button variant="outlined" onPress={() => notifications.info('A new version is available')}>
          Show info
        </Button>
        <Button variant="text" onPress={notifications.clear}>
          Clear notifications
        </Button>
      </Demo>
    </>
  );
}
