"use client";

import { useEffect }
  from "react";

import { useRouter }
  from "next/navigation";

import { useAuth }
  from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {

  const router = useRouter();

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {

    if (
      !loading &&
      !isAuthenticated
    ) {

      router.push("/login");
    }

  }, [
    loading,
    isAuthenticated,
    router,
  ]);

  if (
    loading ||
    !isAuthenticated
  ) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return children;
}