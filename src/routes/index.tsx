import { createFileRoute } from "@tanstack/react-router";
import { TaskDashboard } from "@/components/task-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Tasks — Quietly" },
      {
        name: "description",
        content: "A warm, considered task planner for keeping risk, attention, and progress in view.",
      },
      { property: "og:title", content: "My Tasks — Quietly" },
      {
        property: "og:description",
        content: "A warm, considered task planner for keeping risk, attention, and progress in view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskDashboard,
});
