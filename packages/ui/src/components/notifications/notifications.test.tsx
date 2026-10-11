import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NotificationsProvider, useNotifications } from './notifications';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function Example() {
  const notifications = useNotifications();
  return (
    <>
      <button onClick={() => notifications.success('Saved')}>Save</button>
      <button onClick={() => notifications.error('Failed', { duration: 0 })}>Fail</button>
      <button onClick={notifications.clear}>Clear</button>
    </>
  );
}

it('pauses dismissal on hover and focus, resumes the remaining duration, and cleans up in StrictMode', () => {
  const { unmount } = render(
    <StrictMode>
      <NotificationsProvider defaultDuration={4000}>
        <Example />
      </NotificationsProvider>
    </StrictMode>,
  );
  fireEvent.click(screen.getByText('Save'));
  const toast = screen.getByRole('status');
  act(() => vi.advanceTimersByTime(1000));
  fireEvent.mouseEnter(toast);
  act(() => vi.advanceTimersByTime(5000));
  expect(toast).toBeInTheDocument();
  fireEvent.focus(screen.getByRole('button', { name: 'Dismiss notification' }));
  fireEvent.mouseLeave(toast);
  act(() => vi.advanceTimersByTime(5000));
  expect(toast).toBeInTheDocument();
  fireEvent.blur(screen.getByRole('button', { name: 'Dismiss notification' }));
  act(() => vi.advanceTimersByTime(2999));
  expect(toast).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Save'));
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it('keeps persistent errors until dismissed and clears queued notifications', () => {
  render(
    <NotificationsProvider>
      <Example />
    </NotificationsProvider>,
  );
  fireEvent.click(screen.getByText('Fail'));
  act(() => vi.advanceTimersByTime(60000));
  expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Save'));
  fireEvent.click(screen.getByText('Fail'));
  fireEvent.click(screen.getByText('Clear'));
  expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();
});
