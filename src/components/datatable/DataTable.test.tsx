/**
 * Basic tests for DataTable component using React Testing Library + Jest
 *
 * Ensure you have jest + @testing-library/react configured in your project.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataTable from "./DataTable";
import type { Column } from "./DataTable.types";

type Row = {
  id: string;
  name: string;
  age: number;
};

const columns: Column<Row>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

const sample = [
  { id: "1", name: "Zara", age: 20 },
  { id: "2", name: "Amit", age: 30 },
  { id: "3", name: "Bob", age: 25 },
];

describe("DataTable", () => {
  test("renders rows", () => {
    render(<DataTable data={sample} columns={columns} />);
    // Expect to find a cell with Zara
    expect(screen.getByText("Zara")).toBeInTheDocument();
    expect(screen.getByText("Amit")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(<DataTable data={[]} columns={columns} loading />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  test("shows empty state", () => {
    render(<DataTable data={[]} columns={columns} loading={false} />);
    expect(screen.getByText(/No records found/)).toBeInTheDocument();
  });

  test("sorts when header clicked", () => {
    render(<DataTable data={sample} columns={columns} />);
    // click Age header to sort asc
    const ageHeader = screen.getByRole("button", { name: /Age/i });
    fireEvent.click(ageHeader);
    // after sorting asc, first row should be Zara (20)
    const firstRow = screen.getAllByRole("row")[1]; // 0 -> header row
    expect(firstRow).toHaveTextContent("Zara");
    // click again -> desc
    fireEvent.click(ageHeader);
    const firstRowDesc = screen.getAllByRole("row")[1];
    expect(firstRowDesc).toHaveTextContent("Amit"); // age 30
  });

  test("selects rows (multiple)", () => {
    const onSelect = jest.fn();
    render(
      <DataTable
        data={sample}
        columns={columns}
        selectable
        orRowSelect={onSelect}
      />
    );
    // select first row via checkbox
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    // first checkbox is "select all", second is first row
    expect(checkboxes.length).toBeGreaterThan(1);
    fireEvent.click(checkboxes[1]);
    // callback should be called with an array of selected rows
    expect(onSelect).toHaveBeenCalled();
    const calledWith = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(Array.isArray(calledWith)).toBe(true);
    expect(calledWith[0].name).toBeDefined();
  });
});
