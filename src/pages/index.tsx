import { Skeleton } from "@mantine/core";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Home() {
  const Pie = useMemo(
    () =>
      dynamic(() => import("@/components/Pie"), {
        loading: () => <Skeleton height={8} mt={6} width="100%" />,
        ssr: false,
      }),
    []
  );
  return (
    <div className="flex justify-center">
      <Pie />
    </div>
  );
}
