/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, b as createAstro, m as maybeRenderHead } from "../chunks/astro/server_--IucAXg.mjs";
import { a as $$Layout } from "../chunks/InternalUIComponentRenderer_CUuo6_kT.mjs";
import { q as queryBuilder } from "../chunks/planetscale_CzKdlEut.mjs";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { U as UserButton } from "../chunks/index_CcfjrFCa.mjs";
import { renderers } from "../renderers.mjs";
const entriesStore = atom([]);
const createEntry = async (message) => {
  await fetch("/api/guestbook", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  });
};
const fetchEntries = () => fetch("/api/guestbook").then((res) => res.json());
const GuestbookForm = () => {
  const [disabled, setDisabled] = useState(false);
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: "bg-black/20 backdrop-blur-md p-2 rounded-lg border border-zinc-800 flex focus-within:ring-2 focus-within:ring-white",
      onSubmit: async (e) => {
        e.preventDefault();
        setDisabled(true);
        const fields = new FormData(e.target);
        const message = fields.get("signature");
        await createEntry(message);
        e.target.reset();
        const entries = await fetchEntries();
        entriesStore.set(entries);
        setDisabled(false);
      },
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "signature",
            required: true,
            disabled,
            placeholder: "Type something to remember you by ...",
            minLength: 3,
            className: "indent-1 text-sm h-full w-full appearance-none bg-transparent outline-none"
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "text-sm appearance-none bg-black/20 backdrop-blur-md py-1 px-3 rounded-lg border border-zinc-800 flex focus-within:ring-2 focus-within:ring-white", children: "Sign" })
      ]
    }
  );
};
const Signatures = () => {
  const $entries = useStore(entriesStore);
  return /* @__PURE__ */ jsx("div", { className: "bg-black/20 backdrop-blur-md p-5 rounded-lg border border-zinc-800", children: $entries.map((entry) => /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-1 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full text-sm break-words", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-neutral-600 dark:text-neutral-400 mr-1", children: [
      entry.created_by,
      ":"
    ] }),
    entry.message
  ] }) }, entry.id)) });
};
const $$Astro = createAstro();
const $$Guestbook = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Guestbook;
  const handleTruthyString = (value) => {
    {
      return false;
    }
  };
  if (!handleTruthyString()) {
    return new Response(null, {
      status: 307,
      headers: new Headers({
        "x-elef-reason": "flag-guestbook-false",
        Location: "/"
      })
    });
  }
  async function getGuestbook() {
    const data = await queryBuilder.selectFrom("guestbook").select(["id", "message", "created_by"]).orderBy("updatedAt", "desc").limit(100).execute();
    return data;
  }
  let entries;
  let error = false;
  try {
    entries = await getGuestbook();
    if (!Astro2.locals.auth().userId) {
      throw new Error("Requires userid");
    }
  } catch (e) {
    error = true;
    entries = [];
  }
  entriesStore.set(entries);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Guestbook | Pantelis" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="invisible" style="height:0;" id="ssr_data"> ${JSON.stringify(entries)} </div> <main class="w-full flex justify-center lg:pt-10"> <div class="w-full p-5 max-w-lg flex flex-col gap-2"> <div class="flex flex-col"> <a class="text-sm pt-4" href="/">Portfolio</a> <div class="flex flex-row justify-between items-center"> <h1 class="text-4xl font-serif">Guestbook</h1> ${renderComponent($$result2, "UserButton", UserButton, {})} </div> <p class="flex items-center gap-3 gtext-sm leading-8">✍️</p> </div> ${renderComponent($$result2, "GuestbookForm", GuestbookForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/panteliselef/elef/elefcodes/src/components/GuestbookForm", "client:component-export": "GuestbookForm" })} ${error && renderTemplate`<p class="text-neutral-600 dark:text-neutral-400 mr-1 text-center p-4">
We failed to load entries 😩
</p>`} ${renderComponent($$result2, "Signatures", Signatures, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/panteliselef/elef/elefcodes/src/components/Signatures", "client:component-export": "Signatures" })} </div> </main> ` })} `;
}, "/Users/panteliselef/elef/elefcodes/src/pages/guestbook.astro", void 0);
const $$file = "/Users/panteliselef/elef/elefcodes/src/pages/guestbook.astro";
const $$url = "/guestbook";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Guestbook,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
