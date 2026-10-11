import { useId, useState } from 'react';
import type { Key, ReactNode } from 'react';
import { Button } from '../button/button';
import { classes } from '../../internal/classes';
import { Icon } from '../../internal/icon';
import styles from './data-table.module.css';

export interface TableColumn<T> {
  id: string;
  label: string;
  renderCell: (row: T) => ReactNode;
  compare?: (a: T, b: T) => number;
  align?: 'start' | 'end';
}

export interface DataTableProps<T> {
  caption: string;
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  getRowKey: (row: T) => Key;
  pageSize?: number;
  selectedKey?: Key | null;
  onSelectionChange?: (key: Key | null) => void;
  getRowLabel?: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

interface Sort {
  column: string;
  direction: 'ascending' | 'descending';
}

export function DataTable<T>({
  caption,
  rows,
  columns,
  getRowKey,
  pageSize = 10,
  selectedKey = null,
  onSelectionChange,
  getRowLabel,
  emptyMessage = 'No results found.',
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<Sort | null>(null);
  const [page, setPage] = useState(0);
  const emptyId = useId();
  const limit = Math.max(1, Math.trunc(pageSize));
  const pageCount = Math.max(1, Math.ceil(rows.length / limit));
  const currentPage = Math.min(page, pageCount - 1);
  const compare = columns.find((column) => column.id === sort?.column)?.compare;
  const sorted =
    compare && sort
      ? [...rows].sort((a, b) => compare(a, b) * (sort.direction === 'ascending' ? 1 : -1))
      : rows;
  const visible = sorted.slice(currentPage * limit, (currentPage + 1) * limit);

  function toggleSort(column: string) {
    setSort((current) =>
      current?.column !== column
        ? { column, direction: 'ascending' }
        : current.direction === 'ascending'
          ? { column, direction: 'descending' }
          : null,
    );
    setPage(0);
  }

  return (
    <div className={classes(styles.container, className)}>
      <div className={styles.scroll}>
        <table
          className={styles.table}
          aria-describedby={visible.length === 0 ? emptyId : undefined}
        >
          <caption className={styles.caption}>
            <span className={styles.captionText}>{caption}</span>
          </caption>
          <thead>
            <tr>
              {onSelectionChange && (
                <th scope="col">
                  <span className={styles.srOnly}>Selection</span>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  data-align={column.align}
                  aria-sort={
                    column.compare
                      ? sort?.column === column.id
                        ? sort.direction
                        : 'none'
                      : undefined
                  }
                >
                  {column.compare ? (
                    <button className={styles.sort} onClick={() => toggleSort(column.id)}>
                      {column.label}
                      <Icon
                        name={
                          sort?.column === column.id
                            ? sort.direction === 'ascending'
                              ? 'arrow-up'
                              : 'arrow-down'
                            : 'sort'
                        }
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const key = getRowKey(row);
              return (
                <tr key={key} data-selected={key === selectedKey || undefined}>
                  {onSelectionChange && (
                    <td>
                      <Button
                        variant="icon"
                        aria-label={`Select ${getRowLabel?.(row) ?? String(key)}`}
                        aria-pressed={selectedKey === key}
                        onPress={() => onSelectionChange(selectedKey === key ? null : key)}
                      >
                        <Icon name="chevron-right" />
                      </Button>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} data-align={column.align}>
                      {column.renderCell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && (
        <p id={emptyId} className={styles.empty}>
          {emptyMessage}
        </p>
      )}
      <nav aria-label={`${caption} pagination`} className={styles.pagination}>
        <span>
          {rows.length === 0 ? 0 : currentPage * limit + 1}–
          {Math.min((currentPage + 1) * limit, rows.length)} of {rows.length}
        </span>
        <Button
          variant="text"
          aria-label="Previous page"
          isDisabled={currentPage === 0}
          onPress={() => setPage(currentPage - 1)}
        >
          <Icon name="arrow-left" />
        </Button>
        <span>
          Page {currentPage + 1} of {pageCount}
        </span>
        <Button
          variant="text"
          aria-label="Next page"
          isDisabled={currentPage === pageCount - 1}
          onPress={() => setPage(currentPage + 1)}
        >
          <Icon name="arrow-right" />
        </Button>
      </nav>
    </div>
  );
}
