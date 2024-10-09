"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function route() {
  const router = useRouter();
  useEffect(() => {
    router.push("/Login");
  }, []);
}
