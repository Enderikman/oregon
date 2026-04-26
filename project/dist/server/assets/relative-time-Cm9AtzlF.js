import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { E as relativeTime } from "./router-CGwxE-ll.js";
function RelativeTime({ iso, className }) {
  const [label, setLabel] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setLabel(relativeTime(iso));
    const id = window.setInterval(() => setLabel(relativeTime(iso)), 3e4);
    return () => window.clearInterval(id);
  }, [iso]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, suppressHydrationWarning: true, children: label ?? "—" });
}
export {
  RelativeTime as R
};
