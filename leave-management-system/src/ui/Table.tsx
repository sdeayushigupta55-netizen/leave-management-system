import React from "react";
import clsx from "clsx";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowClassName?: string;
};

function Table<T>({ columns, data, rowClassName }: TableProps<T>) {
  return (
    <div className="overflow-x-auto w-full rounded shadow">
      <table className="w-full text-sm bg-white border-collapse">
        <thead className="bg-primary text-white ">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={clsx("p-2 text-left", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri} className={clsx("border-t", rowClassName)}>
              {columns.map((col, ci) => (
                <td key={ci} className={clsx("p-2", col.className)}>
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
