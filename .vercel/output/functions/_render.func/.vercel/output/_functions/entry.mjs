import { renderers } from "./renderers.mjs";
import { c as createExports } from "./chunks/entrypoint_Bq1Us_BV.mjs";
import { manifest } from "./manifest_-eQ67i9z.mjs";
import { onRequest } from "./_noop-middleware.mjs";
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/api/guestbook.astro.mjs");
const _page2 = () => import("./pages/guestbook.astro.mjs");
const _page3 = () => import("./pages/sign-in/_---index_.astro.mjs");
const _page4 = () => import("./pages/sign-up/_---index_.astro.mjs");
const _page5 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/.pnpm/astro@4.15.6_rollup@4.21.3_typescript@5.6.2/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/api/guestbook.ts", _page1],
  ["src/pages/guestbook.astro", _page2],
  ["src/pages/sign-in/[...index].astro", _page3],
  ["src/pages/sign-up/[...index].astro", _page4],
  ["src/pages/index.astro", _page5]
]);
const serverIslandMap = /* @__PURE__ */ new Map();
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  middleware: onRequest
});
const _args = {
  "middlewareSecret": "d0e95068-0a5c-4f4a-8c34-e21561e99767",
  "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
