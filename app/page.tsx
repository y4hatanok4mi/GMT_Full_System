"use client";

import React, { useState, useEffect } from "react";

const DefaultPage = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(true);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-6 py-4 rounded-md shadow-md text-center">
          <p className="text-lg font-semibold">Something went wrong.</p>
          <p>Please refresh the page to try again.</p>
        </div>
      )}
    </div>
  );
};

export default DefaultPage;
