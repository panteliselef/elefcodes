/* empty css                                        */
import { c as createComponent, r as renderTemplate, a as renderComponent, b as createAstro, m as maybeRenderHead } from "../../chunks/astro/server_--IucAXg.mjs";
import { $ as $$InternalUIComponentRenderer, a as $$Layout } from "../../chunks/InternalUIComponentRenderer_CUuo6_kT.mjs";
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro();
const $$SignIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignIn;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "sign-in" })}`;
}, "/Users/panteliselef/elef/elefcodes/node_modules/.pnpm/@clerk+astro@1.3.2_astro@4.15.6_rollup@4.21.3_typescript@5.6.2__react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@clerk/astro/components/interactive/SignIn.astro", void 0);
const $$ = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign in | Pantelis" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex w-full h-full min-h-screen justify-center items-center p-5"> ${renderComponent($$result2, "SignIn", $$SignIn, { "path": "/sign-in" })} </div> ` })}`;
}, "/Users/panteliselef/elef/elefcodes/src/pages/sign-in/[...index].astro", void 0);
const $$file = "/Users/panteliselef/elef/elefcodes/src/pages/sign-in/[...index].astro";
const $$url = "/sign-in/[...index]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
