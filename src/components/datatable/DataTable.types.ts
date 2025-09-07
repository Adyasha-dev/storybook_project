export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  // optional renderer for custom cell output
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  // matches your requirement name (you used orRowSelect). Keep signature typed.
  orRowSelect?: (selectedRows: T[]) => void;
  // optional table label for accessibility
  "aria-label"?: string;
  // allow single selection (true) or multiple (false)
  singleSelection?: boolean;
  className?: string;
}
