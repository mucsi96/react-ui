import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DonutSlider } from './donut-slider';

describe('DonutSlider', () => {
  it('supports decimal steps, larger keyboard changes, and bounds in controlled mode', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState(0.2);
      return (
        <DonutSlider
          label="Amount"
          value={value}
          onChange={setValue}
          step={0.1}
          valuePerTurn={10}
          min={0}
          max={2}
          displayDecimals={1}
        />
      );
    }
    render(<Example />);
    const slider = screen.getByRole('slider', { name: 'Amount' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '0.3');
    await user.keyboard('{PageUp}');
    expect(slider).toHaveAttribute('aria-valuenow', '1.3');
    await user.keyboard('{End}{ArrowUp}');
    expect(slider).toHaveAttribute('aria-valuenow', '2');
    await user.keyboard('{Home}{ArrowDown}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  it('keeps controlled values owned by the consumer', () => {
    const onChange = vi.fn();
    const { rerender } = render(<DonutSlider label="Amount" value={20} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(21);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '20');
    rerender(<DonutSlider label="Amount" value={21} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '21');
  });

  it('accumulates turns across the seam and cancels dragging', () => {
    const { container } = render(<DonutSlider label="Amount" defaultValue={95} />);
    const svg = container.querySelector('svg')!;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 220,
      bottom: 220,
      width: 220,
      height: 220,
      toJSON: () => ({}),
    });
    svg.setPointerCapture = vi.fn();
    svg.hasPointerCapture = vi.fn(() => true);
    svg.releasePointerCapture = vi.fn();
    // jsdom does not implement PointerEvent; MouseEvent provides the coordinates.
    function pointer(type: string, angle: number) {
      const radians = ((angle - 90) * Math.PI) / 180;
      const event = new MouseEvent(type, {
        bubbles: true,
        button: 0,
        clientX: 110 + 90 * Math.cos(radians),
        clientY: 110 + 90 * Math.sin(radians),
      });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      fireEvent(svg, event);
    }
    pointer('pointerdown', 342);
    pointer('pointermove', 18);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '105');
    pointer('pointermove', 342);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '95');
    pointer('pointercancel', 342);
    pointer('pointermove', 180);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '95');
    expect(svg.releasePointerCapture).toHaveBeenCalledWith(1);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'PageDown' });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '85');
  });

  it('does not change disabled values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DonutSlider label="Amount" value={10} isDisabled onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    await user.tab();
    expect(screen.getByRole('slider')).not.toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });
});
