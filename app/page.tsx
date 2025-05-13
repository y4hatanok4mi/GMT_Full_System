"use client";

import React, { useState, useEffect } from "react";

const DefaultPage = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(true);
  }, []);

  return (
    <h1 className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
      GeomeTriks
    </h1>
  );
};

export default DefaultPage;
