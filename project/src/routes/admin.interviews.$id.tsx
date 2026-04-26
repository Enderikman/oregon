import { createFileRoute } from "@tanstack/react-router";
import { InterviewDetailPage } from "@/components/admin/interviews/interview-detail-page";

export const Route = createFileRoute("/admin/interviews/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Interview ${params.id} · Admin · Qontext` },
      {
        name: "description",
        content: "Full interview transcript, AI analysis, and the graph subgraph this session created.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <InterviewDetailPage interviewId={id} />;
}
