import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSubNav } from "@/components/admin/admin-sub-nav";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Qontext — Admin" },
      { name: "description", content: "Admin cockpit for the company memory." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <>
      <AdminSubNav />
      <Outlet />
    </>
  );
}
