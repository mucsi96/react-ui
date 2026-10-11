import { useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { classes } from '../../internal/classes';
import styles from './donut-slider.module.css';

export interface DonutSliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  valuePerTurn?: number;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: number;
  displayDecimals?: number;
  isDisabled?: boolean;
  className?: string;
}

interface Drag {
  pointerId: number;
  lastAngle: number;
  turn: number;
}

function normalize(raw: number, step: number, min?: number, max?: number): number {
  const snapped = Number((Math.round(raw / step) * step).toFixed(12));
  return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, snapped));
}

function pointerAngle(event: PointerEvent<SVGSVGElement>): number {
  const rect = event.currentTarget.getBoundingClientRect();
  const angle = Math.atan2(
    event.clientX - rect.left - rect.width / 2,
    -(event.clientY - rect.top - rect.height / 2),
  );
  return ((angle * 180) / Math.PI + 360) % 360;
}

export function DonutSlider({
  label,
  value,
  defaultValue = 0,
  onChange,
  valuePerTurn = 100,
  step = 1,
  min,
  max,
  unit = '',
  size = 220,
  displayDecimals = 0,
  isDisabled = false,
  className,
}: DonutSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<Drag | null>(null);
  const root = useRef<HTMLDivElement>(null);

  if (!Number.isFinite(valuePerTurn) || valuePerTurn <= 0 || !Number.isFinite(step) || step <= 0) {
    throw new RangeError('DonutSlider requires positive, finite step and valuePerTurn values.');
  }
  if (min !== undefined && max !== undefined && min > max) {
    throw new RangeError('DonutSlider min must not exceed max.');
  }

  const currentValue = normalize(value ?? internalValue, step, min, max);
  const fraction = (((currentValue / valuePerTurn) % 1) + 1) % 1;
  const radians = ((fraction * 360 - 90) * Math.PI) / 180;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const formatted = currentValue.toFixed(Math.min(20, Math.max(0, Math.trunc(displayDecimals))));

  function commit(raw: number) {
    const next = normalize(raw, step, min, max);
    if (next === currentValue) return;
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  }

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (isDisabled || event.button !== 0 || drag.current) return;
    const angle = pointerAngle(event);
    const turn = Math.round(currentValue / valuePerTurn - angle / 360);
    drag.current = { pointerId: event.pointerId, lastAngle: angle, turn };
    event.currentTarget.setPointerCapture(event.pointerId);
    root.current?.focus();
    setIsDragging(true);
    commit((turn + angle / 360) * valuePerTurn);
    event.preventDefault();
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const active = drag.current;
    if (isDisabled || !active || event.pointerId !== active.pointerId) return;
    const angle = pointerAngle(event);
    if (active.lastAngle > 270 && angle < 90) active.turn += 1;
    else if (active.lastAngle < 90 && angle > 270) active.turn -= 1;
    active.lastAngle = angle;
    commit((active.turn + angle / 360) * valuePerTurn);
    event.preventDefault();
  }

  function endDrag(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerId !== drag.current?.pointerId) return;
    drag.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isDisabled) return;
    let next: number;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        next = currentValue + step;
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        next = currentValue - step;
        break;
      case 'PageUp':
        next = currentValue + valuePerTurn / 10;
        break;
      case 'PageDown':
        next = currentValue - valuePerTurn / 10;
        break;
      case 'Home':
        if (min === undefined) return;
        next = min;
        break;
      case 'End':
        if (max === undefined) return;
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    commit(next);
  }

  return (
    <div
      ref={root}
      role="slider"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={label}
      aria-valuenow={currentValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={`${formatted}${unit ? ` ${unit}` : ''}`}
      aria-disabled={isDisabled || undefined}
      className={classes(styles.slider, className)}
      data-dragging={isDragging || undefined}
      data-disabled={isDisabled || undefined}
      style={{ '--dial-size': `${size}px` } as CSSProperties}
      onKeyDown={onKeyDown}
    >
      <svg
        viewBox="0 0 220 220"
        className={styles.svg}
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <circle cx="110" cy="110" r={radius} className={styles.track} />
        <circle
          cx="110"
          cy="110"
          r={radius}
          className={styles.progress}
          strokeDasharray={`${fraction * circumference} ${circumference}`}
          transform="rotate(-90 110 110)"
        />
        <circle
          cx={110 + radius * Math.cos(radians)}
          cy={110 + radius * Math.sin(radians)}
          r="15"
          className={styles.handle}
        />
      </svg>
      <div className={styles.readout} aria-hidden="true">
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {formatted}
          <span className={styles.unit}>{unit}</span>
        </span>
      </div>
    </div>
  );
}
