import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { m as motion } from "./proxy-C33hjfT0.js";
function EmptyZen({ copy = "The AI has no questions for you. The memory is current." }) {
  const [mx, setMx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const fn = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      setMx(x);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative h-[60vh] w-full overflow-hidden rounded-[18px]",
      style: { background: "linear-gradient(180deg, #F4D8C4 0%, #FAF3E6 100%)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute left-0 top-[18%] h-12 w-40 rounded-full bg-white/40 blur-2xl",
            animate: { x: ["-10%", "120%"] },
            transition: { duration: 60, repeat: Infinity, ease: "linear" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute left-0 top-[28%] h-8 w-28 rounded-full bg-white/30 blur-xl",
            animate: { x: ["110%", "-20%"] },
            transition: { duration: 75, repeat: Infinity, ease: "linear" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 1200 400", className: "absolute bottom-0 left-0 w-full", style: { transform: `translateX(${mx * 4}px)` }, preserveAspectRatio: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,400 200,180 380,260 560,160 740,250 940,150 1200,280 1200,400", fill: "#A8B89E", opacity: "0.6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 1200 400", className: "absolute bottom-0 left-0 w-full", style: { transform: `translateX(${mx * 8}px)` }, preserveAspectRatio: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,400 150,260 300,200 480,300 680,210 880,290 1080,220 1200,300 1200,400", fill: "#7C957F", opacity: "0.85" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 1200 400", className: "absolute bottom-0 left-0 w-full", style: { transform: `translateX(${mx * 14}px)` }, preserveAspectRatio: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,400 120,330 280,280 440,340 620,290 820,360 1000,300 1200,360 1200,400", fill: "#4F6B5A" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center italic text-[15px] text-ink-muted", children: copy }) })
      ]
    }
  );
}
export {
  EmptyZen as E
};
