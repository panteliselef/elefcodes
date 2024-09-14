import{$ as d,a as u,b as C,c as P}from"./chunk-THYSZO52.r_jBP9KM.js";function f(e){return!1}var v=e=>typeof atob<"u"&&typeof atob=="function"?atob(e):typeof global<"u"&&global.Buffer?new global.Buffer(e,"base64").toString():e,U=[".lcl.dev",".stg.dev",".lclstage.dev",".stgstage.dev",".dev.lclclerk.com",".stg.lclclerk.com",".accounts.lclclerk.com","accountsstage.dev","accounts.dev"],y="pk_live_",O="pk_test_";function g(e,r={}){if(e=e||"",!e||!K(e)){if(r.fatal)throw new Error("Publishable key not valid.");return null}const t=e.startsWith(y)?"production":"development";let n=v(e.split("_")[2]);return n=n.slice(0,-1),r.proxyUrl?n=r.proxyUrl:t!=="development"&&r.domain&&(n=`clerk.${r.domain}`),{instanceType:t,frontendApi:n}}function K(e){e=e||"";const r=e.startsWith(y)||e.startsWith(O),t=v(e.split("_")[2]||"").endsWith("$");return r&&t}function A(){const e=new Map;return{isDevOrStagingUrl:r=>{if(!r)return!1;const t=typeof r=="string"?r:r.hostname;let n=e.get(t);return n===void 0&&(n=U.some(a=>t.endsWith(a)),e.set(t,n)),n}}}function I(e){return e?x(e)||k(e):!0}function x(e){return/^http(s)?:\/\//.test(e||"")}function k(e){return e.startsWith("/")}function R(e){return e?k(e)?new URL(e,window.location.origin).toString():e:""}function M(e){if(!e)return"";let r;if(e.match(/^(clerk\.)+\w*$/))r=/(clerk\.)*(?=clerk\.)/;else{if(e.match(/\.clerk.accounts/))return e;r=/^(clerk\.)*/gi}return`clerk.${e.replace(r,"")}`}var L=(e,r="5.21.2")=>{if(e)return e;const t=$(r);return t?t==="snapshot"?"5.21.2":t:T(r)},$=e=>{var r;return(r=e.trim().replace(/^v/,"").match(/-(.+?)(\.|$)/))==null?void 0:r[1]},T=e=>e.trim().replace(/^v/,"").split(".")[0],J="loadScript cannot be called when document does not exist",F="loadScript cannot be called without a src";async function N(e="",r){const{async:t,defer:n,beforeLoad:a,crossOrigin:i,nonce:s}=r||{};return new Promise((l,c)=>{e||c(F),(!document||!document.body)&&c(J);const o=document.createElement("script");i&&o.setAttribute("crossorigin",i),o.async=t||!1,o.defer=n||!1,o.addEventListener("load",()=>{o.remove(),l(o)}),o.addEventListener("error",()=>{o.remove(),c()}),o.src=e,o.nonce=s,a?.(o),document.body.appendChild(o)})}var D=Object.freeze({InvalidProxyUrlErrorMessage:"The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})",InvalidPublishableKeyErrorMessage:"The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})",MissingPublishableKeyErrorMessage:"Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",MissingSecretKeyErrorMessage:"Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",MissingClerkProvider:"{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider"});function z({packageName:e,customMessages:r}){let t=e;const n={...D,...r};function a(i,s){if(!s)return`${t}: ${i}`;let l=i;const c=i.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);for(const o of c){const p=(s[o[1]]||"").toString();l=l.replace(`{{${o[1]}}}`,p)}return`${t}: ${l}`}return{setPackageName({packageName:i}){return typeof i=="string"&&(t=i),this},setMessages({customMessages:i}){return Object.assign(n,i||{}),this},throwInvalidPublishableKeyError(i){throw new Error(a(n.InvalidPublishableKeyErrorMessage,i))},throwInvalidProxyUrl(i){throw new Error(a(n.InvalidProxyUrlErrorMessage,i))},throwMissingPublishableKeyError(){throw new Error(a(n.MissingPublishableKeyErrorMessage))},throwMissingSecretKeyError(){throw new Error(a(n.MissingSecretKeyErrorMessage))},throwMissingClerkProviderError(i){throw new Error(a(n.MissingClerkProvider,i))},throw(i){throw new Error(a(i))}}}var h="Clerk: Failed to load Clerk",{isDevOrStagingUrl:V}=A(),w=z({packageName:"@clerk/shared"});function B(e){w.setPackageName({packageName:e})}var j=async e=>{const r=document.querySelector("script[data-clerk-js-script]");if(r)return new Promise((t,n)=>{r.addEventListener("load",()=>{t(r)}),r.addEventListener("error",()=>{n(h)})});if(!e?.publishableKey){w.throwMissingPublishableKeyError();return}return N(W(e),{async:!0,crossOrigin:"anonymous",nonce:e.nonce,beforeLoad:Y(e)}).catch(()=>{throw new Error(h)})},W=e=>{var r,t;const{clerkJSUrl:n,clerkJSVariant:a,clerkJSVersion:i,proxyUrl:s,domain:l,publishableKey:c}=e;if(n)return n;let o="";s&&I(s)?o=R(s).replace(/http(s)?:\/\//,""):l&&!V(((r=g(c))==null?void 0:r.frontendApi)||"")?o=M(l):o=((t=g(c))==null?void 0:t.frontendApi)||"";const p=a?`${a.replace(/\.+$/,"")}.`:"",_=L(i);return`https://${o}/npm/@clerk/clerk-js@${_}/dist/clerk.${p}browser.js`},H=e=>{const r={};return e.publishableKey&&(r["data-clerk-publishable-key"]=e.publishableKey),e.proxyUrl&&(r["data-clerk-proxy-url"]=e.proxyUrl),e.domain&&(r["data-clerk-domain"]=e.domain),e.nonce&&(r.nonce=e.nonce),r},Y=e=>r=>{const t=H(e);for(const n in t)r.setAttribute(n,t[n])},S=()=>{["handleRedirectCallback"].forEach(r=>{document.querySelectorAll(`[data-clerk-function-id^="clerk-${r}"]`).forEach(n=>{const a=n.getAttribute("data-clerk-function-id"),i=window.__astro_clerk_function_props?.get(r)?.get(a)??{};d.get()?.[r]?.(i)})})},E=()=>{Object.entries({"organization-list":"mountOrganizationList","organization-profile":"mountOrganizationProfile","organization-switcher":"mountOrganizationSwitcher","user-button":"mountUserButton","user-profile":"mountUserProfile","sign-in":"mountSignIn","sign-up":"mountSignUp","google-one-tap":"openGoogleOneTap"}).forEach(([r,t])=>{document.querySelectorAll(`[data-clerk-id^="clerk-${r}"]`).forEach(a=>{const i=a.getAttribute("data-clerk-id"),s=window.__astro_clerk_component_props?.get(r)?.get(i);a&&d.get()?.[t](a,s)})})},q=e=>{let r=!1;return t=>{if(r){const n=window.Clerk;return new Promise(a=>n?(n.loaded&&(E(),S()),a(n.loaded)):a(!1))}return r=!0,e(t)}},m;B("@clerk/astro");function b(e){return(r,t)=>{t?.__internal_metadata?.navigationType==="internal"?e(history.state,"",r):t?.windowNavigate(r)}}var G=q(X);async function X(e){let r=window.Clerk;if(!r){if(await j(e),!window.Clerk)throw new Error("Failed to download latest ClerkJS. Contact support@clerk.com.");r=window.Clerk}return d.get()||d.set(r),m={...e,routerPush:b(window.history.pushState.bind(window.history)),routerReplace:b(window.history.replaceState.bind(window.history))},r.load(m).then(()=>{u.setKey("isLoaded",!0),C.notify(),E(),S(),r.addListener(t=>{u.setKey("client",t.client),u.setKey("user",t.user),u.setKey("session",t.session),u.setKey("organization",t.organization)})}).catch(()=>{})}var Z=e=>{const{signInUrl:r,signUpUrl:t,isSatellite:n,proxyUrl:a,domain:i,publishableKey:s,telemetry:l,...c}=e||{};return{signInUrl:r||"/sign-in",signUpUrl:t||"/sign-up",isSatellite:n||void 0,proxyUrl:a||void 0,domain:i||void 0,publishableKey:s||void 0||"",telemetry:l||{disabled:f(),debug:f()},...c}};function Q(e){async function r(t){const n=document.getElementById("__CLERK_ASTRO_DATA__");n&&P.set(JSON.parse(n.textContent||"{}"));const a=document.getElementById("__CLERK_ASTRO_SAFE_VARS__");let i={};a&&(i=JSON.parse(a.textContent||"{}")),await e(Z({...t,...i}))}return r}var re=Q(G);export{re as r};
