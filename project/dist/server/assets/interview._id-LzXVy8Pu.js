import { U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { L as Link } from "./router-CGwxE-ll.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const SplitErrorComponent = ({
  error,
  reset
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl text-ink", children: "Interview unavailable" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-ink-muted", children: error.message }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "rounded-full px-4 py-2 text-sm", style: {
      backgroundColor: "var(--accent)",
      color: "white"
    }, children: "Retry" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-full border border-border px-4 py-2 text-sm text-ink", children: "Back to cockpit" })
  ] })
] }) });
export {
  SplitErrorComponent as errorComponent
};
