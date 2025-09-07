import type { Meta, StoryObj } from "@storybook/react-vite";
import DataTable from "./DataTable";
import type { Column } from "./DataTable.types";

type Person = {
  id: string;
  name: string;
  email: string;
  age: number;
  city?: string;
};

const meta: Meta<typeof DataTable<Person>> = {
  title: "Components/DataTable",
  component: DataTable<Person>, // tell Storybook it’s generic
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataTable<Person>>;

const columns: Column<Person>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "email", title: "Email", dataIndex: "email" },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
  { key: "city", title: "City", dataIndex: "city" },
];

const data: Person[] = [
  {
    id: "1",
    name: "Asha",
    email: "asha@example.com",
    age: 28,
    city: "Bhubaneswar",
  },
  {
    id: "2",
    name: "Rahul",
    email: "rahul@example.com",
    age: 34,
    city: "Cuttack",
  },
  { id: "3", name: "Maya", email: "maya@example.com", age: 22, city: "Puri" },
  { id: "4", name: "Sukanya", email: "sukanya@example.com", age: 41 },
];

export const Default: Story = {
  args: {
    data,
    columns,
    loading: false,
    selectable: true,
    singleSelection: false,
    "aria-label": "User list",
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
    selectable: false,
    "aria-label": "Loading table example",
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    loading: false,
    selectable: false,
    "aria-label": "Empty table example",
  },
};

export const SingleSelect: Story = {
  args: {
    data,
    columns,
    selectable: true,
    singleSelection: true,
    orRowSelect: (rows: Person[]) => {
      // eslint-disable-next-line no-console
      console.log("selected rows", rows);
    },
  },
};
