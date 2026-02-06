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
    <div className="overflow-x-auto w-full rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-xs sm:text-sm bg-white border-collapse min-w-[600px]">
        <thead className="bg-gradient-to-r from-[#1a237e] to-[#303f9f] text-white">
          <tr>
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={clsx(
                  "p-3 sm:p-4 text-left font-semibold whitespace-nowrap", 
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="p-6 sm:p-8 text-center text-gray-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>No data found</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, ri) => (
              <tr 
                key={ri} 
                className={clsx(
                  "border-t border-gray-100 hover:bg-[#e8eaf6] transition-colors", 
                  rowClassName
                )}
              >
                {columns.map((col, ci) => (
                  <td 
                    key={ci} 
                    className={clsx("p-3 sm:p-4", col.className)}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as any)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;