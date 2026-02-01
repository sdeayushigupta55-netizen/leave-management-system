import React from "react";

export type CardField<T> = {
  label: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

type CardListProps<T> = {
  fields: CardField<T>[];
  data: T[];
  cardClassName?: string;
};

function CardList<T>({ fields, data, cardClassName }: CardListProps<T>) {
  return (
    <div className="grid gap-4">
      {data.map((row, i) => (
        <div key={i} className={`bg-white rounded shadow p-4 ${cardClassName || ""}`}>
          {fields.map((field, j) => (
            <div key={j} className={field.className || ""}>
              <span className="font-semibold">{field.label}: </span>
              {typeof field.accessor === "function"
                ? field.accessor(row)
                : (row[field.accessor] as any)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CardList;