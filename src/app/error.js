"use client";

import ErrorState from "@/components/shared/ErrorState";
import React, { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Category page error:", error);
  }, [error]);

  return (
    <main className="flex items-center justify-center">
      <ErrorState
        onRetry={reset}
        showDetails={process.env.NODE_ENV !== "production"}
        error={error}
      />
    </main>
  );
}
