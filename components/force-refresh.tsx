"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ForceRefresh = () => {
    const router = useRouter();

    useEffect(() => {
        router.refresh(); // Forces the page to reload
    }, [router]);

    return null; // This component doesn't render anything
};

export default ForceRefresh;
