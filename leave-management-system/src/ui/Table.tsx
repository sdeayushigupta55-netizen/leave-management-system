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
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
};

function Table<T>({
  columns,
  data,
  rowClassName,
  page = 1,
  pageSize = 8,
  onPageChange,
}: TableProps<T>) {
  const totalPages = Math.ceil(data.length / pageSize);
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize);

  /** Create page numbers with ellipsis */
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - page) <= 1
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..."
      ) {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="overflow-x-auto w-full rounded-xl shadow-sm border border-gray-100 bg-white">

      {/* TABLE */}
      <table className="w-full text-xs sm:text-sm border-collapse min-w-[600px]">
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
          {pagedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-gray-400"
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
            pagedData.map((row, ri) => (
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">

          {/* RANGE INFO */}
          <p className="text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              {(page - 1) * pageSize + 1}
            </span>{" "}
            –{" "}
            <span className="font-semibold">
              {Math.min(page * pageSize, data.length)}
            </span>{" "}
            of <span className="font-semibold">{data.length}</span>
          </p>

          {/* CONTROLS */}
          <div className="flex items-center gap-1">

            {/* FIRST */}
            <button
              onClick={() => onPageChange?.(1)}
              disabled={page === 1}
              className="px-2 py-1.5 rounded-lg text-sm border bg-white hover:bg-gray-100 disabled:opacity-40"
            >
              «
            </button>

            {/* PREV */}
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1}
              className="px-2 py-1.5 rounded-lg text-sm border bg-white hover:bg-gray-100 disabled:opacity-40"
            >
              ‹
            </button>

            {/* PAGE NUMBERS */}
            {getVisiblePages().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={i}
                  onClick={() => onPageChange?.(p as number)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                    page === p
                      ? "bg-[#1a237e] text-white shadow"
                      : "bg-white border hover:bg-[#e8eaf6] text-[#1a237e]"
                  )}
                >
                  {p}
                </button>
              )
            )}

            {/* NEXT */}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === totalPages}
              className="px-2 py-1.5 rounded-lg text-sm border bg-white hover:bg-gray-100 disabled:opacity-40"
            >
              ›
            </button>

            {/* LAST */}
            <button
              onClick={() => onPageChange?.(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1.5 rounded-lg text-sm border bg-white hover:bg-gray-100 disabled:opacity-40"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
