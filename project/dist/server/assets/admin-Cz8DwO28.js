import { U as jsxRuntimeExports, $ as Outlet } from "./worker-entry-CmnI0TLV.js";
import { L as Link } from "./router-CGwxE-ll.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const items = [
  { label: "Overview", path: "/admin", available: true, exact: true },
  { label: "Neural Map", path: "/admin/map", available: true, exact: false },
  { label: "Memory", path: "/admin/memory", available: true, exact: false },
  { label: "Interviews", path: "/admin/interviews", available: true, exact: false },
  { label: "Conflicts", path: "/admin/conflicts", available: true, exact: false }
];
function AdminSubNav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[1400px] items-center gap-1 px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mr-4 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Admin" }),
    items.map((item) => {
      if (!item.available) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-disabled": true,
            title: "Coming in next phase",
            className: "cursor-not-allowed px-3 py-3 text-[13px] text-ink-soft",
            children: item.label
          },
          item.label
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: item.path,
          activeOptions: { exact: item.exact },
          className: "relative px-3 py-3 text-[13px] text-ink-muted transition-colors hover:text-ink",
          activeProps: {
            className: "relative px-3 py-3 text-[13px] text-ink after:absolute after:inset-x-3 after:bottom-[-1px] after:h-[2px] after:bg-[color:var(--accent)]"
          },
          children: item.label
        },
        item.label
      );
    })
  ] }) });
}
function AdminLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSubNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  AdminLayout as component
};
