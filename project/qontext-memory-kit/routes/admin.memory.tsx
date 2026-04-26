import { createFileRoute } from "@tanstack/react-router";
import { MemoryBrowserPage } from "@/components/admin/memory/memory-browser-page";

export const Route = createFileRoute("/admin/memory")({
  head: () => ({
    meta: [
      { title: "Memory · Admin · Qontext" },
      {
        name: "description",
        content:
          "VFS-style browser of every entity, fact, and the source or interview that produced it.",
      },
    ],
  }),
  component: MemoryBrowserPage,
});
