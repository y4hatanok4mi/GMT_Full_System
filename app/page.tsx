"use client";

import React, { useState, useEffect } from "react";

const DefaultPage = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(true);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
      GeomeTriks
    </div>
  );
};

export default DefaultPage;
