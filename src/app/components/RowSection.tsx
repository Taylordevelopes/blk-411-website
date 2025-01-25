"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ColumnData {
  title: string;
  description: string;
  buttonLabel: string;
  navigateTo: string; // Path to navigate to on button click
}

interface RowColumnsProps {
  columns: ColumnData[]; // Array of column data
}

function RowSection({ columns }: RowColumnsProps) {
  const router = useRouter();

  return (
    <div className="container my-5">
      <div className="row">
        {columns.map((column, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="p-3 border rounded text-center h-100">
              <h3 className="mb-3">{column.title}</h3>
              <p className="mb-4">{column.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => router.push(column.navigateTo)}
              >
                {column.buttonLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RowSection;
