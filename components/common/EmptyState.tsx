"use client";

import { Button } from "../ui/button";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({
  message = "No events found. Try adjusting your search terms.",
}: EmptyStateProps) => {
  return (
    <div className="col-span-full flex justify-center items-center py-20">
      <div className="text-center flex flex-col items-center space-y-4">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <svg
            className="w-10 h-10 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          No Events Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          {message}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Refresh
        </Button>
      </div>
    </div>
  );
};
