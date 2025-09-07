import { useMemo, useState, useEffect } from "react";
import type { Column, DataTableProps, SortDirection } from "./DataTable.types";
import cn from "classnames";

/**
 * Generic DataTable component
 * - Sorting
 * - Selection (single/multiple)
 * - Loading & Empty states
 * - Responsive (horizontal scroll + mobile card view)
 * - Basic ARIA accessibility
 */

function sortData<T>(data: T[], key: keyof T, dir: SortDirection) {
  if (!dir) return data;
  const sorted = [...data].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    // simple compare that handles strings and numbers
    if (va == null && vb == null) return 0;
    if (va == null) return dir === "asc" ? -1 : 1;
    if (vb == null) return dir === "asc" ? 1 : -1;
    const sa = String(va).toLowerCase();
    const sb = String(vb).toLowerCase();
    if (sa < sb) return dir === "asc" ? -1 : 1;
    if (sa > sb) return dir === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>(
  props: DataTableProps<T>
) {
  const {
    data,
    columns,
    loading = false,
    selectable = false,
    orRowSelect,
    "aria-label": ariaLabel = "Data table",
    singleSelection = false,
    className,
  } = props;

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    // notify parent whenever selection changes
    if (orRowSelect) {
      const rows = Array.from(selected)
        .map((i) => data[i])
        .filter(Boolean);
      orRowSelect(rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data]);

  // sortedData memoized
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return sortData(data, sortKey, sortDir);
  }, [data, sortKey, sortDir]);

  const toggleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    const key = col.dataIndex as keyof T;
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      } else setSortDir("asc");
    }
  };

  const toggleRow = (index: number) => {
    const newSet = new Set(selected);
    if (singleSelection) {
      // clear previous then set this
      if (newSet.has(index)) newSet.clear();
      else {
        newSet.clear();
        newSet.add(index);
      }
    } else {
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
    }
    setSelected(newSet);
  };

  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((_, i) => i)));
    }
  };

  const isEmpty = !loading && data.length === 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold" aria-hidden>
              {ariaLabel}
            </h3>
            <div className="text-sm text-gray-500">
              {loading
                ? "Loading…"
                : `${data.length} item${data.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div role="status" aria-live="polite" aria-busy="true">
              <svg
                className="animate-spin h-6 w-6 mr-2 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span className="align-middle">Loading</span>
            </div>
          </div>
        ) : isEmpty ? (
          // Empty state
          <div
            className="p-8 text-center text-gray-600"
            role="status"
            aria-live="polite"
          >
            No records found.
          </div>
        ) : (
          <>
            {/* Desktop / large screens: Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table
                  role="table"
                  aria-label={ariaLabel}
                  className="min-w-full divide-y divide-gray-200"
                >
                  <thead className="bg-gray-50">
                    <tr role="row">
                      {selectable && (
                        <th className="px-4 py-2 text-left">
                          <input
                            aria-label="Select all rows"
                            type="checkbox"
                            checked={
                              selected.size === data.length && data.length > 0
                            }
                            onChange={toggleAll}
                          />
                        </th>
                      )}
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          role="columnheader"
                          scope="col"
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider select-none"
                        >
                          <button
                            type="button"
                            onClick={() => toggleSort(col)}
                            disabled={!col.sortable}
                            aria-sort={
                              sortKey === col.dataIndex
                                ? sortDir === "asc"
                                  ? "ascending"
                                  : sortDir === "desc"
                                  ? "descending"
                                  : "none"
                                : "none"
                            }
                            className={cn("flex items-center gap-2", {
                              "cursor-pointer": col.sortable,
                              "opacity-60": !col.sortable,
                            })}
                          >
                            <span>{col.title}</span>
                            {col.sortable && (
                              <span
                                className="text-xs text-gray-500"
                                aria-hidden
                              >
                                {sortKey !== col.dataIndex
                                  ? "⇅"
                                  : sortDir === "asc"
                                  ? "↑"
                                  : "↓"}
                              </span>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody
                    role="rowgroup"
                    className="bg-white divide-y divide-gray-100"
                  >
                    {sortedData.map((row) => {
                      const originalIndex = data.indexOf(row);
                      const checked = selected.has(originalIndex);
                      return (
                        <tr
                          key={originalIndex}
                          role="row"
                          className="hover:bg-gray-50"
                        >
                          {selectable && (
                            <td className="px-4 py-3">
                              <input
                                aria-label={`Select row ${originalIndex + 1}`}
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleRow(originalIndex)}
                              />
                            </td>
                          )}
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {col.render
                                ? col.render(
                                    row[col.dataIndex],
                                    row,
                                    originalIndex
                                  )
                                : String(row[col.dataIndex] ?? "")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile: Card list */}
            <div className="md:hidden">
              <ul role="list" className="divide-y divide-gray-100">
                {sortedData.map((row) => {
                  const originalIndex = data.indexOf(row);
                  const checked = selected.has(originalIndex);
                  return (
                    <li key={originalIndex} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {selectable && (
                              <input
                                aria-label={`Select row ${originalIndex + 1}`}
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleRow(originalIndex)}
                                className="mr-2"
                              />
                            )}
                            <div>
                              {columns.map((col, i) => {
                                const isFirst = i === 0;
                                return (
                                  <div
                                    key={col.key}
                                    className={
                                      isFirst
                                        ? "font-medium"
                                        : "text-sm text-gray-600"
                                    }
                                  >
                                    <span className="block">
                                      {isFirst ? (
                                        col.render ? (
                                          col.render(
                                            row[col.dataIndex],
                                            row,
                                            originalIndex
                                          )
                                        ) : (
                                          String(row[col.dataIndex] ?? "")
                                        )
                                      ) : (
                                        <>
                                          <span className="font-semibold text-gray-700 mr-1">
                                            {col.title}:
                                          </span>
                                          <span>
                                            {col.render
                                              ? col.render(
                                                  row[col.dataIndex],
                                                  row,
                                                  originalIndex
                                                )
                                              : String(
                                                  row[col.dataIndex] ?? ""
                                                )}
                                          </span>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          #{originalIndex + 1}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
