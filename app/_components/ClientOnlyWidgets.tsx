"use client";

import dynamic from "next/dynamic";

const DevStatus = dynamic(() => import("./DevStatus"), { ssr: false });
const OverflowDebugger = dynamic(
  () =>
    import("@/components/OverflowDebugger").then((module) => ({
      default: module.OverflowDebugger,
    })),
  { ssr: false }
);
const AIAssistantPopup = dynamic(
  () => import("@/components/AIAssistantPopup"),
  { ssr: false }
);

export default function ClientOnlyWidgets() {
  return (
    <>
      <AIAssistantPopup />
      {process.env.NODE_ENV === "development" && (
        <>
          <DevStatus />
          <OverflowDebugger />
        </>
      )}
    </>
  );
}
