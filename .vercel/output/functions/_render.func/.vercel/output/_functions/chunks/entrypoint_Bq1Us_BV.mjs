import { R as ROUTE_TYPE_HEADER, l as REROUTE_DIRECTIVE_HEADER, n as bold, o as red, y as yellow, p as dim, q as blue, t as decryptString, v as createSlotValueFromString, r as renderTemplate, a as renderComponent, D as DEFAULT_404_COMPONENT, w as renderSlotToString, x as renderJSX, z as chunkToString, A as isRenderInstruction, B as clientLocalsSymbol, C as clientAddressSymbol$1, E as ASTRO_VERSION, G as responseSentSymbol$1, H as renderPage, I as REWRITE_DIRECTIVE_HEADER_KEY, J as REWRITE_DIRECTIVE_HEADER_VALUE, K as renderEndpoint, L as REROUTABLE_STATUS_CODES, M as commonjsGlobal } from "./astro/server_--IucAXg.mjs";
import { A as AstroError, q as i18nNoLocaleFoundInPath, s as appendForwardSlash, t as joinPaths, R as ResponseSentError, u as MiddlewareNoDataOrNextCalled, v as MiddlewareNotAResponse, G as GetStaticPathsRequired, w as InvalidGetStaticPathsReturn, x as InvalidGetStaticPathsEntry, y as GetStaticPathsExpectedParams, z as GetStaticPathsInvalidRouteParam, B as trimSlashes, P as PageNumberParamNotFound, C as NoMatchingStaticPathFound, H as PrerenderDynamicEndpointPathCollide, J as ReservedSlotName, L as LocalsNotAnObject, K as PrerenderClientAddressNotAvailable, Q as ClientAddressNotAvailable, S as StaticClientAddressNotAvailable, T as RewriteWithBodyUsed, U as AstroResponseHeadersReassigned, V as fileExtension, W as slash$1, X as prependForwardSlash, Y as removeTrailingForwardSlash } from "./astro/assets-service_DtP0uv27.mjs";
import { g as getActionQueryString, d as deserializeActionResult, e as ensure404Route, a as default404Instance, D as DEFAULT_404_ROUTE } from "./astro-designed-error-pages_CW_kdgpP.mjs";
import require$$1 from "os";
import require$$0 from "path";
import require$$0$1 from "util";
import require$$0$2 from "stream";
import require$$0$4 from "events";
import require$$0$3 from "fs";
import nodePath from "node:path";
import buffer from "node:buffer";
import crypto$1 from "node:crypto";
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}
function createI18nMiddleware(i18n, base, trailingSlash, format) {
  if (!i18n) return (_, next) => next();
  const payload = {
    ...i18n,
    trailingSlash,
    base,
    format,
    domains: {}
  };
  const _redirectToDefaultLocale = redirectToDefaultLocale(payload);
  const _noFoundForNonLocaleRoute = notFound(payload);
  const _requestHasLocale = requestHasLocale(payload.locales);
  const _redirectToFallback = redirectToFallback(payload);
  const prefixAlways = (context) => {
    const url = context.url;
    if (url.pathname === base + "/" || url.pathname === base) {
      return _redirectToDefaultLocale(context);
    } else if (!_requestHasLocale(context)) {
      return _noFoundForNonLocaleRoute(context);
    }
    return void 0;
  };
  const prefixOtherLocales = (context, response) => {
    let pathnameContainsDefaultLocale = false;
    const url = context.url;
    for (const segment of url.pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(i18n.defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = url.pathname.replace(`/${i18n.defaultLocale}`, "");
      response.headers.set("Location", newLocation);
      return _noFoundForNonLocaleRoute(context);
    }
    return void 0;
  };
  return async (context, next) => {
    const response = await next();
    const type = response.headers.get(ROUTE_TYPE_HEADER);
    if (type !== "page" && type !== "fallback") {
      return response;
    }
    if (requestIs404Or500(context.request, base)) {
      return response;
    }
    const { currentLocale } = context;
    switch (i18n.strategy) {
      case "manual": {
        return response;
      }
      case "domains-prefix-other-locales": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixOtherLocales(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-other-locales": {
        const result = prefixOtherLocales(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always-no-redirect": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = _noFoundForNonLocaleRoute(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-always-no-redirect": {
        const result = _noFoundForNonLocaleRoute(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "pathname-prefix-always": {
        const result = prefixAlways(context);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixAlways(context);
          if (result) {
            return result;
          }
        }
        break;
      }
    }
    return _redirectToFallback(context, response);
  };
}
function localeHasntDomain(i18n, currentLocale) {
  for (const domainLocale of Object.values(i18n.domainLookupTable)) {
    if (domainLocale === currentLocale) {
      return false;
    }
  }
  return true;
}
function requestHasLocale(locales) {
  return function(context) {
    return pathHasLocale(context.url.pathname, locales);
  };
}
function requestIs404Or500(request, base = "") {
  const url = new URL(request.url);
  return url.pathname.startsWith(`${base}/404`) || url.pathname.startsWith(`${base}/500`);
}
function pathHasLocale(path2, locales) {
  const segments = path2.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function toCodes(locales) {
  return locales.map((loopLocale) => {
    if (typeof loopLocale === "string") {
      return loopLocale;
    } else {
      return loopLocale.codes[0];
    }
  });
}
function redirectToDefaultLocale({
  trailingSlash,
  format,
  base,
  defaultLocale
}) {
  return function(context, statusCode) {
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return context.redirect(`${appendForwardSlash(joinPaths(base, defaultLocale))}`, statusCode);
    } else {
      return context.redirect(`${joinPaths(base, defaultLocale)}`, statusCode);
    }
  };
}
function notFound({ base, locales }) {
  return function(context, response) {
    if (response?.headers.get(REROUTE_DIRECTIVE_HEADER) === "no") return response;
    const url = context.url;
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathHasLocale(url.pathname, locales))) {
      if (response) {
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        return new Response(response.body, {
          status: 404,
          headers: response.headers
        });
      } else {
        return new Response(null, {
          status: 404,
          headers: {
            [REROUTE_DIRECTIVE_HEADER]: "no"
          }
        });
      }
    }
    return void 0;
  };
}
function redirectToFallback({
  fallback,
  locales,
  defaultLocale,
  strategy,
  base,
  fallbackType
}) {
  return async function(context, response) {
    if (response.status >= 300 && fallback) {
      const fallbackKeys = fallback ? Object.keys(fallback) : [];
      const segments = context.url.pathname.split("/");
      const urlLocale = segments.find((segment) => {
        for (const locale of locales) {
          if (typeof locale === "string") {
            if (locale === segment) {
              return true;
            }
          } else if (locale.path === segment) {
            return true;
          }
        }
        return false;
      });
      if (urlLocale && fallbackKeys.includes(urlLocale)) {
        const fallbackLocale = fallback[urlLocale];
        const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
        let newPathname;
        if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
          if (context.url.pathname.includes(`${base}`)) {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, ``);
          } else {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, `/`);
          }
        } else {
          newPathname = context.url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
        }
        if (fallbackType === "rewrite") {
          return await context.rewrite(newPathname);
        } else {
          return context.redirect(newPathname);
        }
      }
    }
    return response;
  };
}
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var parse_1$2 = parse$4;
var serialize_1 = serialize;
var __toString = Object.prototype.toString;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse$4(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;
  var index = 0;
  while (index < str.length) {
    var eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    var endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    var key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      var val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name + "=" + value;
  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    var expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  if (opt.priority) {
    var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}
function isDate(val) {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = Symbol.for("astro.responseSent");
class AstroCookie {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize_1(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = this.#ensureParsed(options);
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed(options);
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize_1(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Behaves the same as AstroCookies.prototype.headers(),
   * but allows a warning when cookies are set after the instance is consumed.
   */
  static consume(cookies) {
    cookies.#consumed = true;
    return cookies.headers();
  }
  #ensureParsed(options = void 0) {
    if (!this.#requestValues) {
      this.#parse(options);
    }
    if (!this.#requestValues) {
      this.#requestValues = {};
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse(options = void 0) {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse_1$2(raw, options);
  }
}
const astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error$1(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error$1(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error$1(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}
const consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.log;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    const action = baseAction.bind(context);
    return action(input);
  };
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = toCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentLocale.path;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales.map((locale) => {
        if (typeof locale === "string") {
          return locale;
        } else {
          return locale.codes.at(0);
        }
      });
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(loopLocale.path);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales) {
  for (const segment of pathname.split("/")) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
}
function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async (payload) => {
        if (i < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request);
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request
              );
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.cookies = new AstroCookies(newRequest);
          }
          return applyHandle(i + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
  });
}
function defineMiddleware(fn) {
  return fn;
}
async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  let middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
  const headers = { location: encodeURI(redirectRouteGenerate(renderContext)) };
  return new Response(null, { status, headers });
}
function redirectRouteGenerate(renderContext) {
  const {
    params,
    routeData: { redirect, redirectRoute }
  } = renderContext;
  if (typeof redirectRoute !== "undefined") {
    return redirectRoute?.generate(params) || redirectRoute?.pathname || "/";
  } else if (typeof redirect === "string") {
    let target = redirect;
    for (const param of Object.keys(params)) {
      const paramValue = params[param];
      target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
    }
    return target;
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
const VALID_PARAM_TYPES = ["string", "number", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return route.generate(validatedParams);
}
function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start2 = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start2 + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = correctIndexRoute(routeMatch.generate({ ...params }));
      const next = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(pageNum + 1) }));
      const prev = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        })
      );
      const first = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: includesFirstPageNumber ? "1" : void 0
        })
      );
      const last = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(lastPage) }));
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start2, end),
            start: start2,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev, first, last }
          }
        }
      };
    });
    return result;
  };
}
function correctIndexRoute(route) {
  if (route === "") {
    return "/";
  }
  return route;
}
async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry2 = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry2 });
    return entry2;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route)
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
class RouteCache {
  logger;
  cache = {};
  mode;
  constructor(logger, mode = "production") {
    this.logger = logger;
    this.mode = mode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry2) {
    const key = this.key(route);
    if (this.mode === "production" && this.cache[key]?.staticPaths) {
      this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
    }
    this.cache[key] = entry2;
  }
  get(route) {
    return this.cache[this.key(route)];
  }
  key(route) {
    return `${route.route}_${route.component}`;
  }
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}
const SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
const SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function getServerIslandRouteData(config) {
  const segments = [
    [{ content: "_server-islands", dynamic: false, spread: false }],
    [{ content: "name", dynamic: true, spread: false }]
  ];
  const route = {
    type: "page",
    component: SERVER_ISLAND_COMPONENT,
    generate: () => "",
    params: ["name"],
    segments,
    pattern: getPattern(segments, config.base, config.trailingSlash),
    prerender: false,
    isIndex: false,
    fallbackRoutes: [],
    route: SERVER_ISLAND_ROUTE
  };
  return route;
}
function ensureServerIslandRoute(config, routeManifest) {
  if (routeManifest.routes.some((route) => route.route === "/_server-islands/[name]")) {
    return;
  }
  routeManifest.routes.push(getServerIslandRouteData(config));
}
function createEndpoint(manifest) {
  const page = async (result) => {
    const params = result.params;
    const request = result.request;
    const raw = await request.text();
    const data = JSON.parse(raw);
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const imp = manifest.serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest.key;
    const encryptedProps = data.encryptedProps;
    const propString = await decryptString(key, encryptedProps);
    const props = JSON.parse(propString);
    const componentModule = await imp();
    const Component = componentModule[data.componentExport];
    const slots = {};
    for (const prop in data.slots) {
      slots[prop] = createSlotValueFromString(data.slots[prop]);
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}
function injectDefaultRoutes(ssrManifest, routeManifest) {
  ensure404Route(routeManifest);
  ensureServerIslandRoute(ssrManifest, routeManifest);
  return routeManifest;
}
function createDefaultRoutes(manifest) {
  const root = new URL(manifest.hrefRoot);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
class Pipeline {
  constructor(logger, manifest, mode, renderers, resolve, serverLike, streaming, adapterName = manifest.adapterName, clientDirectives = manifest.clientDirectives, inlinedScripts = manifest.inlinedScripts, compressHTML = manifest.compressHTML, i18n = manifest.i18n, middleware = manifest.middleware, routeCache = new RouteCache(logger, mode), site = manifest.site ? new URL(manifest.site) : void 0, callSetGetEnv = true, defaultRoutes = createDefaultRoutes(manifest)) {
    this.logger = logger;
    this.manifest = manifest;
    this.mode = mode;
    this.renderers = renderers;
    this.resolve = resolve;
    this.serverLike = serverLike;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.callSetGetEnv = callSetGetEnv;
    this.defaultRoutes = defaultRoutes;
    this.internalMiddleware = [];
    if (i18n?.strategy !== "manual") {
      this.internalMiddleware.push(
        createI18nMiddleware(i18n, manifest.base, manifest.trailingSlash, manifest.buildFormat)
      );
    }
    if (callSetGetEnv && manifest.experimentalEnvGetSecretEnabled) ;
  }
  internalMiddleware;
}
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next(),
  renderers: []
};
async function getProps(opts) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike } = opts;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const params = getParams(route, pathname);
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr: serverLike
  });
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(decodeURIComponent(pathname));
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false);
  if (expressions?.length !== 1) return;
  return expressions[0];
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}
class RenderContext {
  constructor(pipeline, locals, middleware, pathname, request, routeData, status, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = new URL(request.url), props = {}) {
    this.pipeline = pipeline;
    this.locals = locals;
    this.middleware = middleware;
    this.pathname = pathname;
    this.request = request;
    this.routeData = routeData;
    this.status = status;
    this.cookies = cookies;
    this.params = params;
    this.url = url;
    this.props = props;
    this.originalRoute = routeData;
  }
  // The first route that this instance of the context attempts to render
  originalRoute;
  /**
   * A flag that tells the render content if the rewriting was triggered
   */
  isRewriting = false;
  /**
   * A safety net in case of loops
   */
  counter = 0;
  static create({
    locals = {},
    middleware,
    pathname,
    pipeline,
    request,
    routeData,
    status = 200,
    props
  }) {
    return new RenderContext(
      pipeline,
      locals,
      sequence(...pipeline.internalMiddleware, middleware ?? pipeline.middleware),
      pathname,
      request,
      routeData,
      status,
      void 0,
      void 0,
      void 0,
      props
    );
  }
  /**
   * The main function of the RenderContext.
   *
   * Use this function to render any route known to Astro.
   * It attempts to render a route. A route can be a:
   *
   * - page
   * - redirect
   * - endpoint
   * - fallback
   */
  async render(componentInstance, slots = {}) {
    const { cookies, middleware, pipeline } = this;
    const { logger, serverLike, streaming } = pipeline;
    const isPrerendered = !serverLike || this.routeData.prerender;
    const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
      mod: componentInstance,
      routeData: this.routeData,
      routeCache: this.pipeline.routeCache,
      pathname: this.pathname,
      logger,
      serverLike
    });
    const apiContext = this.createAPIContext(props, isPrerendered);
    this.counter++;
    if (this.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const lastNext = async (ctx, payload) => {
      if (payload) {
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const { routeData, componentInstance: newComponent } = await pipeline.tryRewrite(
          payload,
          this.request,
          this.originalRoute
        );
        this.routeData = routeData;
        componentInstance = newComponent;
        this.isRewriting = true;
        this.status = 200;
      }
      let response2;
      switch (this.routeData.type) {
        case "endpoint": {
          response2 = await renderEndpoint(componentInstance, ctx, serverLike, logger);
          break;
        }
        case "redirect":
          return renderRedirect(this);
        case "page": {
          const result = await this.createResult(componentInstance);
          try {
            response2 = await renderPage(
              result,
              componentInstance?.default,
              props,
              slots,
              streaming,
              this.routeData
            );
          } catch (e) {
            result.cancelled = true;
            throw e;
          }
          response2.headers.set(ROUTE_TYPE_HEADER, "page");
          if (this.routeData.route === "/404" || this.routeData.route === "/500") {
            response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          }
          if (this.isRewriting) {
            response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
          }
          break;
        }
        case "fallback": {
          return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
        }
      }
      const responseCookies = getCookiesFromResponse(response2);
      if (responseCookies) {
        cookies.merge(responseCookies);
      }
      return response2;
    };
    const response = await callMiddleware(middleware, apiContext, lastNext);
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, cookies);
    return response;
  }
  createAPIContext(props, isPrerendered) {
    const context = this.createActionAPIContext();
    const redirect = (path2, status = 302) => new Response(null, { status, headers: { Location: path2 } });
    return Object.assign(context, {
      props,
      redirect,
      getActionResult: createGetActionResult(context.locals),
      callAction: createCallAction(context),
      // Used internally by Actions middleware.
      // TODO: discuss exposing this information from APIContext.
      // middleware runs on prerendered routes in the dev server,
      // so this is useful information to have.
      _isPrerendered: isPrerendered
    });
  }
  async #executeRewrite(reroutePayload) {
    this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
    const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
      reroutePayload,
      this.request,
      this.originalRoute
    );
    this.routeData = routeData;
    if (reroutePayload instanceof Request) {
      this.request = reroutePayload;
    } else {
      this.request = this.#copyRequest(newUrl, this.request);
    }
    this.url = new URL(this.request.url);
    this.cookies = new AstroCookies(this.request);
    this.params = getParams(routeData, pathname);
    this.pathname = pathname;
    this.isRewriting = true;
    this.status = 200;
    return await this.render(componentInstance);
  }
  createActionAPIContext() {
    const renderContext = this;
    const { cookies, params, pipeline, url } = this;
    const generator = `Astro v${ASTRO_VERSION}`;
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    return {
      cookies,
      get clientAddress() {
        return renderContext.clientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      generator,
      get locals() {
        return renderContext.locals;
      },
      // TODO(breaking): disallow replacing the locals object
      set locals(val) {
        if (typeof val !== "object") {
          throw new AstroError(LocalsNotAnObject);
        } else {
          renderContext.locals = val;
          Reflect.set(this.request, clientLocalsSymbol, val);
        }
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      rewrite,
      request: this.request,
      site: pipeline.site,
      url
    };
  }
  async createResult(mod) {
    const { cookies, pathname, pipeline, routeData, status } = this;
    const { clientDirectives, inlinedScripts, compressHTML, manifest, renderers, resolve } = pipeline;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial2 = Boolean(mod.partial);
    const response = {
      status,
      statusText: "OK",
      get headers() {
        return headers;
      },
      // Disallow `Astro.response.headers = new Headers`
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const result = {
      base: manifest.base,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies,
      /** This function returns the `Astro` faux-global */
      createAstro: (astroGlobal, props, slots) => this.createAstro(result, astroGlobal, props, slots),
      links,
      params: this.params,
      partial: partial2,
      pathname,
      renderers,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      serverIslandNameMap: manifest.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
      key: manifest.key,
      trailingSlash: manifest.trailingSlash,
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        headInTree: false,
        extraHead: [],
        propagators: /* @__PURE__ */ new Set()
      }
    };
    return result;
  }
  #astroPagePartial;
  /**
   * The Astro global is sourced in 3 different phases:
   * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
   * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
   * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
   *
   * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
   */
  createAstro(result, astroStaticPartial, props, slotValues) {
    let astroPagePartial;
    if (this.isRewriting) {
      astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(
        result,
        astroStaticPartial
      );
    } else {
      astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(
        result,
        astroStaticPartial
      );
    }
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  createAstroPagePartial(result, astroStaticPartial) {
    const renderContext = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path2, status = 302) => {
      if (this.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path2 } });
    };
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    return {
      generator: astroStaticPartial.generator,
      glob: astroStaticPartial.glob,
      cookies,
      get clientAddress() {
        return renderContext.clientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return createCallAction(this);
      },
      url
    };
  }
  clientAddress() {
    const { pipeline, request } = this;
    if (clientAddressSymbol$1 in request) {
      return Reflect.get(request, clientAddressSymbol$1);
    }
    if (pipeline.serverLike) {
      if (request.body === null) {
        throw new AstroError(PrerenderClientAddressNotAvailable);
      }
      if (pipeline.adapterName) {
        throw new AstroError({
          ...ClientAddressNotAvailable,
          message: ClientAddressNotAvailable.message(pipeline.adapterName)
        });
      }
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  /**
   * API Context may be created multiple times per request, i18n data needs to be computed only once.
   * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
   */
  #currentLocale;
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    return this.#currentLocale ??= computeCurrentLocale(routeData.route, locales) ?? computeCurrentLocale(url.pathname, locales) ?? fallbackTo;
  }
  #preferredLocale;
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  #preferredLocaleList;
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
  /**
   * Utility function that creates a new `Request` with a new URL from an old `Request`.
   *
   * @param newUrl The new `URL`
   * @param oldRequest The old `Request`
   */
  #copyRequest(newUrl, oldRequest) {
    if (oldRequest.bodyUsed) {
      throw new AstroError(RewriteWithBodyUsed);
    }
    return new Request(newUrl, {
      method: oldRequest.method,
      headers: oldRequest.headers,
      body: oldRequest.body,
      referrer: oldRequest.referrer,
      referrerPolicy: oldRequest.referrerPolicy,
      mode: oldRequest.mode,
      credentials: oldRequest.credentials,
      cache: oldRequest.cache,
      redirect: oldRequest.redirect,
      integrity: oldRequest.integrity,
      signal: oldRequest.signal,
      keepalive: oldRequest.keepalive,
      // https://fetch.spec.whatwg.org/#dom-request-duplex
      // @ts-expect-error It isn't part of the types, but undici accepts it and it allows to carry over the body to a new request
      duplex: "half"
    });
  }
}
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  if (!assetsPrefix) return "";
  if (typeof assetsPrefix === "string") return assetsPrefix;
  const dotLessFileExtension = fileExtension2.slice(1);
  if (assetsPrefix[dotLessFileExtension]) {
    return assetsPrefix[dotLessFileExtension];
  }
  return assetsPrefix.fallback;
}
function createAssetLink(href, base, assetsPrefix) {
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(href), assetsPrefix);
    return joinPaths(pf, slash$1(href));
  } else if (base) {
    return prependForwardSlash(joinPaths(base, slash$1(href)));
  } else {
    return href;
  }
}
function createStylesheetElement(stylesheet, base, assetsPrefix) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix) {
  return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix)));
}
function createModuleScriptElement(script, base, assetsPrefix) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
function matchRoute(pathname, manifest) {
  const decodedPathname = decodeURI(pathname);
  return manifest.routes.find((route) => {
    return route.pattern.test(decodedPathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(decodedPathname));
  });
}
const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url } = context;
    const contentType = request.headers.get("content-type");
    if (contentType) {
      if (FORM_CONTENT_TYPES.includes(contentType.toLowerCase())) {
        const forbidden = (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request.headers.get("origin") !== url.origin;
        if (forbidden) {
          return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
            status: 403
          });
        }
      }
    }
    return next();
  });
}
function findRouteToRewrite({
  payload,
  routes,
  request,
  trailingSlash,
  buildFormat,
  base
}) {
  let newUrl = void 0;
  if (payload instanceof URL) {
    newUrl = payload;
  } else if (payload instanceof Request) {
    newUrl = new URL(payload.url);
  } else {
    newUrl = new URL(payload, new URL(request.url).origin);
  }
  let pathname = newUrl.pathname;
  if (base !== "/" && newUrl.pathname.startsWith(base)) {
    pathname = shouldAppendForwardSlash(trailingSlash, buildFormat) ? appendForwardSlash(newUrl.pathname) : removeTrailingForwardSlash(newUrl.pathname);
    pathname = pathname.slice(base.length);
  }
  let foundRoute;
  for (const route of routes) {
    if (route.pattern.test(decodeURI(pathname))) {
      foundRoute = route;
      break;
    }
  }
  if (foundRoute) {
    return {
      routeData: foundRoute,
      newUrl,
      pathname
    };
  } else {
    const custom404 = routes.find((route) => route.route === "/404");
    if (custom404) {
      return { routeData: custom404, newUrl, pathname };
    } else {
      return { routeData: DEFAULT_404_ROUTE, newUrl, pathname };
    }
  }
}
class AppPipeline extends Pipeline {
  #manifestData;
  static create(manifestData, {
    logger,
    manifest,
    mode,
    renderers,
    resolve,
    serverLike,
    streaming,
    defaultRoutes
  }) {
    const pipeline = new AppPipeline(
      logger,
      manifest,
      mode,
      renderers,
      resolve,
      serverLike,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      false,
      defaultRoutes
    );
    pipeline.#manifestData = manifestData;
    return pipeline;
  }
  headElements(routeData) {
    const routeInfo = this.manifest.routes.find((route) => route.routeData === routeData);
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? []);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async tryRewrite(payload, request, _sourceRoute) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r) => r.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance),
          renderers: []
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
}
class App {
  #manifest;
  #manifestData;
  #logger = new Logger({
    dest: consoleLogDestination,
    level: "info"
  });
  #baseWithoutTrailingSlash;
  #pipeline;
  #adapterLogger;
  #renderOptionsDeprecationWarningShown = false;
  constructor(manifest, streaming = true) {
    this.#manifest = manifest;
    this.#manifestData = injectDefaultRoutes(manifest, {
      routes: manifest.routes.map((route) => route.routeData)
    });
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#manifest.base);
    this.#pipeline = this.#createPipeline(this.#manifestData, streaming);
    this.#adapterLogger = new AstroIntegrationLogger(
      this.#logger.options,
      this.#manifest.adapterName
    );
  }
  getAdapterLogger() {
    return this.#adapterLogger;
  }
  /**
   * Creates a pipeline by reading the stored manifest
   *
   * @param manifestData
   * @param streaming
   * @private
   */
  #createPipeline(manifestData, streaming = false) {
    if (this.#manifest.checkOrigin) {
      this.#manifest.middleware = sequence(
        createOriginCheckMiddleware(),
        this.#manifest.middleware
      );
    }
    return AppPipeline.create(manifestData, {
      logger: this.#logger,
      manifest: this.#manifest,
      mode: "production",
      renderers: this.#manifest.renderers,
      defaultRoutes: createDefaultRoutes(this.#manifest),
      resolve: async (specifier) => {
        if (!(specifier in this.#manifest.entryModules)) {
          throw new Error(`Unable to resolve [${specifier}]`);
        }
        const bundlePath = this.#manifest.entryModules[specifier];
        switch (true) {
          case bundlePath.startsWith("data:"):
          case bundlePath.length === 0: {
            return bundlePath;
          }
          default: {
            return createAssetLink(bundlePath, this.#manifest.base, this.#manifest.assetsPrefix);
          }
        }
      },
      serverLike: true,
      streaming
    });
  }
  set setManifestData(newManifestData) {
    this.#manifestData = newManifestData;
  }
  removeBase(pathname) {
    if (pathname.startsWith(this.#manifest.base)) {
      return pathname.slice(this.#baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  #getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    return pathname;
  }
  match(request) {
    const url = new URL(request.url);
    if (this.#manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.#computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    let routeData = matchRoute(pathname, this.#manifestData);
    if (!routeData || routeData.prerender) return void 0;
    return routeData;
  }
  #computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.#manifest.i18n && (this.#manifest.i18n.strategy === "domains-prefix-always" || this.#manifest.i18n.strategy === "domains-prefix-other-locales" || this.#manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.#manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e) {
          this.#logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.#logger.error("router", `Error: ${e}`);
        }
      }
    }
    return pathname;
  }
  async render(request, routeDataOrOptions, maybeLocals) {
    let routeData;
    let locals;
    let clientAddress;
    let addCookieHeader;
    if (routeDataOrOptions && ("addCookieHeader" in routeDataOrOptions || "clientAddress" in routeDataOrOptions || "locals" in routeDataOrOptions || "routeData" in routeDataOrOptions)) {
      if ("addCookieHeader" in routeDataOrOptions) {
        addCookieHeader = routeDataOrOptions.addCookieHeader;
      }
      if ("clientAddress" in routeDataOrOptions) {
        clientAddress = routeDataOrOptions.clientAddress;
      }
      if ("routeData" in routeDataOrOptions) {
        routeData = routeDataOrOptions.routeData;
      }
      if ("locals" in routeDataOrOptions) {
        locals = routeDataOrOptions.locals;
      }
    } else {
      routeData = routeDataOrOptions;
      locals = maybeLocals;
      if (routeDataOrOptions || locals) {
        this.#logRenderOptionsDeprecationWarning();
      }
    }
    if (routeData) {
      this.#logger.debug(
        "router",
        "The adapter " + this.#manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.#logger.debug("router", "RouteData:\n" + routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        this.#logger.error(null, error2.stack);
        return this.#renderError(request, { status: 500, error: error2 });
      }
      Reflect.set(request, clientLocalsSymbol, locals);
    }
    if (clientAddress) {
      Reflect.set(request, clientAddressSymbol$1, clientAddress);
    }
    if (!routeData) {
      routeData = this.match(request);
      this.#logger.debug("router", "Astro matched the following route for " + request.url);
      this.#logger.debug("router", "RouteData:\n" + routeData);
    }
    if (!routeData) {
      this.#logger.debug("router", "Astro hasn't found routes that match " + request.url);
      this.#logger.debug("router", "Here's the available routes:\n", this.#manifestData);
      return this.#renderError(request, { locals, status: 404 });
    }
    const pathname = this.#getPathnameFromRequest(request);
    const defaultStatus = this.#getDefaultStatusCode(routeData, pathname);
    let response;
    try {
      const mod = await this.#pipeline.getModuleForRoute(routeData);
      const renderContext = RenderContext.create({
        pipeline: this.#pipeline,
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus
      });
      response = await renderContext.render(await mod.page());
    } catch (err) {
      this.#logger.error(null, err.stack || err.message || String(err));
      return this.#renderError(request, { locals, status: 500, error: err });
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#renderError(request, {
        locals,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0
      });
    }
    if (response.headers.has(REROUTE_DIRECTIVE_HEADER)) {
      response.headers.delete(REROUTE_DIRECTIVE_HEADER);
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of App.getSetCookieFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol$1, true);
    return response;
  }
  #logRenderOptionsDeprecationWarning() {
    if (this.#renderOptionsDeprecationWarningShown) return;
    this.#logger.warn(
      "deprecated",
      `The adapter ${this.#manifest.adapterName} is using a deprecated signature of the 'app.render()' method. From Astro 4.0, locals and routeData are provided as properties on an optional object to this method. Using the old signature will cause an error in Astro 5.0. See https://github.com/withastro/astro/pull/9199 for more information.`
    );
    this.#renderOptionsDeprecationWarningShown = true;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes
   */
  async #renderError(request, {
    locals,
    status,
    response: originalResponse,
    skipMiddleware = false,
    error: error2
  }) {
    const errorRoutePath = `/${status}${this.#manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, this.#manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(
          `${this.#baseWithoutTrailingSlash}/${status}${maybeDotHtml}`,
          url
        );
        if (statusURL.toString() !== request.url) {
          const response2 = await fetch(statusURL.toString());
          const override = { status };
          return this.#mergeResponses(response2, originalResponse, override);
        }
      }
      const mod = await this.#pipeline.getModuleForRoute(errorRouteData);
      try {
        const renderContext = RenderContext.create({
          locals,
          pipeline: this.#pipeline,
          middleware: skipMiddleware ? (_, next) => next() : void 0,
          pathname: this.#getPathnameFromRequest(request),
          request,
          routeData: errorRouteData,
          status,
          props: { error: error2 }
        });
        const response2 = await renderContext.render(await mod.page());
        return this.#mergeResponses(response2, originalResponse);
      } catch {
        if (skipMiddleware === false) {
          return this.#renderError(request, {
            locals,
            status,
            response: originalResponse,
            skipMiddleware: true
          });
        }
      }
    }
    const response = this.#mergeResponses(new Response(null, { status }), originalResponse);
    Reflect.set(response, responseSentSymbol$1, true);
    return response;
  }
  #mergeResponses(newResponse, originalResponse, override) {
    if (!originalResponse) {
      if (override !== void 0) {
        return new Response(newResponse.body, {
          status: override.status,
          statusText: newResponse.statusText,
          headers: newResponse.headers
        });
      }
      return newResponse;
    }
    const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
    try {
      originalResponse.headers.delete("Content-type");
    } catch {
    }
    return new Response(newResponse.body, {
      status,
      statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
      // If you're looking at here for possible bugs, it means that it's not a bug.
      // With the middleware, users can meddle with headers, and we should pass to the 404/500.
      // If users see something weird, it's because they are setting some headers they should not.
      //
      // Although, we don't want it to replace the content-type, because the error page must return `text/html`
      headers: new Headers([
        ...Array.from(newResponse.headers),
        ...Array.from(originalResponse.headers)
      ])
    });
  }
  #getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
}
const createOutgoingHttpHeaders = (headers) => {
  if (!headers) {
    return void 0;
  }
  const nodeHeaders = Object.fromEntries(headers.entries());
  if (Object.keys(nodeHeaders).length === 0) {
    return void 0;
  }
  if (headers.has("set-cookie")) {
    const cookieHeaders = headers.getSetCookie();
    if (cookieHeaders.length > 1) {
      nodeHeaders["set-cookie"] = cookieHeaders;
    }
  }
  return nodeHeaders;
};
function apply() {
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, "crypto", {
      value: crypto$1.webcrypto
    });
  }
  if (!globalThis.File) {
    Object.defineProperty(globalThis, "File", {
      value: buffer.File
    });
  }
}
const clientAddressSymbol = Symbol.for("astro.clientAddress");
class NodeApp extends App {
  match(req) {
    if (!(req instanceof Request)) {
      req = NodeApp.createRequest(req, {
        skipBody: true
      });
    }
    return super.match(req);
  }
  render(req, routeDataOrOptions, maybeLocals) {
    if (!(req instanceof Request)) {
      req = NodeApp.createRequest(req);
    }
    return super.render(req, routeDataOrOptions, maybeLocals);
  }
  /**
   * Converts a NodeJS IncomingMessage into a web standard Request.
   * ```js
   * import { NodeApp } from 'astro/app/node';
   * import { createServer } from 'node:http';
   *
   * const server = createServer(async (req, res) => {
   *     const request = NodeApp.createRequest(req);
   *     const response = await app.render(request);
   *     await NodeApp.writeResponse(response, res);
   * })
   * ```
   */
  static createRequest(req, { skipBody = false } = {}) {
    const protocol = req.headers["x-forwarded-proto"] ?? ("encrypted" in req.socket && req.socket.encrypted ? "https" : "http");
    const hostname = req.headers["x-forwarded-host"] ?? req.headers.host ?? req.headers[":authority"];
    const port = req.headers["x-forwarded-port"];
    const portInHostname = typeof hostname === "string" && typeof port === "string" && hostname.endsWith(port);
    const hostnamePort = portInHostname ? hostname : hostname + (port ? `:${port}` : "");
    const url = `${protocol}://${hostnamePort}${req.url}`;
    const options = {
      method: req.method || "GET",
      headers: makeRequestHeaders(req)
    };
    const bodyAllowed = options.method !== "HEAD" && options.method !== "GET" && skipBody === false;
    if (bodyAllowed) {
      Object.assign(options, makeRequestBody(req));
    }
    const request = new Request(url, options);
    const clientIp = req.headers["x-forwarded-for"];
    if (clientIp) {
      Reflect.set(request, clientAddressSymbol, clientIp);
    } else if (req.socket?.remoteAddress) {
      Reflect.set(request, clientAddressSymbol, req.socket.remoteAddress);
    }
    return request;
  }
  /**
   * Streams a web-standard Response into a NodeJS Server Response.
   * ```js
   * import { NodeApp } from 'astro/app/node';
   * import { createServer } from 'node:http';
   *
   * const server = createServer(async (req, res) => {
   *     const request = NodeApp.createRequest(req);
   *     const response = await app.render(request);
   *     await NodeApp.writeResponse(response, res);
   * })
   * ```
   * @param source WhatWG Response
   * @param destination NodeJS ServerResponse
   */
  static async writeResponse(source, destination) {
    const { status, headers, body } = source;
    destination.writeHead(status, createOutgoingHttpHeaders(headers));
    if (!body) return destination.end();
    try {
      const reader2 = body.getReader();
      destination.on("close", () => {
        reader2.cancel().catch((err) => {
          console.error(
            `There was an uncaught error in the middle of the stream while rendering ${destination.req.url}.`,
            err
          );
        });
      });
      let result = await reader2.read();
      while (!result.done) {
        destination.write(result.value);
        result = await reader2.read();
      }
      destination.end();
    } catch {
      destination.end("Internal server error");
    }
  }
}
function makeRequestHeaders(req) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === void 0) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else {
      headers.append(name, value);
    }
  }
  return headers;
}
function makeRequestBody(req) {
  if (req.body !== void 0) {
    if (typeof req.body === "string" && req.body.length > 0) {
      return { body: Buffer.from(req.body) };
    }
    if (typeof req.body === "object" && req.body !== null && Object.keys(req.body).length > 0) {
      return { body: Buffer.from(JSON.stringify(req.body)) };
    }
    if (typeof req.body === "object" && req.body !== null && typeof req.body[Symbol.asyncIterator] !== "undefined") {
      return asyncIterableToBodyProps(req.body);
    }
  }
  return asyncIterableToBodyProps(req);
}
function asyncIterableToBodyProps(iterable) {
  return {
    // Node uses undici for the Request implementation. Undici accepts
    // a non-standard async iterable for the body.
    // @ts-expect-error
    body: iterable,
    // The duplex property is required when using a ReadableStream or async
    // iterable for the body. The type definitions do not include the duplex
    // property because they are not up-to-date.
    duplex: "half"
  };
}
var tasks = {};
var utils$k = {};
var array$1 = {};
Object.defineProperty(array$1, "__esModule", { value: true });
array$1.splitWhen = array$1.flatten = void 0;
function flatten(items) {
  return items.reduce((collection, item) => [].concat(collection, item), []);
}
array$1.flatten = flatten;
function splitWhen(items, predicate) {
  const result = [[]];
  let groupIndex = 0;
  for (const item of items) {
    if (predicate(item)) {
      groupIndex++;
      result[groupIndex] = [];
    } else {
      result[groupIndex].push(item);
    }
  }
  return result;
}
array$1.splitWhen = splitWhen;
var errno$1 = {};
Object.defineProperty(errno$1, "__esModule", { value: true });
errno$1.isEnoentCodeError = void 0;
function isEnoentCodeError(error2) {
  return error2.code === "ENOENT";
}
errno$1.isEnoentCodeError = isEnoentCodeError;
var fs$7 = {};
Object.defineProperty(fs$7, "__esModule", { value: true });
fs$7.createDirentFromStats = void 0;
let DirentFromStats$1 = class DirentFromStats {
  constructor(name, stats) {
    this.name = name;
    this.isBlockDevice = stats.isBlockDevice.bind(stats);
    this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
    this.isDirectory = stats.isDirectory.bind(stats);
    this.isFIFO = stats.isFIFO.bind(stats);
    this.isFile = stats.isFile.bind(stats);
    this.isSocket = stats.isSocket.bind(stats);
    this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
  }
};
function createDirentFromStats$1(name, stats) {
  return new DirentFromStats$1(name, stats);
}
fs$7.createDirentFromStats = createDirentFromStats$1;
var path$9 = {};
Object.defineProperty(path$9, "__esModule", { value: true });
path$9.convertPosixPathToPattern = path$9.convertWindowsPathToPattern = path$9.convertPathToPattern = path$9.escapePosixPath = path$9.escapeWindowsPath = path$9.escape = path$9.removeLeadingDotSegment = path$9.makeAbsolute = path$9.unixify = void 0;
const os = require$$1;
const path$8 = require$$0;
const IS_WINDOWS_PLATFORM = os.platform() === "win32";
const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
function unixify(filepath) {
  return filepath.replace(/\\/g, "/");
}
path$9.unixify = unixify;
function makeAbsolute(cwd, filepath) {
  return path$8.resolve(cwd, filepath);
}
path$9.makeAbsolute = makeAbsolute;
function removeLeadingDotSegment(entry2) {
  if (entry2.charAt(0) === ".") {
    const secondCharactery = entry2.charAt(1);
    if (secondCharactery === "/" || secondCharactery === "\\") {
      return entry2.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
    }
  }
  return entry2;
}
path$9.removeLeadingDotSegment = removeLeadingDotSegment;
path$9.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
function escapeWindowsPath(pattern2) {
  return pattern2.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
}
path$9.escapeWindowsPath = escapeWindowsPath;
function escapePosixPath(pattern2) {
  return pattern2.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
}
path$9.escapePosixPath = escapePosixPath;
path$9.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
function convertWindowsPathToPattern(filepath) {
  return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
}
path$9.convertWindowsPathToPattern = convertWindowsPathToPattern;
function convertPosixPathToPattern(filepath) {
  return escapePosixPath(filepath);
}
path$9.convertPosixPathToPattern = convertPosixPathToPattern;
var pattern$1 = {};
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var isExtglob$1 = function isExtglob(str) {
  if (typeof str !== "string" || str === "") {
    return false;
  }
  var match;
  while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }
  return false;
};
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var isExtglob2 = isExtglob$1;
var chars = { "{": "}", "(": ")", "[": "]" };
var strictCheck = function(str) {
  if (str[0] === "!") {
    return true;
  }
  var index = 0;
  var pipeIndex = -2;
  var closeSquareIndex = -2;
  var closeCurlyIndex = -2;
  var closeParenIndex = -2;
  var backSlashIndex = -2;
  while (index < str.length) {
    if (str[index] === "*") {
      return true;
    }
    if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
      return true;
    }
    if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
      if (closeSquareIndex < index) {
        closeSquareIndex = str.indexOf("]", index);
      }
      if (closeSquareIndex > index) {
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
        backSlashIndex = str.indexOf("\\", index);
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
      }
    }
    if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
      closeCurlyIndex = str.indexOf("}", index);
      if (closeCurlyIndex > index) {
        backSlashIndex = str.indexOf("\\", index);
        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
          return true;
        }
      }
    }
    if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
      closeParenIndex = str.indexOf(")", index);
      if (closeParenIndex > index) {
        backSlashIndex = str.indexOf("\\", index);
        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
          return true;
        }
      }
    }
    if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
      if (pipeIndex < index) {
        pipeIndex = str.indexOf("|", index);
      }
      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
        closeParenIndex = str.indexOf(")", pipeIndex);
        if (closeParenIndex > pipeIndex) {
          backSlashIndex = str.indexOf("\\", pipeIndex);
          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
            return true;
          }
        }
      }
    }
    if (str[index] === "\\") {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];
      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }
      if (str[index] === "!") {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};
var relaxedCheck = function(str) {
  if (str[0] === "!") {
    return true;
  }
  var index = 0;
  while (index < str.length) {
    if (/[*?{}()[\]]/.test(str[index])) {
      return true;
    }
    if (str[index] === "\\") {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];
      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }
      if (str[index] === "!") {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};
var isGlob$1 = function isGlob(str, options) {
  if (typeof str !== "string" || str === "") {
    return false;
  }
  if (isExtglob2(str)) {
    return true;
  }
  var check = strictCheck;
  if (options && options.strict === false) {
    check = relaxedCheck;
  }
  return check(str);
};
var isGlob2 = isGlob$1;
var pathPosixDirname = require$$0.posix.dirname;
var isWin32 = require$$1.platform() === "win32";
var slash = "/";
var backslash = /\\/g;
var enclosure = /[\{\[].*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
var globParent$1 = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }
  if (enclosure.test(str)) {
    str += slash;
  }
  str += "a";
  do {
    str = pathPosixDirname(str);
  } while (isGlob2(str) || globby.test(str));
  return str.replace(escaped, "$1");
};
var utils$j = {};
(function(exports) {
  exports.isInteger = (num) => {
    if (typeof num === "number") {
      return Number.isInteger(num);
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isInteger(Number(num));
    }
    return false;
  };
  exports.find = (node, type) => node.nodes.find((node2) => node2.type === type);
  exports.exceedsLimit = (min, max, step = 1, limit) => {
    if (limit === false) return false;
    if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
    return (Number(max) - Number(min)) / Number(step) >= limit;
  };
  exports.escapeNode = (block, n = 0, type) => {
    const node = block.nodes[n];
    if (!node) return;
    if (type && node.type === type || node.type === "open" || node.type === "close") {
      if (node.escaped !== true) {
        node.value = "\\" + node.value;
        node.escaped = true;
      }
    }
  };
  exports.encloseBrace = (node) => {
    if (node.type !== "brace") return false;
    if (node.commas >> 0 + node.ranges >> 0 === 0) {
      node.invalid = true;
      return true;
    }
    return false;
  };
  exports.isInvalidBrace = (block) => {
    if (block.type !== "brace") return false;
    if (block.invalid === true || block.dollar) return true;
    if (block.commas >> 0 + block.ranges >> 0 === 0) {
      block.invalid = true;
      return true;
    }
    if (block.open !== true || block.close !== true) {
      block.invalid = true;
      return true;
    }
    return false;
  };
  exports.isOpenOrClose = (node) => {
    if (node.type === "open" || node.type === "close") {
      return true;
    }
    return node.open === true || node.close === true;
  };
  exports.reduce = (nodes) => nodes.reduce((acc, node) => {
    if (node.type === "text") acc.push(node.value);
    if (node.type === "range") node.type = "text";
    return acc;
  }, []);
  exports.flatten = (...args) => {
    const result = [];
    const flat = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        if (Array.isArray(ele)) {
          flat(ele);
          continue;
        }
        if (ele !== void 0) {
          result.push(ele);
        }
      }
      return result;
    };
    flat(args);
    return result;
  };
})(utils$j);
const utils$i = utils$j;
var stringify$4 = (ast, options = {}) => {
  const stringify2 = (node, parent = {}) => {
    const invalidBlock = options.escapeInvalid && utils$i.isInvalidBrace(parent);
    const invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = "";
    if (node.value) {
      if ((invalidBlock || invalidNode) && utils$i.isOpenOrClose(node)) {
        return "\\" + node.value;
      }
      return node.value;
    }
    if (node.value) {
      return node.value;
    }
    if (node.nodes) {
      for (const child of node.nodes) {
        output += stringify2(child);
      }
    }
    return output;
  };
  return stringify2(ast);
};
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
var isNumber$2 = function(num) {
  if (typeof num === "number") {
    return num - num === 0;
  }
  if (typeof num === "string" && num.trim() !== "") {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const isNumber$1 = isNumber$2;
const toRegexRange$1 = (min, max, options) => {
  if (isNumber$1(min) === false) {
    throw new TypeError("toRegexRange: expected the first argument to be a number");
  }
  if (max === void 0 || min === max) {
    return String(min);
  }
  if (isNumber$1(max) === false) {
    throw new TypeError("toRegexRange: expected the second argument to be a number.");
  }
  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === "boolean") {
    opts.relaxZeros = opts.strictZeros === false;
  }
  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
  if (toRegexRange$1.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange$1.cache[cacheKey].result;
  }
  let a = Math.min(min, max);
  let b = Math.max(min, max);
  if (Math.abs(a - b) === 1) {
    let result = min + "|" + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }
  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];
  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }
  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }
  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }
  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives);
  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
    state.result = `(?:${state.result})`;
  }
  toRegexRange$1.cache[cacheKey] = state;
  return state.result;
};
function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, "-", false) || [];
  let onlyPositive = filterPatterns(pos, neg, "", false) || [];
  let intersected = filterPatterns(neg, pos, "-?", true) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join("|");
}
function splitToRanges(min, max) {
  let nines = 1;
  let zeros2 = 1;
  let stop = countNines(min, nines);
  let stops = /* @__PURE__ */ new Set([max]);
  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }
  stop = countZeros(max + 1, zeros2) - 1;
  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros2 += 1;
    stop = countZeros(max + 1, zeros2) - 1;
  }
  stops = [...stops];
  stops.sort(compare);
  return stops;
}
function rangeToPattern(start2, stop, options) {
  if (start2 === stop) {
    return { pattern: start2, count: [], digits: 0 };
  }
  let zipped = zip(start2, stop);
  let digits = zipped.length;
  let pattern2 = "";
  let count = 0;
  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];
    if (startDigit === stopDigit) {
      pattern2 += startDigit;
    } else if (startDigit !== "0" || stopDigit !== "9") {
      pattern2 += toCharacterClass(startDigit, stopDigit);
    } else {
      count++;
    }
  }
  if (count) {
    pattern2 += options.shorthand === true ? "\\d" : "[0-9]";
  }
  return { pattern: pattern2, count: [count], digits };
}
function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start2 = min;
  let prev;
  for (let i = 0; i < ranges.length; i++) {
    let max2 = ranges[i];
    let obj = rangeToPattern(String(start2), String(max2), options);
    let zeros2 = "";
    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }
      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start2 = max2 + 1;
      continue;
    }
    if (tok.isPadded) {
      zeros2 = padZeros(max2, tok, options);
    }
    obj.string = zeros2 + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start2 = max2 + 1;
    prev = obj;
  }
  return tokens;
}
function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];
  for (let ele of arr) {
    let { string: string2 } = ele;
    if (!intersection && !contains(comparison, "string", string2)) {
      result.push(prefix + string2);
    }
    if (intersection && contains(comparison, "string", string2)) {
      result.push(prefix + string2);
    }
  }
  return result;
}
function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}
function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}
function contains(arr, key, val) {
  return arr.some((ele) => ele[key] === val);
}
function countNines(min, len) {
  return Number(String(min).slice(0, -len) + "9".repeat(len));
}
function countZeros(integer, zeros2) {
  return integer - integer % Math.pow(10, zeros2);
}
function toQuantifier(digits) {
  let [start2 = 0, stop = ""] = digits;
  if (stop || start2 > 1) {
    return `{${start2 + (stop ? "," + stop : "")}}`;
  }
  return "";
}
function toCharacterClass(a, b, options) {
  return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
}
function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}
function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }
  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;
  switch (diff) {
    case 0:
      return "";
    case 1:
      return relax ? "0?" : "0";
    case 2:
      return relax ? "0{0,2}" : "00";
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}
toRegexRange$1.cache = {};
toRegexRange$1.clearCache = () => toRegexRange$1.cache = {};
var toRegexRange_1 = toRegexRange$1;
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */
const util$1 = require$$0$1;
const toRegexRange = toRegexRange_1;
const isObject$1 = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
const transform = (toNumber) => {
  return (value) => toNumber === true ? Number(value) : String(value);
};
const isValidValue = (value) => {
  return typeof value === "number" || typeof value === "string" && value !== "";
};
const isNumber = (num) => Number.isInteger(+num);
const zeros = (input) => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === "-") value = value.slice(1);
  if (value === "0") return false;
  while (value[++index] === "0") ;
  return index > 0;
};
const stringify$3 = (start2, end, options) => {
  if (typeof start2 === "string" || typeof end === "string") {
    return true;
  }
  return options.stringify === true;
};
const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === "-" ? "-" : "";
    if (dash) input = input.slice(1);
    input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};
const toMaxLen = (input, maxLength) => {
  let negative = input[0] === "-" ? "-" : "";
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = "0" + input;
  return negative ? "-" + input : input;
};
const toSequence = (parts, options, maxLen) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  let prefix = options.capture ? "" : "?:";
  let positives = "";
  let negatives = "";
  let result;
  if (parts.positives.length) {
    positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
  }
  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
  }
  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }
  if (options.wrap) {
    return `(${prefix}${result})`;
  }
  return result;
};
const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }
  let start2 = String.fromCharCode(a);
  if (a === b) return start2;
  let stop = String.fromCharCode(b);
  return `[${start2}-${stop}]`;
};
const toRegex = (start2, end, options) => {
  if (Array.isArray(start2)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? "" : "?:";
    return wrap ? `(${prefix}${start2.join("|")})` : start2.join("|");
  }
  return toRegexRange(start2, end, options);
};
const rangeError = (...args) => {
  return new RangeError("Invalid range arguments: " + util$1.inspect(...args));
};
const invalidRange = (start2, end, options) => {
  if (options.strictRanges === true) throw rangeError([start2, end]);
  return [];
};
const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};
const fillNumbers = (start2, end, step = 1, options = {}) => {
  let a = Number(start2);
  let b = Number(end);
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start2, end]);
    return [];
  }
  if (a === 0) a = 0;
  if (b === 0) b = 0;
  let descending = a > b;
  let startString = String(start2);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);
  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify$3(start2, end, options) === false;
  let format = options.transform || transform(toNumber);
  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start2, maxLen), toMaxLen(end, maxLen), true, options);
  }
  let parts = { negatives: [], positives: [] };
  let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
  let range = [];
  let index = 0;
  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }
  if (options.toRegex === true) {
    return step > 1 ? toSequence(parts, options, maxLen) : toRegex(range, null, { wrap: false, ...options });
  }
  return range;
};
const fillLetters = (start2, end, step = 1, options = {}) => {
  if (!isNumber(start2) && start2.length > 1 || !isNumber(end) && end.length > 1) {
    return invalidRange(start2, end, options);
  }
  let format = options.transform || ((val) => String.fromCharCode(val));
  let a = `${start2}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);
  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }
  let range = [];
  let index = 0;
  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }
  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }
  return range;
};
const fill$2 = (start2, end, step, options = {}) => {
  if (end == null && isValidValue(start2)) {
    return [start2];
  }
  if (!isValidValue(start2) || !isValidValue(end)) {
    return invalidRange(start2, end, options);
  }
  if (typeof step === "function") {
    return fill$2(start2, end, 1, { transform: step });
  }
  if (isObject$1(step)) {
    return fill$2(start2, end, 0, step);
  }
  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;
  if (!isNumber(step)) {
    if (step != null && !isObject$1(step)) return invalidStep(step, opts);
    return fill$2(start2, end, 1, step);
  }
  if (isNumber(start2) && isNumber(end)) {
    return fillNumbers(start2, end, step, opts);
  }
  return fillLetters(start2, end, Math.max(Math.abs(step), 1), opts);
};
var fillRange = fill$2;
const fill$1 = fillRange;
const utils$h = utils$j;
const compile$1 = (ast, options = {}) => {
  const walk2 = (node, parent = {}) => {
    const invalidBlock = utils$h.isInvalidBrace(parent);
    const invalidNode = node.invalid === true && options.escapeInvalid === true;
    const invalid = invalidBlock === true || invalidNode === true;
    const prefix = options.escapeInvalid === true ? "\\" : "";
    let output = "";
    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      console.log("node.isClose", prefix, node.value);
      return prefix + node.value;
    }
    if (node.type === "open") {
      return invalid ? prefix + node.value : "(";
    }
    if (node.type === "close") {
      return invalid ? prefix + node.value : ")";
    }
    if (node.type === "comma") {
      return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
    }
    if (node.value) {
      return node.value;
    }
    if (node.nodes && node.ranges > 0) {
      const args = utils$h.reduce(node.nodes);
      const range = fill$1(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });
      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }
    if (node.nodes) {
      for (const child of node.nodes) {
        output += walk2(child, node);
      }
    }
    return output;
  };
  return walk2(ast);
};
var compile_1 = compile$1;
const fill = fillRange;
const stringify$2 = stringify$4;
const utils$g = utils$j;
const append = (queue2 = "", stash = "", enclose = false) => {
  const result = [];
  queue2 = [].concat(queue2);
  stash = [].concat(stash);
  if (!stash.length) return queue2;
  if (!queue2.length) {
    return enclose ? utils$g.flatten(stash).map((ele) => `{${ele}}`) : stash;
  }
  for (const item of queue2) {
    if (Array.isArray(item)) {
      for (const value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
      }
    }
  }
  return utils$g.flatten(result);
};
const expand$1 = (ast, options = {}) => {
  const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
  const walk2 = (node, parent = {}) => {
    node.queue = [];
    let p = parent;
    let q = parent.queue;
    while (p.type !== "brace" && p.type !== "root" && p.parent) {
      p = p.parent;
      q = p.queue;
    }
    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify$2(node, options)));
      return;
    }
    if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ["{}"]));
      return;
    }
    if (node.nodes && node.ranges > 0) {
      const args = utils$g.reduce(node.nodes);
      if (utils$g.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
      }
      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify$2(node, options);
      }
      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }
    const enclose = utils$g.encloseBrace(node);
    let queue2 = node.queue;
    let block = node;
    while (block.type !== "brace" && block.type !== "root" && block.parent) {
      block = block.parent;
      queue2 = block.queue;
    }
    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];
      if (child.type === "comma" && node.type === "brace") {
        if (i === 1) queue2.push("");
        queue2.push("");
        continue;
      }
      if (child.type === "close") {
        q.push(append(q.pop(), queue2, enclose));
        continue;
      }
      if (child.value && child.type !== "open") {
        queue2.push(append(queue2.pop(), child.value));
        continue;
      }
      if (child.nodes) {
        walk2(child, node);
      }
    }
    return queue2;
  };
  return utils$g.flatten(walk2(ast));
};
var expand_1 = expand$1;
var constants$4 = {
  MAX_LENGTH: 1e4,
  // Digits
  CHAR_0: "0",
  /* 0 */
  CHAR_9: "9",
  /* 9 */
  // Alphabet chars.
  CHAR_UPPERCASE_A: "A",
  /* A */
  CHAR_LOWERCASE_A: "a",
  /* a */
  CHAR_UPPERCASE_Z: "Z",
  /* Z */
  CHAR_LOWERCASE_Z: "z",
  /* z */
  CHAR_LEFT_PARENTHESES: "(",
  /* ( */
  CHAR_RIGHT_PARENTHESES: ")",
  /* ) */
  CHAR_ASTERISK: "*",
  /* * */
  // Non-alphabetic chars.
  CHAR_AMPERSAND: "&",
  /* & */
  CHAR_AT: "@",
  /* @ */
  CHAR_BACKSLASH: "\\",
  /* \ */
  CHAR_BACKTICK: "`",
  /* ` */
  CHAR_CARRIAGE_RETURN: "\r",
  /* \r */
  CHAR_CIRCUMFLEX_ACCENT: "^",
  /* ^ */
  CHAR_COLON: ":",
  /* : */
  CHAR_COMMA: ",",
  /* , */
  CHAR_DOLLAR: "$",
  /* . */
  CHAR_DOT: ".",
  /* . */
  CHAR_DOUBLE_QUOTE: '"',
  /* " */
  CHAR_EQUAL: "=",
  /* = */
  CHAR_EXCLAMATION_MARK: "!",
  /* ! */
  CHAR_FORM_FEED: "\f",
  /* \f */
  CHAR_FORWARD_SLASH: "/",
  /* / */
  CHAR_HASH: "#",
  /* # */
  CHAR_HYPHEN_MINUS: "-",
  /* - */
  CHAR_LEFT_ANGLE_BRACKET: "<",
  /* < */
  CHAR_LEFT_CURLY_BRACE: "{",
  /* { */
  CHAR_LEFT_SQUARE_BRACKET: "[",
  /* [ */
  CHAR_LINE_FEED: "\n",
  /* \n */
  CHAR_NO_BREAK_SPACE: " ",
  /* \u00A0 */
  CHAR_PERCENT: "%",
  /* % */
  CHAR_PLUS: "+",
  /* + */
  CHAR_QUESTION_MARK: "?",
  /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: ">",
  /* > */
  CHAR_RIGHT_CURLY_BRACE: "}",
  /* } */
  CHAR_RIGHT_SQUARE_BRACKET: "]",
  /* ] */
  CHAR_SEMICOLON: ";",
  /* ; */
  CHAR_SINGLE_QUOTE: "'",
  /* ' */
  CHAR_SPACE: " ",
  /*   */
  CHAR_TAB: "	",
  /* \t */
  CHAR_UNDERSCORE: "_",
  /* _ */
  CHAR_VERTICAL_LINE: "|",
  /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
  /* \uFEFF */
};
const stringify$1 = stringify$4;
const {
  MAX_LENGTH: MAX_LENGTH$1,
  CHAR_BACKSLASH,
  /* \ */
  CHAR_BACKTICK,
  /* ` */
  CHAR_COMMA: CHAR_COMMA$1,
  /* , */
  CHAR_DOT: CHAR_DOT$1,
  /* . */
  CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1,
  /* ( */
  CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1,
  /* ) */
  CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1,
  /* { */
  CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1,
  /* } */
  CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1,
  /* [ */
  CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1,
  /* ] */
  CHAR_DOUBLE_QUOTE,
  /* " */
  CHAR_SINGLE_QUOTE,
  /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = constants$4;
const parse$3 = (input, options = {}) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected a string");
  }
  const opts = options || {};
  const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }
  const ast = { type: "root", input, nodes: [] };
  const stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  const length = input.length;
  let index = 0;
  let depth2 = 0;
  let value;
  const advance = () => input[index++];
  const push = (node) => {
    if (node.type === "text" && prev.type === "dot") {
      prev.type = "text";
    }
    if (prev && prev.type === "text" && node.type === "text") {
      prev.value += node.value;
      return;
    }
    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };
  push({ type: "bos" });
  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();
    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }
    if (value === CHAR_BACKSLASH) {
      push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
      continue;
    }
    if (value === CHAR_RIGHT_SQUARE_BRACKET$1) {
      push({ type: "text", value: "\\" + value });
      continue;
    }
    if (value === CHAR_LEFT_SQUARE_BRACKET$1) {
      brackets++;
      let next;
      while (index < length && (next = advance())) {
        value += next;
        if (next === CHAR_LEFT_SQUARE_BRACKET$1) {
          brackets++;
          continue;
        }
        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }
        if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
          brackets--;
          if (brackets === 0) {
            break;
          }
        }
      }
      push({ type: "text", value });
      continue;
    }
    if (value === CHAR_LEFT_PARENTHESES$1) {
      block = push({ type: "paren", nodes: [] });
      stack.push(block);
      push({ type: "text", value });
      continue;
    }
    if (value === CHAR_RIGHT_PARENTHESES$1) {
      if (block.type !== "paren") {
        push({ type: "text", value });
        continue;
      }
      block = stack.pop();
      push({ type: "text", value });
      block = stack[stack.length - 1];
      continue;
    }
    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      const open = value;
      let next;
      if (options.keepQuotes !== true) {
        value = "";
      }
      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }
        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }
        value += next;
      }
      push({ type: "text", value });
      continue;
    }
    if (value === CHAR_LEFT_CURLY_BRACE$1) {
      depth2++;
      const dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
      const brace = {
        type: "brace",
        open: true,
        close: false,
        dollar,
        depth: depth2,
        commas: 0,
        ranges: 0,
        nodes: []
      };
      block = push(brace);
      stack.push(block);
      push({ type: "open", value });
      continue;
    }
    if (value === CHAR_RIGHT_CURLY_BRACE$1) {
      if (block.type !== "brace") {
        push({ type: "text", value });
        continue;
      }
      const type = "close";
      block = stack.pop();
      block.close = true;
      push({ type, value });
      depth2--;
      block = stack[stack.length - 1];
      continue;
    }
    if (value === CHAR_COMMA$1 && depth2 > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        const open = block.nodes.shift();
        block.nodes = [open, { type: "text", value: stringify$1(block) }];
      }
      push({ type: "comma", value });
      block.commas++;
      continue;
    }
    if (value === CHAR_DOT$1 && depth2 > 0 && block.commas === 0) {
      const siblings = block.nodes;
      if (depth2 === 0 || siblings.length === 0) {
        push({ type: "text", value });
        continue;
      }
      if (prev.type === "dot") {
        block.range = [];
        prev.value += value;
        prev.type = "range";
        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = "text";
          continue;
        }
        block.ranges++;
        block.args = [];
        continue;
      }
      if (prev.type === "range") {
        siblings.pop();
        const before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }
      push({ type: "dot", value });
      continue;
    }
    push({ type: "text", value });
  }
  do {
    block = stack.pop();
    if (block.type !== "root") {
      block.nodes.forEach((node) => {
        if (!node.nodes) {
          if (node.type === "open") node.isOpen = true;
          if (node.type === "close") node.isClose = true;
          if (!node.nodes) node.type = "text";
          node.invalid = true;
        }
      });
      const parent = stack[stack.length - 1];
      const index2 = parent.nodes.indexOf(block);
      parent.nodes.splice(index2, 1, ...block.nodes);
    }
  } while (stack.length > 0);
  push({ type: "eos" });
  return ast;
};
var parse_1$1 = parse$3;
const stringify = stringify$4;
const compile = compile_1;
const expand = expand_1;
const parse$2 = parse_1$1;
const braces$1 = (input, options = {}) => {
  let output = [];
  if (Array.isArray(input)) {
    for (const pattern2 of input) {
      const result = braces$1.create(pattern2, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces$1.create(input, options));
  }
  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};
braces$1.parse = (input, options = {}) => parse$2(input, options);
braces$1.stringify = (input, options = {}) => {
  if (typeof input === "string") {
    return stringify(braces$1.parse(input, options), options);
  }
  return stringify(input, options);
};
braces$1.compile = (input, options = {}) => {
  if (typeof input === "string") {
    input = braces$1.parse(input, options);
  }
  return compile(input, options);
};
braces$1.expand = (input, options = {}) => {
  if (typeof input === "string") {
    input = braces$1.parse(input, options);
  }
  let result = expand(input, options);
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }
  return result;
};
braces$1.create = (input, options = {}) => {
  if (input === "" || input.length < 3) {
    return [input];
  }
  return options.expand !== true ? braces$1.compile(input, options) : braces$1.expand(input, options);
};
var braces_1 = braces$1;
var utils$f = {};
const path$7 = require$$0;
const WIN_SLASH = "\\\\/";
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
const DOT_LITERAL = "\\.";
const PLUS_LITERAL = "\\+";
const QMARK_LITERAL = "\\?";
const SLASH_LITERAL = "\\/";
const ONE_CHAR = "(?=.)";
const QMARK = "[^/]";
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;
const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};
const WINDOWS_CHARS = {
  ...POSIX_CHARS,
  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};
const POSIX_REGEX_SOURCE$1 = {
  alnum: "a-zA-Z0-9",
  alpha: "a-zA-Z",
  ascii: "\\x00-\\x7F",
  blank: " \\t",
  cntrl: "\\x00-\\x1F\\x7F",
  digit: "0-9",
  graph: "\\x21-\\x7E",
  lower: "a-z",
  print: "\\x20-\\x7E ",
  punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
  space: " \\t\\r\\n\\v\\f",
  upper: "A-Z",
  word: "A-Za-z0-9_",
  xdigit: "A-Fa-f0-9"
};
var constants$3 = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1,
  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    "***": "*",
    "**/**": "**",
    "**/**/**": "**"
  },
  // Digits
  CHAR_0: 48,
  /* 0 */
  CHAR_9: 57,
  /* 9 */
  // Alphabet chars.
  CHAR_UPPERCASE_A: 65,
  /* A */
  CHAR_LOWERCASE_A: 97,
  /* a */
  CHAR_UPPERCASE_Z: 90,
  /* Z */
  CHAR_LOWERCASE_Z: 122,
  /* z */
  CHAR_LEFT_PARENTHESES: 40,
  /* ( */
  CHAR_RIGHT_PARENTHESES: 41,
  /* ) */
  CHAR_ASTERISK: 42,
  /* * */
  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38,
  /* & */
  CHAR_AT: 64,
  /* @ */
  CHAR_BACKWARD_SLASH: 92,
  /* \ */
  CHAR_CARRIAGE_RETURN: 13,
  /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94,
  /* ^ */
  CHAR_COLON: 58,
  /* : */
  CHAR_COMMA: 44,
  /* , */
  CHAR_DOT: 46,
  /* . */
  CHAR_DOUBLE_QUOTE: 34,
  /* " */
  CHAR_EQUAL: 61,
  /* = */
  CHAR_EXCLAMATION_MARK: 33,
  /* ! */
  CHAR_FORM_FEED: 12,
  /* \f */
  CHAR_FORWARD_SLASH: 47,
  /* / */
  CHAR_GRAVE_ACCENT: 96,
  /* ` */
  CHAR_HASH: 35,
  /* # */
  CHAR_HYPHEN_MINUS: 45,
  /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60,
  /* < */
  CHAR_LEFT_CURLY_BRACE: 123,
  /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91,
  /* [ */
  CHAR_LINE_FEED: 10,
  /* \n */
  CHAR_NO_BREAK_SPACE: 160,
  /* \u00A0 */
  CHAR_PERCENT: 37,
  /* % */
  CHAR_PLUS: 43,
  /* + */
  CHAR_QUESTION_MARK: 63,
  /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62,
  /* > */
  CHAR_RIGHT_CURLY_BRACE: 125,
  /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93,
  /* ] */
  CHAR_SEMICOLON: 59,
  /* ; */
  CHAR_SINGLE_QUOTE: 39,
  /* ' */
  CHAR_SPACE: 32,
  /*   */
  CHAR_TAB: 9,
  /* \t */
  CHAR_UNDERSCORE: 95,
  /* _ */
  CHAR_VERTICAL_LINE: 124,
  /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
  /* \uFEFF */
  SEP: path$7.sep,
  /**
   * Create EXTGLOB_CHARS
   */
  extglobChars(chars2) {
    return {
      "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars2.STAR})` },
      "?": { type: "qmark", open: "(?:", close: ")?" },
      "+": { type: "plus", open: "(?:", close: ")+" },
      "*": { type: "star", open: "(?:", close: ")*" },
      "@": { type: "at", open: "(?:", close: ")" }
    };
  },
  /**
   * Create GLOB_CHARS
   */
  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};
(function(exports) {
  const path2 = require$$0;
  const win32 = process.platform === "win32";
  const {
    REGEX_BACKSLASH,
    REGEX_REMOVE_BACKSLASH,
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL
  } = constants$3;
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
  exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
  exports.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.supportsLookbehinds = () => {
    const segs = process.version.slice(1).split(".").map(Number);
    if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
      return true;
    }
    return false;
  };
  exports.isWindows = (options) => {
    if (options && typeof options.windows === "boolean") {
      return options.windows;
    }
    return win32 === true || path2.sep === "\\";
  };
  exports.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1) return input;
    if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports.removePrefix = (input, state = {}) => {
    let output = input;
    if (output.startsWith("./")) {
      output = output.slice(2);
      state.prefix = "./";
    }
    return output;
  };
  exports.wrapOutput = (input, state = {}, options = {}) => {
    const prepend = options.contains ? "" : "^";
    const append2 = options.contains ? "" : "$";
    let output = `${prepend}(?:${input})${append2}`;
    if (state.negated === true) {
      output = `(?:^(?!${output}).*$)`;
    }
    return output;
  };
})(utils$f);
const utils$e = utils$f;
const {
  CHAR_ASTERISK,
  /* * */
  CHAR_AT,
  /* @ */
  CHAR_BACKWARD_SLASH,
  /* \ */
  CHAR_COMMA,
  /* , */
  CHAR_DOT,
  /* . */
  CHAR_EXCLAMATION_MARK,
  /* ! */
  CHAR_FORWARD_SLASH,
  /* / */
  CHAR_LEFT_CURLY_BRACE,
  /* { */
  CHAR_LEFT_PARENTHESES,
  /* ( */
  CHAR_LEFT_SQUARE_BRACKET,
  /* [ */
  CHAR_PLUS,
  /* + */
  CHAR_QUESTION_MARK,
  /* ? */
  CHAR_RIGHT_CURLY_BRACE,
  /* } */
  CHAR_RIGHT_PARENTHESES,
  /* ) */
  CHAR_RIGHT_SQUARE_BRACKET
  /* ] */
} = constants$3;
const isPathSeparator = (code) => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};
const depth = (token) => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};
const scan$1 = (input, options) => {
  const opts = options || {};
  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];
  let str = input;
  let index = -1;
  let start2 = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob3 = false;
  let isExtglob3 = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let negatedExtglob = false;
  let finished = false;
  let braces2 = 0;
  let prev;
  let code;
  let token = { value: "", depth: 0, isGlob: false };
  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };
  while (index < length) {
    code = advance();
    let next;
    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();
      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }
    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces2++;
      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }
        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces2++;
          continue;
        }
        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob3 = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob3 = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces2--;
          if (braces2 === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: "", depth: 0, isGlob: false };
      if (finished === true) continue;
      if (prev === CHAR_DOT && index === start2 + 1) {
        start2 += 2;
        continue;
      }
      lastIndex = index + 1;
      continue;
    }
    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob3 = token.isGlob = true;
        isExtglob3 = token.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start2) {
          negatedExtglob = true;
        }
        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob3 = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }
    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob3 = token.isGlob = true;
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_QUESTION_MARK) {
      isGlob3 = token.isGlob = true;
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }
        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob3 = token.isGlob = true;
          finished = true;
          break;
        }
      }
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start2) {
      negated = token.negated = true;
      start2++;
      continue;
    }
    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob3 = token.isGlob = true;
      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }
          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }
    if (isGlob3 === true) {
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
  }
  if (opts.noext === true) {
    isExtglob3 = false;
    isGlob3 = false;
  }
  let base = str;
  let prefix = "";
  let glob = "";
  if (start2 > 0) {
    prefix = str.slice(0, start2);
    str = str.slice(start2);
    lastIndex -= start2;
  }
  if (base && isGlob3 === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob3 === true) {
    base = "";
    glob = str;
  } else {
    base = str;
  }
  if (base && base !== "" && base !== "/" && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }
  if (opts.unescape === true) {
    if (glob) glob = utils$e.removeBackslashes(glob);
    if (base && backslashes === true) {
      base = utils$e.removeBackslashes(base);
    }
  }
  const state = {
    prefix,
    input,
    start: start2,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob: isGlob3,
    isExtglob: isExtglob3,
    isGlobstar,
    negated,
    negatedExtglob
  };
  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }
  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;
    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start2;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start2 !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== "") {
        parts.push(value);
      }
      prevIndex = i;
    }
    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);
      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }
    state.slashes = slashes;
    state.parts = parts;
  }
  return state;
};
var scan_1 = scan$1;
const constants$2 = constants$3;
const utils$d = utils$f;
const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants$2;
const expandRange = (args, options) => {
  if (typeof options.expandRange === "function") {
    return options.expandRange(...args, options);
  }
  args.sort();
  const value = `[${args.join("-")}]`;
  try {
    new RegExp(value);
  } catch (ex) {
    return args.map((v) => utils$d.escapeRegex(v)).join("..");
  }
  return value;
};
const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};
const parse$1 = (input, options) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected a string");
  }
  input = REPLACEMENTS[input] || input;
  const opts = { ...options };
  const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }
  const bos = { type: "bos", value: "", output: opts.prepend || "" };
  const tokens = [bos];
  const capture = opts.capture ? "" : "?:";
  const win32 = utils$d.isWindows(options);
  const PLATFORM_CHARS = constants$2.globChars(win32);
  const EXTGLOB_CHARS = constants$2.extglobChars(PLATFORM_CHARS);
  const {
    DOT_LITERAL: DOT_LITERAL2,
    PLUS_LITERAL: PLUS_LITERAL2,
    SLASH_LITERAL: SLASH_LITERAL2,
    ONE_CHAR: ONE_CHAR2,
    DOTS_SLASH: DOTS_SLASH2,
    NO_DOT: NO_DOT2,
    NO_DOT_SLASH: NO_DOT_SLASH2,
    NO_DOTS_SLASH: NO_DOTS_SLASH2,
    QMARK: QMARK2,
    QMARK_NO_DOT: QMARK_NO_DOT2,
    STAR: STAR2,
    START_ANCHOR: START_ANCHOR2
  } = PLATFORM_CHARS;
  const globstar = (opts2) => {
    return `(${capture}(?:(?!${START_ANCHOR2}${opts2.dot ? DOTS_SLASH2 : DOT_LITERAL2}).)*?)`;
  };
  const nodot = opts.dot ? "" : NO_DOT2;
  const qmarkNoDot = opts.dot ? QMARK2 : QMARK_NO_DOT2;
  let star = opts.bash === true ? globstar(opts) : STAR2;
  if (opts.capture) {
    star = `(${star})`;
  }
  if (typeof opts.noext === "boolean") {
    opts.noextglob = opts.noext;
  }
  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: "",
    output: "",
    prefix: "",
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };
  input = utils$d.removePrefix(input, state);
  len = input.length;
  const extglobs = [];
  const braces2 = [];
  const stack = [];
  let prev = bos;
  let value;
  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index] || "";
  const remaining = () => input.slice(state.index + 1);
  const consume = (value2 = "", num = 0) => {
    state.consumed += value2;
    state.index += num;
  };
  const append2 = (token) => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };
  const negate = () => {
    let count = 1;
    while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
      advance();
      state.start++;
      count++;
    }
    if (count % 2 === 0) {
      return false;
    }
    state.negated = true;
    state.start++;
    return true;
  };
  const increment = (type) => {
    state[type]++;
    stack.push(type);
  };
  const decrement = (type) => {
    state[type]--;
    stack.pop();
  };
  const push = (tok) => {
    if (prev.type === "globstar") {
      const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
      const isExtglob3 = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
      if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob3) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "star";
        prev.value = "*";
        prev.output = star;
        state.output += prev.output;
      }
    }
    if (extglobs.length && tok.type !== "paren") {
      extglobs[extglobs.length - 1].inner += tok.value;
    }
    if (tok.value || tok.output) append2(tok);
    if (prev && prev.type === "text" && tok.type === "text") {
      prev.value += tok.value;
      prev.output = (prev.output || "") + tok.value;
      return;
    }
    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };
  const extglobOpen = (type, value2) => {
    const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? "(" : "") + token.open;
    increment("parens");
    push({ type, value: value2, output: state.output ? "" : ONE_CHAR2 });
    push({ type: "paren", extglob: true, value: advance(), output });
    extglobs.push(token);
  };
  const extglobClose = (token) => {
    let output = token.close + (opts.capture ? ")" : "");
    let rest;
    if (token.type === "negate") {
      let extglobStar = star;
      if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
        extglobStar = globstar(opts);
      }
      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }
      if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        const expression = parse$1(rest, { ...options, fastpaths: false }).output;
        output = token.close = `)${expression})${extglobStar})`;
      }
      if (token.prev.type === "bos") {
        state.negatedExtglob = true;
      }
    }
    push({ type: "paren", extglob: true, value, output });
    decrement("parens");
  };
  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;
    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars2, first, rest, index) => {
      if (first === "\\") {
        backslashes = true;
        return m;
      }
      if (first === "?") {
        if (esc) {
          return esc + first + (rest ? QMARK2.repeat(rest.length) : "");
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK2.repeat(rest.length) : "");
        }
        return QMARK2.repeat(chars2.length);
      }
      if (first === ".") {
        return DOT_LITERAL2.repeat(chars2.length);
      }
      if (first === "*") {
        if (esc) {
          return esc + first + (rest ? star : "");
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });
    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, "");
      } else {
        output = output.replace(/\\+/g, (m) => {
          return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
        });
      }
    }
    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }
    state.output = utils$d.wrapOutput(output, state, options);
    return state;
  }
  while (!eos()) {
    value = advance();
    if (value === "\0") {
      continue;
    }
    if (value === "\\") {
      const next = peek();
      if (next === "/" && opts.bash !== true) {
        continue;
      }
      if (next === "." || next === ";") {
        continue;
      }
      if (!next) {
        value += "\\";
        push({ type: "text", value });
        continue;
      }
      const match = /^\\+/.exec(remaining());
      let slashes = 0;
      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += "\\";
        }
      }
      if (opts.unescape === true) {
        value = advance();
      } else {
        value += advance();
      }
      if (state.brackets === 0) {
        push({ type: "text", value });
        continue;
      }
    }
    if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
      if (opts.posix !== false && value === ":") {
        const inner = prev.value.slice(1);
        if (inner.includes("[")) {
          prev.posix = true;
          if (inner.includes(":")) {
            const idx = prev.value.lastIndexOf("[");
            const pre = prev.value.slice(0, idx);
            const rest2 = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest2];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();
              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR2;
              }
              continue;
            }
          }
        }
      }
      if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
        value = `\\${value}`;
      }
      if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
        value = `\\${value}`;
      }
      if (opts.posix === true && value === "!" && prev.value === "[") {
        value = "^";
      }
      prev.value += value;
      append2({ value });
      continue;
    }
    if (state.quotes === 1 && value !== '"') {
      value = utils$d.escapeRegex(value);
      prev.value += value;
      append2({ value });
      continue;
    }
    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: "text", value });
      }
      continue;
    }
    if (value === "(") {
      increment("parens");
      push({ type: "paren", value });
      continue;
    }
    if (value === ")") {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError("opening", "("));
      }
      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }
      push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
      decrement("parens");
      continue;
    }
    if (value === "[") {
      if (opts.nobracket === true || !remaining().includes("]")) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("closing", "]"));
        }
        value = `\\${value}`;
      } else {
        increment("brackets");
      }
      push({ type: "bracket", value });
      continue;
    }
    if (value === "]") {
      if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
        push({ type: "text", value, output: `\\${value}` });
        continue;
      }
      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("opening", "["));
        }
        push({ type: "text", value, output: `\\${value}` });
        continue;
      }
      decrement("brackets");
      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
        value = `/${value}`;
      }
      prev.value += value;
      append2({ value });
      if (opts.literalBrackets === false || utils$d.hasRegexChars(prevValue)) {
        continue;
      }
      const escaped2 = utils$d.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);
      if (opts.literalBrackets === true) {
        state.output += escaped2;
        prev.value = escaped2;
        continue;
      }
      prev.value = `(${capture}${escaped2}|${prev.value})`;
      state.output += prev.value;
      continue;
    }
    if (value === "{" && opts.nobrace !== true) {
      increment("braces");
      const open = {
        type: "brace",
        value,
        output: "(",
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };
      braces2.push(open);
      push(open);
      continue;
    }
    if (value === "}") {
      const brace = braces2[braces2.length - 1];
      if (opts.nobrace === true || !brace) {
        push({ type: "text", value, output: value });
        continue;
      }
      let output = ")";
      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];
        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === "brace") {
            break;
          }
          if (arr[i].type !== "dots") {
            range.unshift(arr[i].value);
          }
        }
        output = expandRange(range, opts);
        state.backtrack = true;
      }
      if (brace.comma !== true && brace.dots !== true) {
        const out2 = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = "\\{";
        value = output = "\\}";
        state.output = out2;
        for (const t of toks) {
          state.output += t.output || t.value;
        }
      }
      push({ type: "brace", value, output });
      decrement("braces");
      braces2.pop();
      continue;
    }
    if (value === "|") {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: "text", value });
      continue;
    }
    if (value === ",") {
      let output = value;
      const brace = braces2[braces2.length - 1];
      if (brace && stack[stack.length - 1] === "braces") {
        brace.comma = true;
        output = "|";
      }
      push({ type: "comma", value, output });
      continue;
    }
    if (value === "/") {
      if (prev.type === "dot" && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = "";
        state.output = "";
        tokens.pop();
        prev = bos;
        continue;
      }
      push({ type: "slash", value, output: SLASH_LITERAL2 });
      continue;
    }
    if (value === ".") {
      if (state.braces > 0 && prev.type === "dot") {
        if (prev.value === ".") prev.output = DOT_LITERAL2;
        const brace = braces2[braces2.length - 1];
        prev.type = "dots";
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }
      if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
        push({ type: "text", value, output: DOT_LITERAL2 });
        continue;
      }
      push({ type: "dot", value, output: DOT_LITERAL2 });
      continue;
    }
    if (value === "?") {
      const isGroup = prev && prev.value === "(";
      if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        extglobOpen("qmark", value);
        continue;
      }
      if (prev && prev.type === "paren") {
        const next = peek();
        let output = value;
        if (next === "<" && !utils$d.supportsLookbehinds()) {
          throw new Error("Node.js v10 or higher is required for regex lookbehinds");
        }
        if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
          output = `\\${value}`;
        }
        push({ type: "text", value, output });
        continue;
      }
      if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
        push({ type: "qmark", value, output: QMARK_NO_DOT2 });
        continue;
      }
      push({ type: "qmark", value, output: QMARK2 });
      continue;
    }
    if (value === "!") {
      if (opts.noextglob !== true && peek() === "(") {
        if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
          extglobOpen("negate", value);
          continue;
        }
      }
      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }
    if (value === "+") {
      if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        extglobOpen("plus", value);
        continue;
      }
      if (prev && prev.value === "(" || opts.regex === false) {
        push({ type: "plus", value, output: PLUS_LITERAL2 });
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
        push({ type: "plus", value });
        continue;
      }
      push({ type: "plus", value: PLUS_LITERAL2 });
      continue;
    }
    if (value === "@") {
      if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        push({ type: "at", extglob: true, value, output: "" });
        continue;
      }
      push({ type: "text", value });
      continue;
    }
    if (value !== "*") {
      if (value === "$" || value === "^") {
        value = `\\${value}`;
      }
      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }
      push({ type: "text", value });
      continue;
    }
    if (prev && (prev.type === "globstar" || prev.star === true)) {
      prev.type = "star";
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }
    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen("star", value);
      continue;
    }
    if (prev.type === "star") {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }
      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === "slash" || prior.type === "bos";
      const afterStar = before && (before.type === "star" || before.type === "globstar");
      if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
        push({ type: "star", value, output: "" });
        continue;
      }
      const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
      const isExtglob3 = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
      if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob3) {
        push({ type: "star", value, output: "" });
        continue;
      }
      while (rest.slice(0, 3) === "/**") {
        const after = input[state.index + 4];
        if (after && after !== "/") {
          break;
        }
        rest = rest.slice(3);
        consume("/**", 3);
      }
      if (prior.type === "bos" && eos()) {
        prev.type = "globstar";
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }
      if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;
        prev.type = "globstar";
        prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }
      if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
        const end = rest[1] !== void 0 ? "|$" : "";
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;
        prev.type = "globstar";
        prev.output = `${globstar(opts)}${SLASH_LITERAL2}|${SLASH_LITERAL2}${end})`;
        prev.value += value;
        state.output += prior.output + prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: "slash", value: "/", output: "" });
        continue;
      }
      if (prior.type === "bos" && rest[0] === "/") {
        prev.type = "globstar";
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL2}|${globstar(opts)}${SLASH_LITERAL2})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: "slash", value: "/", output: "" });
        continue;
      }
      state.output = state.output.slice(0, -prev.output.length);
      prev.type = "globstar";
      prev.output = globstar(opts);
      prev.value += value;
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }
    const token = { type: "star", value, output: star };
    if (opts.bash === true) {
      token.output = ".*?";
      if (prev.type === "bos" || prev.type === "slash") {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }
    if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }
    if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
      if (prev.type === "dot") {
        state.output += NO_DOT_SLASH2;
        prev.output += NO_DOT_SLASH2;
      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH2;
        prev.output += NO_DOTS_SLASH2;
      } else {
        state.output += nodot;
        prev.output += nodot;
      }
      if (peek() !== "*") {
        state.output += ONE_CHAR2;
        prev.output += ONE_CHAR2;
      }
    }
    push(token);
  }
  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
    state.output = utils$d.escapeLast(state.output, "[");
    decrement("brackets");
  }
  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
    state.output = utils$d.escapeLast(state.output, "(");
    decrement("parens");
  }
  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
    state.output = utils$d.escapeLast(state.output, "{");
    decrement("braces");
  }
  if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
    push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL2}?` });
  }
  if (state.backtrack === true) {
    state.output = "";
    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;
      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }
  return state;
};
parse$1.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }
  input = REPLACEMENTS[input] || input;
  const win32 = utils$d.isWindows(options);
  const {
    DOT_LITERAL: DOT_LITERAL2,
    SLASH_LITERAL: SLASH_LITERAL2,
    ONE_CHAR: ONE_CHAR2,
    DOTS_SLASH: DOTS_SLASH2,
    NO_DOT: NO_DOT2,
    NO_DOTS: NO_DOTS2,
    NO_DOTS_SLASH: NO_DOTS_SLASH2,
    STAR: STAR2,
    START_ANCHOR: START_ANCHOR2
  } = constants$2.globChars(win32);
  const nodot = opts.dot ? NO_DOTS2 : NO_DOT2;
  const slashDot = opts.dot ? NO_DOTS_SLASH2 : NO_DOT2;
  const capture = opts.capture ? "" : "?:";
  const state = { negated: false, prefix: "" };
  let star = opts.bash === true ? ".*?" : STAR2;
  if (opts.capture) {
    star = `(${star})`;
  }
  const globstar = (opts2) => {
    if (opts2.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR2}${opts2.dot ? DOTS_SLASH2 : DOT_LITERAL2}).)*?)`;
  };
  const create = (str) => {
    switch (str) {
      case "*":
        return `${nodot}${ONE_CHAR2}${star}`;
      case ".*":
        return `${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      case "*.*":
        return `${nodot}${star}${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      case "*/*":
        return `${nodot}${star}${SLASH_LITERAL2}${ONE_CHAR2}${slashDot}${star}`;
      case "**":
        return nodot + globstar(opts);
      case "**/*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL2})?${slashDot}${ONE_CHAR2}${star}`;
      case "**/*.*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL2})?${slashDot}${star}${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      case "**/.*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL2})?${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;
        const source2 = create(match[1]);
        if (!source2) return;
        return source2 + DOT_LITERAL2 + match[2];
      }
    }
  };
  const output = utils$d.removePrefix(input, state);
  let source = create(output);
  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL2}?`;
  }
  return source;
};
var parse_1 = parse$1;
const path$6 = require$$0;
const scan = scan_1;
const parse = parse_1;
const utils$c = utils$f;
const constants$1 = constants$3;
const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
const picomatch$2 = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map((input) => picomatch$2(input, options, returnState));
    const arrayMatcher = (str) => {
      for (const isMatch of fns) {
        const state2 = isMatch(str);
        if (state2) return state2;
      }
      return false;
    };
    return arrayMatcher;
  }
  const isState = isObject(glob) && glob.tokens && glob.input;
  if (glob === "" || typeof glob !== "string" && !isState) {
    throw new TypeError("Expected pattern to be a non-empty string");
  }
  const opts = options || {};
  const posix = utils$c.isWindows(options);
  const regex = isState ? picomatch$2.compileRe(glob, options) : picomatch$2.makeRe(glob, options, false, true);
  const state = regex.state;
  delete regex.state;
  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch$2(opts.ignore, ignoreOpts, returnState);
  }
  const matcher2 = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch$2.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };
    if (typeof opts.onResult === "function") {
      opts.onResult(result);
    }
    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }
    if (isIgnored(input)) {
      if (typeof opts.onIgnore === "function") {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }
    if (typeof opts.onMatch === "function") {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };
  if (returnState) {
    matcher2.state = state;
  }
  return matcher2;
};
picomatch$2.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected input to be a string");
  }
  if (input === "") {
    return { isMatch: false, output: "" };
  }
  const opts = options || {};
  const format = opts.format || (posix ? utils$c.toPosixSlashes : null);
  let match = input === glob;
  let output = match && format ? format(input) : input;
  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }
  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch$2.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }
  return { isMatch: Boolean(match), match, output };
};
picomatch$2.matchBase = (input, glob, options, posix = utils$c.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch$2.makeRe(glob, options);
  return regex.test(path$6.basename(input));
};
picomatch$2.isMatch = (str, patterns, options) => picomatch$2(patterns, options)(str);
picomatch$2.parse = (pattern2, options) => {
  if (Array.isArray(pattern2)) return pattern2.map((p) => picomatch$2.parse(p, options));
  return parse(pattern2, { ...options, fastpaths: false });
};
picomatch$2.scan = (input, options) => scan(input, options);
picomatch$2.compileRe = (state, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return state.output;
  }
  const opts = options || {};
  const prepend = opts.contains ? "" : "^";
  const append2 = opts.contains ? "" : "$";
  let source = `${prepend}(?:${state.output})${append2}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }
  const regex = picomatch$2.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }
  return regex;
};
picomatch$2.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== "string") {
    throw new TypeError("Expected a non-empty string");
  }
  let parsed = { negated: false, fastpaths: true };
  if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
    parsed.output = parse.fastpaths(input, options);
  }
  if (!parsed.output) {
    parsed = parse(input, options);
  }
  return picomatch$2.compileRe(parsed, options, returnOutput, returnState);
};
picomatch$2.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};
picomatch$2.constants = constants$1;
var picomatch_1 = picomatch$2;
var picomatch$1 = picomatch_1;
const util = require$$0$1;
const braces = braces_1;
const picomatch = picomatch$1;
const utils$b = utils$f;
const isEmptyString = (v) => v === "" || v === "./";
const hasBraces = (v) => {
  const index = v.indexOf("{");
  return index > -1 && v.indexOf("}", index) > -1;
};
const micromatch$1 = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);
  let omit = /* @__PURE__ */ new Set();
  let keep = /* @__PURE__ */ new Set();
  let items = /* @__PURE__ */ new Set();
  let negatives = 0;
  let onResult = (state) => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };
  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;
    for (let item of list) {
      let matched = isMatch(item, true);
      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;
      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }
  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter((item) => !omit.has(item));
  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(", ")}"`);
    }
    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
    }
  }
  return matches;
};
micromatch$1.match = micromatch$1;
micromatch$1.matcher = (pattern2, options) => picomatch(pattern2, options);
micromatch$1.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
micromatch$1.any = micromatch$1.isMatch;
micromatch$1.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = /* @__PURE__ */ new Set();
  let items = [];
  let onResult = (state) => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };
  let matches = new Set(micromatch$1(list, patterns, { ...options, onResult }));
  for (let item of items) {
    if (!matches.has(item)) {
      result.add(item);
    }
  }
  return [...result];
};
micromatch$1.contains = (str, pattern2, options) => {
  if (typeof str !== "string") {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }
  if (Array.isArray(pattern2)) {
    return pattern2.some((p) => micromatch$1.contains(str, p, options));
  }
  if (typeof pattern2 === "string") {
    if (isEmptyString(str) || isEmptyString(pattern2)) {
      return false;
    }
    if (str.includes(pattern2) || str.startsWith("./") && str.slice(2).includes(pattern2)) {
      return true;
    }
  }
  return micromatch$1.isMatch(str, pattern2, { ...options, contains: true });
};
micromatch$1.matchKeys = (obj, patterns, options) => {
  if (!utils$b.isObject(obj)) {
    throw new TypeError("Expected the first argument to be an object");
  }
  let keys = micromatch$1(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};
micromatch$1.some = (list, patterns, options) => {
  let items = [].concat(list);
  for (let pattern2 of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern2), options);
    if (items.some((item) => isMatch(item))) {
      return true;
    }
  }
  return false;
};
micromatch$1.every = (list, patterns, options) => {
  let items = [].concat(list);
  for (let pattern2 of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern2), options);
    if (!items.every((item) => isMatch(item))) {
      return false;
    }
  }
  return true;
};
micromatch$1.all = (str, patterns, options) => {
  if (typeof str !== "string") {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }
  return [].concat(patterns).every((p) => picomatch(p, options)(str));
};
micromatch$1.capture = (glob, input, options) => {
  let posix = utils$b.isWindows(options);
  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils$b.toPosixSlashes(input) : input);
  if (match) {
    return match.slice(1).map((v) => v === void 0 ? "" : v);
  }
};
micromatch$1.makeRe = (...args) => picomatch.makeRe(...args);
micromatch$1.scan = (...args) => picomatch.scan(...args);
micromatch$1.parse = (patterns, options) => {
  let res = [];
  for (let pattern2 of [].concat(patterns || [])) {
    for (let str of braces(String(pattern2), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};
micromatch$1.braces = (pattern2, options) => {
  if (typeof pattern2 !== "string") throw new TypeError("Expected a string");
  if (options && options.nobrace === true || !hasBraces(pattern2)) {
    return [pattern2];
  }
  return braces(pattern2, options);
};
micromatch$1.braceExpand = (pattern2, options) => {
  if (typeof pattern2 !== "string") throw new TypeError("Expected a string");
  return micromatch$1.braces(pattern2, { ...options, expand: true });
};
micromatch$1.hasBraces = hasBraces;
var micromatch_1 = micromatch$1;
Object.defineProperty(pattern$1, "__esModule", { value: true });
pattern$1.removeDuplicateSlashes = pattern$1.matchAny = pattern$1.convertPatternsToRe = pattern$1.makeRe = pattern$1.getPatternParts = pattern$1.expandBraceExpansion = pattern$1.expandPatternsWithBraceExpansion = pattern$1.isAffectDepthOfReadingPattern = pattern$1.endsWithSlashGlobStar = pattern$1.hasGlobStar = pattern$1.getBaseDirectory = pattern$1.isPatternRelatedToParentDirectory = pattern$1.getPatternsOutsideCurrentDirectory = pattern$1.getPatternsInsideCurrentDirectory = pattern$1.getPositivePatterns = pattern$1.getNegativePatterns = pattern$1.isPositivePattern = pattern$1.isNegativePattern = pattern$1.convertToNegativePattern = pattern$1.convertToPositivePattern = pattern$1.isDynamicPattern = pattern$1.isStaticPattern = void 0;
const path$5 = require$$0;
const globParent2 = globParent$1;
const micromatch = micromatch_1;
const GLOBSTAR = "**";
const ESCAPE_SYMBOL = "\\";
const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
function isStaticPattern(pattern2, options = {}) {
  return !isDynamicPattern(pattern2, options);
}
pattern$1.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern2, options = {}) {
  if (pattern2 === "") {
    return false;
  }
  if (options.caseSensitiveMatch === false || pattern2.includes(ESCAPE_SYMBOL)) {
    return true;
  }
  if (COMMON_GLOB_SYMBOLS_RE.test(pattern2) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern2) || REGEX_GROUP_SYMBOLS_RE.test(pattern2)) {
    return true;
  }
  if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern2)) {
    return true;
  }
  if (options.braceExpansion !== false && hasBraceExpansion(pattern2)) {
    return true;
  }
  return false;
}
pattern$1.isDynamicPattern = isDynamicPattern;
function hasBraceExpansion(pattern2) {
  const openingBraceIndex = pattern2.indexOf("{");
  if (openingBraceIndex === -1) {
    return false;
  }
  const closingBraceIndex = pattern2.indexOf("}", openingBraceIndex + 1);
  if (closingBraceIndex === -1) {
    return false;
  }
  const braceContent = pattern2.slice(openingBraceIndex, closingBraceIndex);
  return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
}
function convertToPositivePattern(pattern2) {
  return isNegativePattern(pattern2) ? pattern2.slice(1) : pattern2;
}
pattern$1.convertToPositivePattern = convertToPositivePattern;
function convertToNegativePattern(pattern2) {
  return "!" + pattern2;
}
pattern$1.convertToNegativePattern = convertToNegativePattern;
function isNegativePattern(pattern2) {
  return pattern2.startsWith("!") && pattern2[1] !== "(";
}
pattern$1.isNegativePattern = isNegativePattern;
function isPositivePattern(pattern2) {
  return !isNegativePattern(pattern2);
}
pattern$1.isPositivePattern = isPositivePattern;
function getNegativePatterns(patterns) {
  return patterns.filter(isNegativePattern);
}
pattern$1.getNegativePatterns = getNegativePatterns;
function getPositivePatterns$1(patterns) {
  return patterns.filter(isPositivePattern);
}
pattern$1.getPositivePatterns = getPositivePatterns$1;
function getPatternsInsideCurrentDirectory(patterns) {
  return patterns.filter((pattern2) => !isPatternRelatedToParentDirectory(pattern2));
}
pattern$1.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
function getPatternsOutsideCurrentDirectory(patterns) {
  return patterns.filter(isPatternRelatedToParentDirectory);
}
pattern$1.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
function isPatternRelatedToParentDirectory(pattern2) {
  return pattern2.startsWith("..") || pattern2.startsWith("./..");
}
pattern$1.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
function getBaseDirectory(pattern2) {
  return globParent2(pattern2, { flipBackslashes: false });
}
pattern$1.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern2) {
  return pattern2.includes(GLOBSTAR);
}
pattern$1.hasGlobStar = hasGlobStar;
function endsWithSlashGlobStar(pattern2) {
  return pattern2.endsWith("/" + GLOBSTAR);
}
pattern$1.endsWithSlashGlobStar = endsWithSlashGlobStar;
function isAffectDepthOfReadingPattern(pattern2) {
  const basename = path$5.basename(pattern2);
  return endsWithSlashGlobStar(pattern2) || isStaticPattern(basename);
}
pattern$1.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
function expandPatternsWithBraceExpansion(patterns) {
  return patterns.reduce((collection, pattern2) => {
    return collection.concat(expandBraceExpansion(pattern2));
  }, []);
}
pattern$1.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
function expandBraceExpansion(pattern2) {
  const patterns = micromatch.braces(pattern2, { expand: true, nodupes: true, keepEscaping: true });
  patterns.sort((a, b) => a.length - b.length);
  return patterns.filter((pattern3) => pattern3 !== "");
}
pattern$1.expandBraceExpansion = expandBraceExpansion;
function getPatternParts(pattern2, options) {
  let { parts } = micromatch.scan(pattern2, Object.assign(Object.assign({}, options), { parts: true }));
  if (parts.length === 0) {
    parts = [pattern2];
  }
  if (parts[0].startsWith("/")) {
    parts[0] = parts[0].slice(1);
    parts.unshift("");
  }
  return parts;
}
pattern$1.getPatternParts = getPatternParts;
function makeRe(pattern2, options) {
  return micromatch.makeRe(pattern2, options);
}
pattern$1.makeRe = makeRe;
function convertPatternsToRe(patterns, options) {
  return patterns.map((pattern2) => makeRe(pattern2, options));
}
pattern$1.convertPatternsToRe = convertPatternsToRe;
function matchAny(entry2, patternsRe) {
  return patternsRe.some((patternRe) => patternRe.test(entry2));
}
pattern$1.matchAny = matchAny;
function removeDuplicateSlashes(pattern2) {
  return pattern2.replace(DOUBLE_SLASH_RE, "/");
}
pattern$1.removeDuplicateSlashes = removeDuplicateSlashes;
var stream$4 = {};
const Stream = require$$0$2;
const PassThrough = Stream.PassThrough;
const slice = Array.prototype.slice;
var merge2_1 = merge2$1;
function merge2$1() {
  const streamsQueue = [];
  const args = slice.call(arguments);
  let merging = false;
  let options = args[args.length - 1];
  if (options && !Array.isArray(options) && options.pipe == null) {
    args.pop();
  } else {
    options = {};
  }
  const doEnd = options.end !== false;
  const doPipeError = options.pipeError === true;
  if (options.objectMode == null) {
    options.objectMode = true;
  }
  if (options.highWaterMark == null) {
    options.highWaterMark = 64 * 1024;
  }
  const mergedStream = PassThrough(options);
  function addStream() {
    for (let i = 0, len = arguments.length; i < len; i++) {
      streamsQueue.push(pauseStreams(arguments[i], options));
    }
    mergeStream();
    return this;
  }
  function mergeStream() {
    if (merging) {
      return;
    }
    merging = true;
    let streams = streamsQueue.shift();
    if (!streams) {
      process.nextTick(endStream);
      return;
    }
    if (!Array.isArray(streams)) {
      streams = [streams];
    }
    let pipesCount = streams.length + 1;
    function next() {
      if (--pipesCount > 0) {
        return;
      }
      merging = false;
      mergeStream();
    }
    function pipe(stream2) {
      function onend() {
        stream2.removeListener("merge2UnpipeEnd", onend);
        stream2.removeListener("end", onend);
        if (doPipeError) {
          stream2.removeListener("error", onerror);
        }
        next();
      }
      function onerror(err) {
        mergedStream.emit("error", err);
      }
      if (stream2._readableState.endEmitted) {
        return next();
      }
      stream2.on("merge2UnpipeEnd", onend);
      stream2.on("end", onend);
      if (doPipeError) {
        stream2.on("error", onerror);
      }
      stream2.pipe(mergedStream, { end: false });
      stream2.resume();
    }
    for (let i = 0; i < streams.length; i++) {
      pipe(streams[i]);
    }
    next();
  }
  function endStream() {
    merging = false;
    mergedStream.emit("queueDrain");
    if (doEnd) {
      mergedStream.end();
    }
  }
  mergedStream.setMaxListeners(0);
  mergedStream.add = addStream;
  mergedStream.on("unpipe", function(stream2) {
    stream2.emit("merge2UnpipeEnd");
  });
  if (args.length) {
    addStream.apply(null, args);
  }
  return mergedStream;
}
function pauseStreams(streams, options) {
  if (!Array.isArray(streams)) {
    if (!streams._readableState && streams.pipe) {
      streams = streams.pipe(PassThrough(options));
    }
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error("Only readable stream can be merged.");
    }
    streams.pause();
  } else {
    for (let i = 0, len = streams.length; i < len; i++) {
      streams[i] = pauseStreams(streams[i], options);
    }
  }
  return streams;
}
Object.defineProperty(stream$4, "__esModule", { value: true });
stream$4.merge = void 0;
const merge2 = merge2_1;
function merge(streams) {
  const mergedStream = merge2(streams);
  streams.forEach((stream2) => {
    stream2.once("error", (error2) => mergedStream.emit("error", error2));
  });
  mergedStream.once("close", () => propagateCloseEventToSources(streams));
  mergedStream.once("end", () => propagateCloseEventToSources(streams));
  return mergedStream;
}
stream$4.merge = merge;
function propagateCloseEventToSources(streams) {
  streams.forEach((stream2) => stream2.emit("close"));
}
var string$1 = {};
Object.defineProperty(string$1, "__esModule", { value: true });
string$1.isEmpty = string$1.isString = void 0;
function isString(input) {
  return typeof input === "string";
}
string$1.isString = isString;
function isEmpty(input) {
  return input === "";
}
string$1.isEmpty = isEmpty;
Object.defineProperty(utils$k, "__esModule", { value: true });
utils$k.string = utils$k.stream = utils$k.pattern = utils$k.path = utils$k.fs = utils$k.errno = utils$k.array = void 0;
const array = array$1;
utils$k.array = array;
const errno = errno$1;
utils$k.errno = errno;
const fs$6 = fs$7;
utils$k.fs = fs$6;
const path$4 = path$9;
utils$k.path = path$4;
const pattern = pattern$1;
utils$k.pattern = pattern;
const stream$3 = stream$4;
utils$k.stream = stream$3;
const string = string$1;
utils$k.string = string;
Object.defineProperty(tasks, "__esModule", { value: true });
tasks.convertPatternGroupToTask = tasks.convertPatternGroupsToTasks = tasks.groupPatternsByBaseDirectory = tasks.getNegativePatternsAsPositive = tasks.getPositivePatterns = tasks.convertPatternsToTasks = tasks.generate = void 0;
const utils$a = utils$k;
function generate(input, settings2) {
  const patterns = processPatterns(input, settings2);
  const ignore = processPatterns(settings2.ignore, settings2);
  const positivePatterns = getPositivePatterns(patterns);
  const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
  const staticPatterns = positivePatterns.filter((pattern2) => utils$a.pattern.isStaticPattern(pattern2, settings2));
  const dynamicPatterns = positivePatterns.filter((pattern2) => utils$a.pattern.isDynamicPattern(pattern2, settings2));
  const staticTasks = convertPatternsToTasks(
    staticPatterns,
    negativePatterns,
    /* dynamic */
    false
  );
  const dynamicTasks = convertPatternsToTasks(
    dynamicPatterns,
    negativePatterns,
    /* dynamic */
    true
  );
  return staticTasks.concat(dynamicTasks);
}
tasks.generate = generate;
function processPatterns(input, settings2) {
  let patterns = input;
  if (settings2.braceExpansion) {
    patterns = utils$a.pattern.expandPatternsWithBraceExpansion(patterns);
  }
  if (settings2.baseNameMatch) {
    patterns = patterns.map((pattern2) => pattern2.includes("/") ? pattern2 : `**/${pattern2}`);
  }
  return patterns.map((pattern2) => utils$a.pattern.removeDuplicateSlashes(pattern2));
}
function convertPatternsToTasks(positive, negative, dynamic) {
  const tasks2 = [];
  const patternsOutsideCurrentDirectory = utils$a.pattern.getPatternsOutsideCurrentDirectory(positive);
  const patternsInsideCurrentDirectory = utils$a.pattern.getPatternsInsideCurrentDirectory(positive);
  const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
  const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
  tasks2.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
  if ("." in insideCurrentDirectoryGroup) {
    tasks2.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
  } else {
    tasks2.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
  }
  return tasks2;
}
tasks.convertPatternsToTasks = convertPatternsToTasks;
function getPositivePatterns(patterns) {
  return utils$a.pattern.getPositivePatterns(patterns);
}
tasks.getPositivePatterns = getPositivePatterns;
function getNegativePatternsAsPositive(patterns, ignore) {
  const negative = utils$a.pattern.getNegativePatterns(patterns).concat(ignore);
  const positive = negative.map(utils$a.pattern.convertToPositivePattern);
  return positive;
}
tasks.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
function groupPatternsByBaseDirectory(patterns) {
  const group = {};
  return patterns.reduce((collection, pattern2) => {
    const base = utils$a.pattern.getBaseDirectory(pattern2);
    if (base in collection) {
      collection[base].push(pattern2);
    } else {
      collection[base] = [pattern2];
    }
    return collection;
  }, group);
}
tasks.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
function convertPatternGroupsToTasks(positive, negative, dynamic) {
  return Object.keys(positive).map((base) => {
    return convertPatternGroupToTask(base, positive[base], negative, dynamic);
  });
}
tasks.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
function convertPatternGroupToTask(base, positive, negative, dynamic) {
  return {
    dynamic,
    positive,
    negative,
    base,
    patterns: [].concat(positive, negative.map(utils$a.pattern.convertToNegativePattern))
  };
}
tasks.convertPatternGroupToTask = convertPatternGroupToTask;
var async$7 = {};
var async$6 = {};
var out$2 = {};
var async$5 = {};
var async$4 = {};
var out$1 = {};
var async$3 = {};
var out = {};
var async$2 = {};
Object.defineProperty(async$2, "__esModule", { value: true });
async$2.read = void 0;
function read$3(path2, settings2, callback) {
  settings2.fs.lstat(path2, (lstatError, lstat) => {
    if (lstatError !== null) {
      callFailureCallback$2(callback, lstatError);
      return;
    }
    if (!lstat.isSymbolicLink() || !settings2.followSymbolicLink) {
      callSuccessCallback$2(callback, lstat);
      return;
    }
    settings2.fs.stat(path2, (statError, stat2) => {
      if (statError !== null) {
        if (settings2.throwErrorOnBrokenSymbolicLink) {
          callFailureCallback$2(callback, statError);
          return;
        }
        callSuccessCallback$2(callback, lstat);
        return;
      }
      if (settings2.markSymbolicLink) {
        stat2.isSymbolicLink = () => true;
      }
      callSuccessCallback$2(callback, stat2);
    });
  });
}
async$2.read = read$3;
function callFailureCallback$2(callback, error2) {
  callback(error2);
}
function callSuccessCallback$2(callback, result) {
  callback(null, result);
}
var sync$7 = {};
Object.defineProperty(sync$7, "__esModule", { value: true });
sync$7.read = void 0;
function read$2(path2, settings2) {
  const lstat = settings2.fs.lstatSync(path2);
  if (!lstat.isSymbolicLink() || !settings2.followSymbolicLink) {
    return lstat;
  }
  try {
    const stat2 = settings2.fs.statSync(path2);
    if (settings2.markSymbolicLink) {
      stat2.isSymbolicLink = () => true;
    }
    return stat2;
  } catch (error2) {
    if (!settings2.throwErrorOnBrokenSymbolicLink) {
      return lstat;
    }
    throw error2;
  }
}
sync$7.read = read$2;
var settings$3 = {};
var fs$5 = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
  const fs2 = require$$0$3;
  exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs2.lstat,
    stat: fs2.stat,
    lstatSync: fs2.lstatSync,
    statSync: fs2.statSync
  };
  function createFileSystemAdapter(fsMethods) {
    if (fsMethods === void 0) {
      return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
  }
  exports.createFileSystemAdapter = createFileSystemAdapter;
})(fs$5);
Object.defineProperty(settings$3, "__esModule", { value: true });
const fs$4 = fs$5;
let Settings$2 = class Settings {
  constructor(_options = {}) {
    this._options = _options;
    this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
    this.fs = fs$4.createFileSystemAdapter(this._options.fs);
    this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
    this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
  }
  _getValue(option, value) {
    return option !== null && option !== void 0 ? option : value;
  }
};
settings$3.default = Settings$2;
Object.defineProperty(out, "__esModule", { value: true });
out.statSync = out.stat = out.Settings = void 0;
const async$1 = async$2;
const sync$6 = sync$7;
const settings_1$3 = settings$3;
out.Settings = settings_1$3.default;
function stat(path2, optionsOrSettingsOrCallback, callback) {
  if (typeof optionsOrSettingsOrCallback === "function") {
    async$1.read(path2, getSettings$2(), optionsOrSettingsOrCallback);
    return;
  }
  async$1.read(path2, getSettings$2(optionsOrSettingsOrCallback), callback);
}
out.stat = stat;
function statSync(path2, optionsOrSettings) {
  const settings2 = getSettings$2(optionsOrSettings);
  return sync$6.read(path2, settings2);
}
out.statSync = statSync;
function getSettings$2(settingsOrOptions = {}) {
  if (settingsOrOptions instanceof settings_1$3.default) {
    return settingsOrOptions;
  }
  return new settings_1$3.default(settingsOrOptions);
}
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
let promise;
var queueMicrotask_1 = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : commonjsGlobal) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
  throw err;
}, 0));
/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var runParallel_1 = runParallel;
const queueMicrotask$1 = queueMicrotask_1;
function runParallel(tasks2, cb) {
  let results, pending, keys;
  let isSync = true;
  if (Array.isArray(tasks2)) {
    results = [];
    pending = tasks2.length;
  } else {
    keys = Object.keys(tasks2);
    results = {};
    pending = keys.length;
  }
  function done(err) {
    function end() {
      if (cb) cb(err, results);
      cb = null;
    }
    if (isSync) queueMicrotask$1(end);
    else end();
  }
  function each(i, err, result) {
    results[i] = result;
    if (--pending === 0 || err) {
      done(err);
    }
  }
  if (!pending) {
    done(null);
  } else if (keys) {
    keys.forEach(function(key) {
      tasks2[key](function(err, result) {
        each(key, err, result);
      });
    });
  } else {
    tasks2.forEach(function(task, i) {
      task(function(err, result) {
        each(i, err, result);
      });
    });
  }
  isSync = false;
}
var constants = {};
Object.defineProperty(constants, "__esModule", { value: true });
constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) {
  throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
}
const MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
const SUPPORTED_MAJOR_VERSION = 10;
const SUPPORTED_MINOR_VERSION = 10;
const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
var utils$9 = {};
var fs$3 = {};
Object.defineProperty(fs$3, "__esModule", { value: true });
fs$3.createDirentFromStats = void 0;
class DirentFromStats2 {
  constructor(name, stats) {
    this.name = name;
    this.isBlockDevice = stats.isBlockDevice.bind(stats);
    this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
    this.isDirectory = stats.isDirectory.bind(stats);
    this.isFIFO = stats.isFIFO.bind(stats);
    this.isFile = stats.isFile.bind(stats);
    this.isSocket = stats.isSocket.bind(stats);
    this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
  }
}
function createDirentFromStats(name, stats) {
  return new DirentFromStats2(name, stats);
}
fs$3.createDirentFromStats = createDirentFromStats;
Object.defineProperty(utils$9, "__esModule", { value: true });
utils$9.fs = void 0;
const fs$2 = fs$3;
utils$9.fs = fs$2;
var common$6 = {};
Object.defineProperty(common$6, "__esModule", { value: true });
common$6.joinPathSegments = void 0;
function joinPathSegments$1(a, b, separator) {
  if (a.endsWith(separator)) {
    return a + b;
  }
  return a + separator + b;
}
common$6.joinPathSegments = joinPathSegments$1;
Object.defineProperty(async$3, "__esModule", { value: true });
async$3.readdir = async$3.readdirWithFileTypes = async$3.read = void 0;
const fsStat$5 = out;
const rpl = runParallel_1;
const constants_1$1 = constants;
const utils$8 = utils$9;
const common$5 = common$6;
function read$1(directory, settings2, callback) {
  if (!settings2.stats && constants_1$1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
    readdirWithFileTypes$1(directory, settings2, callback);
    return;
  }
  readdir$1(directory, settings2, callback);
}
async$3.read = read$1;
function readdirWithFileTypes$1(directory, settings2, callback) {
  settings2.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
    if (readdirError !== null) {
      callFailureCallback$1(callback, readdirError);
      return;
    }
    const entries = dirents.map((dirent) => ({
      dirent,
      name: dirent.name,
      path: common$5.joinPathSegments(directory, dirent.name, settings2.pathSegmentSeparator)
    }));
    if (!settings2.followSymbolicLinks) {
      callSuccessCallback$1(callback, entries);
      return;
    }
    const tasks2 = entries.map((entry2) => makeRplTaskEntry(entry2, settings2));
    rpl(tasks2, (rplError, rplEntries) => {
      if (rplError !== null) {
        callFailureCallback$1(callback, rplError);
        return;
      }
      callSuccessCallback$1(callback, rplEntries);
    });
  });
}
async$3.readdirWithFileTypes = readdirWithFileTypes$1;
function makeRplTaskEntry(entry2, settings2) {
  return (done) => {
    if (!entry2.dirent.isSymbolicLink()) {
      done(null, entry2);
      return;
    }
    settings2.fs.stat(entry2.path, (statError, stats) => {
      if (statError !== null) {
        if (settings2.throwErrorOnBrokenSymbolicLink) {
          done(statError);
          return;
        }
        done(null, entry2);
        return;
      }
      entry2.dirent = utils$8.fs.createDirentFromStats(entry2.name, stats);
      done(null, entry2);
    });
  };
}
function readdir$1(directory, settings2, callback) {
  settings2.fs.readdir(directory, (readdirError, names) => {
    if (readdirError !== null) {
      callFailureCallback$1(callback, readdirError);
      return;
    }
    const tasks2 = names.map((name) => {
      const path2 = common$5.joinPathSegments(directory, name, settings2.pathSegmentSeparator);
      return (done) => {
        fsStat$5.stat(path2, settings2.fsStatSettings, (error2, stats) => {
          if (error2 !== null) {
            done(error2);
            return;
          }
          const entry2 = {
            name,
            path: path2,
            dirent: utils$8.fs.createDirentFromStats(name, stats)
          };
          if (settings2.stats) {
            entry2.stats = stats;
          }
          done(null, entry2);
        });
      };
    });
    rpl(tasks2, (rplError, entries) => {
      if (rplError !== null) {
        callFailureCallback$1(callback, rplError);
        return;
      }
      callSuccessCallback$1(callback, entries);
    });
  });
}
async$3.readdir = readdir$1;
function callFailureCallback$1(callback, error2) {
  callback(error2);
}
function callSuccessCallback$1(callback, result) {
  callback(null, result);
}
var sync$5 = {};
Object.defineProperty(sync$5, "__esModule", { value: true });
sync$5.readdir = sync$5.readdirWithFileTypes = sync$5.read = void 0;
const fsStat$4 = out;
const constants_1 = constants;
const utils$7 = utils$9;
const common$4 = common$6;
function read(directory, settings2) {
  if (!settings2.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
    return readdirWithFileTypes(directory, settings2);
  }
  return readdir(directory, settings2);
}
sync$5.read = read;
function readdirWithFileTypes(directory, settings2) {
  const dirents = settings2.fs.readdirSync(directory, { withFileTypes: true });
  return dirents.map((dirent) => {
    const entry2 = {
      dirent,
      name: dirent.name,
      path: common$4.joinPathSegments(directory, dirent.name, settings2.pathSegmentSeparator)
    };
    if (entry2.dirent.isSymbolicLink() && settings2.followSymbolicLinks) {
      try {
        const stats = settings2.fs.statSync(entry2.path);
        entry2.dirent = utils$7.fs.createDirentFromStats(entry2.name, stats);
      } catch (error2) {
        if (settings2.throwErrorOnBrokenSymbolicLink) {
          throw error2;
        }
      }
    }
    return entry2;
  });
}
sync$5.readdirWithFileTypes = readdirWithFileTypes;
function readdir(directory, settings2) {
  const names = settings2.fs.readdirSync(directory);
  return names.map((name) => {
    const entryPath = common$4.joinPathSegments(directory, name, settings2.pathSegmentSeparator);
    const stats = fsStat$4.statSync(entryPath, settings2.fsStatSettings);
    const entry2 = {
      name,
      path: entryPath,
      dirent: utils$7.fs.createDirentFromStats(name, stats)
    };
    if (settings2.stats) {
      entry2.stats = stats;
    }
    return entry2;
  });
}
sync$5.readdir = readdir;
var settings$2 = {};
var fs$1 = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
  const fs2 = require$$0$3;
  exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs2.lstat,
    stat: fs2.stat,
    lstatSync: fs2.lstatSync,
    statSync: fs2.statSync,
    readdir: fs2.readdir,
    readdirSync: fs2.readdirSync
  };
  function createFileSystemAdapter(fsMethods) {
    if (fsMethods === void 0) {
      return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
  }
  exports.createFileSystemAdapter = createFileSystemAdapter;
})(fs$1);
Object.defineProperty(settings$2, "__esModule", { value: true });
const path$3 = require$$0;
const fsStat$3 = out;
const fs = fs$1;
let Settings$1 = class Settings2 {
  constructor(_options = {}) {
    this._options = _options;
    this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
    this.fs = fs.createFileSystemAdapter(this._options.fs);
    this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$3.sep);
    this.stats = this._getValue(this._options.stats, false);
    this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    this.fsStatSettings = new fsStat$3.Settings({
      followSymbolicLink: this.followSymbolicLinks,
      fs: this.fs,
      throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
    });
  }
  _getValue(option, value) {
    return option !== null && option !== void 0 ? option : value;
  }
};
settings$2.default = Settings$1;
Object.defineProperty(out$1, "__esModule", { value: true });
out$1.Settings = out$1.scandirSync = out$1.scandir = void 0;
const async = async$3;
const sync$4 = sync$5;
const settings_1$2 = settings$2;
out$1.Settings = settings_1$2.default;
function scandir(path2, optionsOrSettingsOrCallback, callback) {
  if (typeof optionsOrSettingsOrCallback === "function") {
    async.read(path2, getSettings$1(), optionsOrSettingsOrCallback);
    return;
  }
  async.read(path2, getSettings$1(optionsOrSettingsOrCallback), callback);
}
out$1.scandir = scandir;
function scandirSync(path2, optionsOrSettings) {
  const settings2 = getSettings$1(optionsOrSettings);
  return sync$4.read(path2, settings2);
}
out$1.scandirSync = scandirSync;
function getSettings$1(settingsOrOptions = {}) {
  if (settingsOrOptions instanceof settings_1$2.default) {
    return settingsOrOptions;
  }
  return new settings_1$2.default(settingsOrOptions);
}
var queue = { exports: {} };
function reusify$1(Constructor) {
  var head = new Constructor();
  var tail = head;
  function get() {
    var current = head;
    if (current.next) {
      head = current.next;
    } else {
      head = new Constructor();
      tail = head;
    }
    current.next = null;
    return current;
  }
  function release(obj) {
    tail.next = obj;
    tail = obj;
  }
  return {
    get,
    release
  };
}
var reusify_1 = reusify$1;
var reusify = reusify_1;
function fastqueue(context, worker, _concurrency) {
  if (typeof context === "function") {
    _concurrency = worker;
    worker = context;
    context = null;
  }
  if (!(_concurrency >= 1)) {
    throw new Error("fastqueue concurrency must be equal to or greater than 1");
  }
  var cache = reusify(Task);
  var queueHead = null;
  var queueTail = null;
  var _running = 0;
  var errorHandler = null;
  var self = {
    push,
    drain: noop,
    saturated: noop,
    pause,
    paused: false,
    get concurrency() {
      return _concurrency;
    },
    set concurrency(value) {
      if (!(value >= 1)) {
        throw new Error("fastqueue concurrency must be equal to or greater than 1");
      }
      _concurrency = value;
      if (self.paused) return;
      for (; queueHead && _running < _concurrency; ) {
        _running++;
        release();
      }
    },
    running,
    resume,
    idle,
    length,
    getQueue,
    unshift,
    empty: noop,
    kill,
    killAndDrain,
    error: error2
  };
  return self;
  function running() {
    return _running;
  }
  function pause() {
    self.paused = true;
  }
  function length() {
    var current = queueHead;
    var counter = 0;
    while (current) {
      current = current.next;
      counter++;
    }
    return counter;
  }
  function getQueue() {
    var current = queueHead;
    var tasks2 = [];
    while (current) {
      tasks2.push(current.value);
      current = current.next;
    }
    return tasks2;
  }
  function resume() {
    if (!self.paused) return;
    self.paused = false;
    if (queueHead === null) {
      _running++;
      release();
      return;
    }
    for (; queueHead && _running < _concurrency; ) {
      _running++;
      release();
    }
  }
  function idle() {
    return _running === 0 && self.length() === 0;
  }
  function push(value, done) {
    var current = cache.get();
    current.context = context;
    current.release = release;
    current.value = value;
    current.callback = done || noop;
    current.errorHandler = errorHandler;
    if (_running >= _concurrency || self.paused) {
      if (queueTail) {
        queueTail.next = current;
        queueTail = current;
      } else {
        queueHead = current;
        queueTail = current;
        self.saturated();
      }
    } else {
      _running++;
      worker.call(context, current.value, current.worked);
    }
  }
  function unshift(value, done) {
    var current = cache.get();
    current.context = context;
    current.release = release;
    current.value = value;
    current.callback = done || noop;
    current.errorHandler = errorHandler;
    if (_running >= _concurrency || self.paused) {
      if (queueHead) {
        current.next = queueHead;
        queueHead = current;
      } else {
        queueHead = current;
        queueTail = current;
        self.saturated();
      }
    } else {
      _running++;
      worker.call(context, current.value, current.worked);
    }
  }
  function release(holder) {
    if (holder) {
      cache.release(holder);
    }
    var next = queueHead;
    if (next && _running <= _concurrency) {
      if (!self.paused) {
        if (queueTail === queueHead) {
          queueTail = null;
        }
        queueHead = next.next;
        next.next = null;
        worker.call(context, next.value, next.worked);
        if (queueTail === null) {
          self.empty();
        }
      } else {
        _running--;
      }
    } else if (--_running === 0) {
      self.drain();
    }
  }
  function kill() {
    queueHead = null;
    queueTail = null;
    self.drain = noop;
  }
  function killAndDrain() {
    queueHead = null;
    queueTail = null;
    self.drain();
    self.drain = noop;
  }
  function error2(handler) {
    errorHandler = handler;
  }
}
function noop() {
}
function Task() {
  this.value = null;
  this.callback = noop;
  this.next = null;
  this.release = noop;
  this.context = null;
  this.errorHandler = null;
  var self = this;
  this.worked = function worked(err, result) {
    var callback = self.callback;
    var errorHandler = self.errorHandler;
    var val = self.value;
    self.value = null;
    self.callback = noop;
    if (self.errorHandler) {
      errorHandler(err, val);
    }
    callback.call(self.context, err, result);
    self.release(self);
  };
}
function queueAsPromised(context, worker, _concurrency) {
  if (typeof context === "function") {
    _concurrency = worker;
    worker = context;
    context = null;
  }
  function asyncWrapper(arg, cb) {
    worker.call(this, arg).then(function(res) {
      cb(null, res);
    }, cb);
  }
  var queue2 = fastqueue(context, asyncWrapper, _concurrency);
  var pushCb = queue2.push;
  var unshiftCb = queue2.unshift;
  queue2.push = push;
  queue2.unshift = unshift;
  queue2.drained = drained;
  return queue2;
  function push(value) {
    var p = new Promise(function(resolve, reject) {
      pushCb(value, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
    p.catch(noop);
    return p;
  }
  function unshift(value) {
    var p = new Promise(function(resolve, reject) {
      unshiftCb(value, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
    p.catch(noop);
    return p;
  }
  function drained() {
    if (queue2.idle()) {
      return new Promise(function(resolve) {
        resolve();
      });
    }
    var previousDrain = queue2.drain;
    var p = new Promise(function(resolve) {
      queue2.drain = function() {
        previousDrain();
        resolve();
      };
    });
    return p;
  }
}
queue.exports = fastqueue;
queue.exports.promise = queueAsPromised;
var queueExports = queue.exports;
var common$3 = {};
Object.defineProperty(common$3, "__esModule", { value: true });
common$3.joinPathSegments = common$3.replacePathSegmentSeparator = common$3.isAppliedFilter = common$3.isFatalError = void 0;
function isFatalError(settings2, error2) {
  if (settings2.errorFilter === null) {
    return true;
  }
  return !settings2.errorFilter(error2);
}
common$3.isFatalError = isFatalError;
function isAppliedFilter(filter, value) {
  return filter === null || filter(value);
}
common$3.isAppliedFilter = isAppliedFilter;
function replacePathSegmentSeparator(filepath, separator) {
  return filepath.split(/[/\\]/).join(separator);
}
common$3.replacePathSegmentSeparator = replacePathSegmentSeparator;
function joinPathSegments(a, b, separator) {
  if (a === "") {
    return b;
  }
  if (a.endsWith(separator)) {
    return a + b;
  }
  return a + separator + b;
}
common$3.joinPathSegments = joinPathSegments;
var reader$1 = {};
Object.defineProperty(reader$1, "__esModule", { value: true });
const common$2 = common$3;
let Reader$1 = class Reader {
  constructor(_root, _settings) {
    this._root = _root;
    this._settings = _settings;
    this._root = common$2.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
  }
};
reader$1.default = Reader$1;
Object.defineProperty(async$4, "__esModule", { value: true });
const events_1 = require$$0$4;
const fsScandir$2 = out$1;
const fastq = queueExports;
const common$1 = common$3;
const reader_1$4 = reader$1;
class AsyncReader extends reader_1$4.default {
  constructor(_root, _settings) {
    super(_root, _settings);
    this._settings = _settings;
    this._scandir = fsScandir$2.scandir;
    this._emitter = new events_1.EventEmitter();
    this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
    this._isFatalError = false;
    this._isDestroyed = false;
    this._queue.drain = () => {
      if (!this._isFatalError) {
        this._emitter.emit("end");
      }
    };
  }
  read() {
    this._isFatalError = false;
    this._isDestroyed = false;
    setImmediate(() => {
      this._pushToQueue(this._root, this._settings.basePath);
    });
    return this._emitter;
  }
  get isDestroyed() {
    return this._isDestroyed;
  }
  destroy() {
    if (this._isDestroyed) {
      throw new Error("The reader is already destroyed");
    }
    this._isDestroyed = true;
    this._queue.killAndDrain();
  }
  onEntry(callback) {
    this._emitter.on("entry", callback);
  }
  onError(callback) {
    this._emitter.once("error", callback);
  }
  onEnd(callback) {
    this._emitter.once("end", callback);
  }
  _pushToQueue(directory, base) {
    const queueItem = { directory, base };
    this._queue.push(queueItem, (error2) => {
      if (error2 !== null) {
        this._handleError(error2);
      }
    });
  }
  _worker(item, done) {
    this._scandir(item.directory, this._settings.fsScandirSettings, (error2, entries) => {
      if (error2 !== null) {
        done(error2, void 0);
        return;
      }
      for (const entry2 of entries) {
        this._handleEntry(entry2, item.base);
      }
      done(null, void 0);
    });
  }
  _handleError(error2) {
    if (this._isDestroyed || !common$1.isFatalError(this._settings, error2)) {
      return;
    }
    this._isFatalError = true;
    this._isDestroyed = true;
    this._emitter.emit("error", error2);
  }
  _handleEntry(entry2, base) {
    if (this._isDestroyed || this._isFatalError) {
      return;
    }
    const fullpath = entry2.path;
    if (base !== void 0) {
      entry2.path = common$1.joinPathSegments(base, entry2.name, this._settings.pathSegmentSeparator);
    }
    if (common$1.isAppliedFilter(this._settings.entryFilter, entry2)) {
      this._emitEntry(entry2);
    }
    if (entry2.dirent.isDirectory() && common$1.isAppliedFilter(this._settings.deepFilter, entry2)) {
      this._pushToQueue(fullpath, base === void 0 ? void 0 : entry2.path);
    }
  }
  _emitEntry(entry2) {
    this._emitter.emit("entry", entry2);
  }
}
async$4.default = AsyncReader;
Object.defineProperty(async$5, "__esModule", { value: true });
const async_1$4 = async$4;
class AsyncProvider {
  constructor(_root, _settings) {
    this._root = _root;
    this._settings = _settings;
    this._reader = new async_1$4.default(this._root, this._settings);
    this._storage = [];
  }
  read(callback) {
    this._reader.onError((error2) => {
      callFailureCallback(callback, error2);
    });
    this._reader.onEntry((entry2) => {
      this._storage.push(entry2);
    });
    this._reader.onEnd(() => {
      callSuccessCallback(callback, this._storage);
    });
    this._reader.read();
  }
}
async$5.default = AsyncProvider;
function callFailureCallback(callback, error2) {
  callback(error2);
}
function callSuccessCallback(callback, entries) {
  callback(null, entries);
}
var stream$2 = {};
Object.defineProperty(stream$2, "__esModule", { value: true });
const stream_1$5 = require$$0$2;
const async_1$3 = async$4;
class StreamProvider {
  constructor(_root, _settings) {
    this._root = _root;
    this._settings = _settings;
    this._reader = new async_1$3.default(this._root, this._settings);
    this._stream = new stream_1$5.Readable({
      objectMode: true,
      read: () => {
      },
      destroy: () => {
        if (!this._reader.isDestroyed) {
          this._reader.destroy();
        }
      }
    });
  }
  read() {
    this._reader.onError((error2) => {
      this._stream.emit("error", error2);
    });
    this._reader.onEntry((entry2) => {
      this._stream.push(entry2);
    });
    this._reader.onEnd(() => {
      this._stream.push(null);
    });
    this._reader.read();
    return this._stream;
  }
}
stream$2.default = StreamProvider;
var sync$3 = {};
var sync$2 = {};
Object.defineProperty(sync$2, "__esModule", { value: true });
const fsScandir$1 = out$1;
const common = common$3;
const reader_1$3 = reader$1;
class SyncReader extends reader_1$3.default {
  constructor() {
    super(...arguments);
    this._scandir = fsScandir$1.scandirSync;
    this._storage = [];
    this._queue = /* @__PURE__ */ new Set();
  }
  read() {
    this._pushToQueue(this._root, this._settings.basePath);
    this._handleQueue();
    return this._storage;
  }
  _pushToQueue(directory, base) {
    this._queue.add({ directory, base });
  }
  _handleQueue() {
    for (const item of this._queue.values()) {
      this._handleDirectory(item.directory, item.base);
    }
  }
  _handleDirectory(directory, base) {
    try {
      const entries = this._scandir(directory, this._settings.fsScandirSettings);
      for (const entry2 of entries) {
        this._handleEntry(entry2, base);
      }
    } catch (error2) {
      this._handleError(error2);
    }
  }
  _handleError(error2) {
    if (!common.isFatalError(this._settings, error2)) {
      return;
    }
    throw error2;
  }
  _handleEntry(entry2, base) {
    const fullpath = entry2.path;
    if (base !== void 0) {
      entry2.path = common.joinPathSegments(base, entry2.name, this._settings.pathSegmentSeparator);
    }
    if (common.isAppliedFilter(this._settings.entryFilter, entry2)) {
      this._pushToStorage(entry2);
    }
    if (entry2.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry2)) {
      this._pushToQueue(fullpath, base === void 0 ? void 0 : entry2.path);
    }
  }
  _pushToStorage(entry2) {
    this._storage.push(entry2);
  }
}
sync$2.default = SyncReader;
Object.defineProperty(sync$3, "__esModule", { value: true });
const sync_1$3 = sync$2;
class SyncProvider {
  constructor(_root, _settings) {
    this._root = _root;
    this._settings = _settings;
    this._reader = new sync_1$3.default(this._root, this._settings);
  }
  read() {
    return this._reader.read();
  }
}
sync$3.default = SyncProvider;
var settings$1 = {};
Object.defineProperty(settings$1, "__esModule", { value: true });
const path$2 = require$$0;
const fsScandir = out$1;
class Settings3 {
  constructor(_options = {}) {
    this._options = _options;
    this.basePath = this._getValue(this._options.basePath, void 0);
    this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
    this.deepFilter = this._getValue(this._options.deepFilter, null);
    this.entryFilter = this._getValue(this._options.entryFilter, null);
    this.errorFilter = this._getValue(this._options.errorFilter, null);
    this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$2.sep);
    this.fsScandirSettings = new fsScandir.Settings({
      followSymbolicLinks: this._options.followSymbolicLinks,
      fs: this._options.fs,
      pathSegmentSeparator: this._options.pathSegmentSeparator,
      stats: this._options.stats,
      throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
    });
  }
  _getValue(option, value) {
    return option !== null && option !== void 0 ? option : value;
  }
}
settings$1.default = Settings3;
Object.defineProperty(out$2, "__esModule", { value: true });
out$2.Settings = out$2.walkStream = out$2.walkSync = out$2.walk = void 0;
const async_1$2 = async$5;
const stream_1$4 = stream$2;
const sync_1$2 = sync$3;
const settings_1$1 = settings$1;
out$2.Settings = settings_1$1.default;
function walk(directory, optionsOrSettingsOrCallback, callback) {
  if (typeof optionsOrSettingsOrCallback === "function") {
    new async_1$2.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
    return;
  }
  new async_1$2.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
out$2.walk = walk;
function walkSync(directory, optionsOrSettings) {
  const settings2 = getSettings(optionsOrSettings);
  const provider2 = new sync_1$2.default(directory, settings2);
  return provider2.read();
}
out$2.walkSync = walkSync;
function walkStream(directory, optionsOrSettings) {
  const settings2 = getSettings(optionsOrSettings);
  const provider2 = new stream_1$4.default(directory, settings2);
  return provider2.read();
}
out$2.walkStream = walkStream;
function getSettings(settingsOrOptions = {}) {
  if (settingsOrOptions instanceof settings_1$1.default) {
    return settingsOrOptions;
  }
  return new settings_1$1.default(settingsOrOptions);
}
var reader = {};
Object.defineProperty(reader, "__esModule", { value: true });
const path$1 = require$$0;
const fsStat$2 = out;
const utils$6 = utils$k;
class Reader2 {
  constructor(_settings) {
    this._settings = _settings;
    this._fsStatSettings = new fsStat$2.Settings({
      followSymbolicLink: this._settings.followSymbolicLinks,
      fs: this._settings.fs,
      throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
    });
  }
  _getFullEntryPath(filepath) {
    return path$1.resolve(this._settings.cwd, filepath);
  }
  _makeEntry(stats, pattern2) {
    const entry2 = {
      name: pattern2,
      path: pattern2,
      dirent: utils$6.fs.createDirentFromStats(pattern2, stats)
    };
    if (this._settings.stats) {
      entry2.stats = stats;
    }
    return entry2;
  }
  _isFatalError(error2) {
    return !utils$6.errno.isEnoentCodeError(error2) && !this._settings.suppressErrors;
  }
}
reader.default = Reader2;
var stream$1 = {};
Object.defineProperty(stream$1, "__esModule", { value: true });
const stream_1$3 = require$$0$2;
const fsStat$1 = out;
const fsWalk$2 = out$2;
const reader_1$2 = reader;
class ReaderStream extends reader_1$2.default {
  constructor() {
    super(...arguments);
    this._walkStream = fsWalk$2.walkStream;
    this._stat = fsStat$1.stat;
  }
  dynamic(root, options) {
    return this._walkStream(root, options);
  }
  static(patterns, options) {
    const filepaths = patterns.map(this._getFullEntryPath, this);
    const stream2 = new stream_1$3.PassThrough({ objectMode: true });
    stream2._write = (index, _enc, done) => {
      return this._getEntry(filepaths[index], patterns[index], options).then((entry2) => {
        if (entry2 !== null && options.entryFilter(entry2)) {
          stream2.push(entry2);
        }
        if (index === filepaths.length - 1) {
          stream2.end();
        }
        done();
      }).catch(done);
    };
    for (let i = 0; i < filepaths.length; i++) {
      stream2.write(i);
    }
    return stream2;
  }
  _getEntry(filepath, pattern2, options) {
    return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern2)).catch((error2) => {
      if (options.errorFilter(error2)) {
        return null;
      }
      throw error2;
    });
  }
  _getStat(filepath) {
    return new Promise((resolve, reject) => {
      this._stat(filepath, this._fsStatSettings, (error2, stats) => {
        return error2 === null ? resolve(stats) : reject(error2);
      });
    });
  }
}
stream$1.default = ReaderStream;
Object.defineProperty(async$6, "__esModule", { value: true });
const fsWalk$1 = out$2;
const reader_1$1 = reader;
const stream_1$2 = stream$1;
class ReaderAsync extends reader_1$1.default {
  constructor() {
    super(...arguments);
    this._walkAsync = fsWalk$1.walk;
    this._readerStream = new stream_1$2.default(this._settings);
  }
  dynamic(root, options) {
    return new Promise((resolve, reject) => {
      this._walkAsync(root, options, (error2, entries) => {
        if (error2 === null) {
          resolve(entries);
        } else {
          reject(error2);
        }
      });
    });
  }
  async static(patterns, options) {
    const entries = [];
    const stream2 = this._readerStream.static(patterns, options);
    return new Promise((resolve, reject) => {
      stream2.once("error", reject);
      stream2.on("data", (entry2) => entries.push(entry2));
      stream2.once("end", () => resolve(entries));
    });
  }
}
async$6.default = ReaderAsync;
var provider = {};
var deep = {};
var partial = {};
var matcher = {};
Object.defineProperty(matcher, "__esModule", { value: true });
const utils$5 = utils$k;
class Matcher {
  constructor(_patterns, _settings, _micromatchOptions) {
    this._patterns = _patterns;
    this._settings = _settings;
    this._micromatchOptions = _micromatchOptions;
    this._storage = [];
    this._fillStorage();
  }
  _fillStorage() {
    for (const pattern2 of this._patterns) {
      const segments = this._getPatternSegments(pattern2);
      const sections = this._splitSegmentsIntoSections(segments);
      this._storage.push({
        complete: sections.length <= 1,
        pattern: pattern2,
        segments,
        sections
      });
    }
  }
  _getPatternSegments(pattern2) {
    const parts = utils$5.pattern.getPatternParts(pattern2, this._micromatchOptions);
    return parts.map((part) => {
      const dynamic = utils$5.pattern.isDynamicPattern(part, this._settings);
      if (!dynamic) {
        return {
          dynamic: false,
          pattern: part
        };
      }
      return {
        dynamic: true,
        pattern: part,
        patternRe: utils$5.pattern.makeRe(part, this._micromatchOptions)
      };
    });
  }
  _splitSegmentsIntoSections(segments) {
    return utils$5.array.splitWhen(segments, (segment) => segment.dynamic && utils$5.pattern.hasGlobStar(segment.pattern));
  }
}
matcher.default = Matcher;
Object.defineProperty(partial, "__esModule", { value: true });
const matcher_1 = matcher;
class PartialMatcher extends matcher_1.default {
  match(filepath) {
    const parts = filepath.split("/");
    const levels2 = parts.length;
    const patterns = this._storage.filter((info2) => !info2.complete || info2.segments.length > levels2);
    for (const pattern2 of patterns) {
      const section = pattern2.sections[0];
      if (!pattern2.complete && levels2 > section.length) {
        return true;
      }
      const match = parts.every((part, index) => {
        const segment = pattern2.segments[index];
        if (segment.dynamic && segment.patternRe.test(part)) {
          return true;
        }
        if (!segment.dynamic && segment.pattern === part) {
          return true;
        }
        return false;
      });
      if (match) {
        return true;
      }
    }
    return false;
  }
}
partial.default = PartialMatcher;
Object.defineProperty(deep, "__esModule", { value: true });
const utils$4 = utils$k;
const partial_1 = partial;
class DeepFilter {
  constructor(_settings, _micromatchOptions) {
    this._settings = _settings;
    this._micromatchOptions = _micromatchOptions;
  }
  getFilter(basePath, positive, negative) {
    const matcher2 = this._getMatcher(positive);
    const negativeRe = this._getNegativePatternsRe(negative);
    return (entry2) => this._filter(basePath, entry2, matcher2, negativeRe);
  }
  _getMatcher(patterns) {
    return new partial_1.default(patterns, this._settings, this._micromatchOptions);
  }
  _getNegativePatternsRe(patterns) {
    const affectDepthOfReadingPatterns = patterns.filter(utils$4.pattern.isAffectDepthOfReadingPattern);
    return utils$4.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
  }
  _filter(basePath, entry2, matcher2, negativeRe) {
    if (this._isSkippedByDeep(basePath, entry2.path)) {
      return false;
    }
    if (this._isSkippedSymbolicLink(entry2)) {
      return false;
    }
    const filepath = utils$4.path.removeLeadingDotSegment(entry2.path);
    if (this._isSkippedByPositivePatterns(filepath, matcher2)) {
      return false;
    }
    return this._isSkippedByNegativePatterns(filepath, negativeRe);
  }
  _isSkippedByDeep(basePath, entryPath) {
    if (this._settings.deep === Infinity) {
      return false;
    }
    return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
  }
  _getEntryLevel(basePath, entryPath) {
    const entryPathDepth = entryPath.split("/").length;
    if (basePath === "") {
      return entryPathDepth;
    }
    const basePathDepth = basePath.split("/").length;
    return entryPathDepth - basePathDepth;
  }
  _isSkippedSymbolicLink(entry2) {
    return !this._settings.followSymbolicLinks && entry2.dirent.isSymbolicLink();
  }
  _isSkippedByPositivePatterns(entryPath, matcher2) {
    return !this._settings.baseNameMatch && !matcher2.match(entryPath);
  }
  _isSkippedByNegativePatterns(entryPath, patternsRe) {
    return !utils$4.pattern.matchAny(entryPath, patternsRe);
  }
}
deep.default = DeepFilter;
var entry$1 = {};
Object.defineProperty(entry$1, "__esModule", { value: true });
const utils$3 = utils$k;
class EntryFilter {
  constructor(_settings, _micromatchOptions) {
    this._settings = _settings;
    this._micromatchOptions = _micromatchOptions;
    this.index = /* @__PURE__ */ new Map();
  }
  getFilter(positive, negative) {
    const positiveRe = utils$3.pattern.convertPatternsToRe(positive, this._micromatchOptions);
    const negativeRe = utils$3.pattern.convertPatternsToRe(negative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }));
    return (entry2) => this._filter(entry2, positiveRe, negativeRe);
  }
  _filter(entry2, positiveRe, negativeRe) {
    const filepath = utils$3.path.removeLeadingDotSegment(entry2.path);
    if (this._settings.unique && this._isDuplicateEntry(filepath)) {
      return false;
    }
    if (this._onlyFileFilter(entry2) || this._onlyDirectoryFilter(entry2)) {
      return false;
    }
    if (this._isSkippedByAbsoluteNegativePatterns(filepath, negativeRe)) {
      return false;
    }
    const isDirectory = entry2.dirent.isDirectory();
    const isMatched = this._isMatchToPatterns(filepath, positiveRe, isDirectory) && !this._isMatchToPatterns(filepath, negativeRe, isDirectory);
    if (this._settings.unique && isMatched) {
      this._createIndexRecord(filepath);
    }
    return isMatched;
  }
  _isDuplicateEntry(filepath) {
    return this.index.has(filepath);
  }
  _createIndexRecord(filepath) {
    this.index.set(filepath, void 0);
  }
  _onlyFileFilter(entry2) {
    return this._settings.onlyFiles && !entry2.dirent.isFile();
  }
  _onlyDirectoryFilter(entry2) {
    return this._settings.onlyDirectories && !entry2.dirent.isDirectory();
  }
  _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
    if (!this._settings.absolute) {
      return false;
    }
    const fullpath = utils$3.path.makeAbsolute(this._settings.cwd, entryPath);
    return utils$3.pattern.matchAny(fullpath, patternsRe);
  }
  _isMatchToPatterns(filepath, patternsRe, isDirectory) {
    const isMatched = utils$3.pattern.matchAny(filepath, patternsRe);
    if (!isMatched && isDirectory) {
      return utils$3.pattern.matchAny(filepath + "/", patternsRe);
    }
    return isMatched;
  }
}
entry$1.default = EntryFilter;
var error = {};
Object.defineProperty(error, "__esModule", { value: true });
const utils$2 = utils$k;
class ErrorFilter {
  constructor(_settings) {
    this._settings = _settings;
  }
  getFilter() {
    return (error2) => this._isNonFatalError(error2);
  }
  _isNonFatalError(error2) {
    return utils$2.errno.isEnoentCodeError(error2) || this._settings.suppressErrors;
  }
}
error.default = ErrorFilter;
var entry = {};
Object.defineProperty(entry, "__esModule", { value: true });
const utils$1 = utils$k;
class EntryTransformer {
  constructor(_settings) {
    this._settings = _settings;
  }
  getTransformer() {
    return (entry2) => this._transform(entry2);
  }
  _transform(entry2) {
    let filepath = entry2.path;
    if (this._settings.absolute) {
      filepath = utils$1.path.makeAbsolute(this._settings.cwd, filepath);
      filepath = utils$1.path.unixify(filepath);
    }
    if (this._settings.markDirectories && entry2.dirent.isDirectory()) {
      filepath += "/";
    }
    if (!this._settings.objectMode) {
      return filepath;
    }
    return Object.assign(Object.assign({}, entry2), { path: filepath });
  }
}
entry.default = EntryTransformer;
Object.defineProperty(provider, "__esModule", { value: true });
const path = require$$0;
const deep_1 = deep;
const entry_1 = entry$1;
const error_1 = error;
const entry_2 = entry;
class Provider {
  constructor(_settings) {
    this._settings = _settings;
    this.errorFilter = new error_1.default(this._settings);
    this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
    this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
    this.entryTransformer = new entry_2.default(this._settings);
  }
  _getRootDirectory(task) {
    return path.resolve(this._settings.cwd, task.base);
  }
  _getReaderOptions(task) {
    const basePath = task.base === "." ? "" : task.base;
    return {
      basePath,
      pathSegmentSeparator: "/",
      concurrency: this._settings.concurrency,
      deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
      entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
      errorFilter: this.errorFilter.getFilter(),
      followSymbolicLinks: this._settings.followSymbolicLinks,
      fs: this._settings.fs,
      stats: this._settings.stats,
      throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
      transform: this.entryTransformer.getTransformer()
    };
  }
  _getMicromatchOptions() {
    return {
      dot: this._settings.dot,
      matchBase: this._settings.baseNameMatch,
      nobrace: !this._settings.braceExpansion,
      nocase: !this._settings.caseSensitiveMatch,
      noext: !this._settings.extglob,
      noglobstar: !this._settings.globstar,
      posix: true,
      strictSlashes: false
    };
  }
}
provider.default = Provider;
Object.defineProperty(async$7, "__esModule", { value: true });
const async_1$1 = async$6;
const provider_1$2 = provider;
class ProviderAsync extends provider_1$2.default {
  constructor() {
    super(...arguments);
    this._reader = new async_1$1.default(this._settings);
  }
  async read(task) {
    const root = this._getRootDirectory(task);
    const options = this._getReaderOptions(task);
    const entries = await this.api(root, task, options);
    return entries.map((entry2) => options.transform(entry2));
  }
  api(root, task, options) {
    if (task.dynamic) {
      return this._reader.dynamic(root, options);
    }
    return this._reader.static(task.patterns, options);
  }
}
async$7.default = ProviderAsync;
var stream = {};
Object.defineProperty(stream, "__esModule", { value: true });
const stream_1$1 = require$$0$2;
const stream_2 = stream$1;
const provider_1$1 = provider;
class ProviderStream extends provider_1$1.default {
  constructor() {
    super(...arguments);
    this._reader = new stream_2.default(this._settings);
  }
  read(task) {
    const root = this._getRootDirectory(task);
    const options = this._getReaderOptions(task);
    const source = this.api(root, task, options);
    const destination = new stream_1$1.Readable({ objectMode: true, read: () => {
    } });
    source.once("error", (error2) => destination.emit("error", error2)).on("data", (entry2) => destination.emit("data", options.transform(entry2))).once("end", () => destination.emit("end"));
    destination.once("close", () => source.destroy());
    return destination;
  }
  api(root, task, options) {
    if (task.dynamic) {
      return this._reader.dynamic(root, options);
    }
    return this._reader.static(task.patterns, options);
  }
}
stream.default = ProviderStream;
var sync$1 = {};
var sync = {};
Object.defineProperty(sync, "__esModule", { value: true });
const fsStat = out;
const fsWalk = out$2;
const reader_1 = reader;
class ReaderSync extends reader_1.default {
  constructor() {
    super(...arguments);
    this._walkSync = fsWalk.walkSync;
    this._statSync = fsStat.statSync;
  }
  dynamic(root, options) {
    return this._walkSync(root, options);
  }
  static(patterns, options) {
    const entries = [];
    for (const pattern2 of patterns) {
      const filepath = this._getFullEntryPath(pattern2);
      const entry2 = this._getEntry(filepath, pattern2, options);
      if (entry2 === null || !options.entryFilter(entry2)) {
        continue;
      }
      entries.push(entry2);
    }
    return entries;
  }
  _getEntry(filepath, pattern2, options) {
    try {
      const stats = this._getStat(filepath);
      return this._makeEntry(stats, pattern2);
    } catch (error2) {
      if (options.errorFilter(error2)) {
        return null;
      }
      throw error2;
    }
  }
  _getStat(filepath) {
    return this._statSync(filepath, this._fsStatSettings);
  }
}
sync.default = ReaderSync;
Object.defineProperty(sync$1, "__esModule", { value: true });
const sync_1$1 = sync;
const provider_1 = provider;
class ProviderSync extends provider_1.default {
  constructor() {
    super(...arguments);
    this._reader = new sync_1$1.default(this._settings);
  }
  read(task) {
    const root = this._getRootDirectory(task);
    const options = this._getReaderOptions(task);
    const entries = this.api(root, task, options);
    return entries.map(options.transform);
  }
  api(root, task, options) {
    if (task.dynamic) {
      return this._reader.dynamic(root, options);
    }
    return this._reader.static(task.patterns, options);
  }
}
sync$1.default = ProviderSync;
var settings = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
  const fs2 = require$$0$3;
  const os2 = require$$1;
  const CPU_COUNT = Math.max(os2.cpus().length, 1);
  exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs2.lstat,
    lstatSync: fs2.lstatSync,
    stat: fs2.stat,
    statSync: fs2.statSync,
    readdir: fs2.readdir,
    readdirSync: fs2.readdirSync
  };
  class Settings4 {
    constructor(_options = {}) {
      this._options = _options;
      this.absolute = this._getValue(this._options.absolute, false);
      this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
      this.braceExpansion = this._getValue(this._options.braceExpansion, true);
      this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
      this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
      this.cwd = this._getValue(this._options.cwd, process.cwd());
      this.deep = this._getValue(this._options.deep, Infinity);
      this.dot = this._getValue(this._options.dot, false);
      this.extglob = this._getValue(this._options.extglob, true);
      this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
      this.fs = this._getFileSystemMethods(this._options.fs);
      this.globstar = this._getValue(this._options.globstar, true);
      this.ignore = this._getValue(this._options.ignore, []);
      this.markDirectories = this._getValue(this._options.markDirectories, false);
      this.objectMode = this._getValue(this._options.objectMode, false);
      this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
      this.onlyFiles = this._getValue(this._options.onlyFiles, true);
      this.stats = this._getValue(this._options.stats, false);
      this.suppressErrors = this._getValue(this._options.suppressErrors, false);
      this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
      this.unique = this._getValue(this._options.unique, true);
      if (this.onlyDirectories) {
        this.onlyFiles = false;
      }
      if (this.stats) {
        this.objectMode = true;
      }
      this.ignore = [].concat(this.ignore);
    }
    _getValue(option, value) {
      return option === void 0 ? value : option;
    }
    _getFileSystemMethods(methods = {}) {
      return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
    }
  }
  exports.default = Settings4;
})(settings);
const taskManager = tasks;
const async_1 = async$7;
const stream_1 = stream;
const sync_1 = sync$1;
const settings_1 = settings;
const utils = utils$k;
async function FastGlob(source, options) {
  assertPatternsInput(source);
  const works = getWorks(source, async_1.default, options);
  const result = await Promise.all(works);
  return utils.array.flatten(result);
}
(function(FastGlob2) {
  FastGlob2.glob = FastGlob2;
  FastGlob2.globSync = sync2;
  FastGlob2.globStream = stream2;
  FastGlob2.async = FastGlob2;
  function sync2(source, options) {
    assertPatternsInput(source);
    const works = getWorks(source, sync_1.default, options);
    return utils.array.flatten(works);
  }
  FastGlob2.sync = sync2;
  function stream2(source, options) {
    assertPatternsInput(source);
    const works = getWorks(source, stream_1.default, options);
    return utils.stream.merge(works);
  }
  FastGlob2.stream = stream2;
  function generateTasks(source, options) {
    assertPatternsInput(source);
    const patterns = [].concat(source);
    const settings2 = new settings_1.default(options);
    return taskManager.generate(patterns, settings2);
  }
  FastGlob2.generateTasks = generateTasks;
  function isDynamicPattern2(source, options) {
    assertPatternsInput(source);
    const settings2 = new settings_1.default(options);
    return utils.pattern.isDynamicPattern(source, settings2);
  }
  FastGlob2.isDynamicPattern = isDynamicPattern2;
  function escapePath(source) {
    assertPatternsInput(source);
    return utils.path.escape(source);
  }
  FastGlob2.escapePath = escapePath;
  function convertPathToPattern(source) {
    assertPatternsInput(source);
    return utils.path.convertPathToPattern(source);
  }
  FastGlob2.convertPathToPattern = convertPathToPattern;
  (function(posix) {
    function escapePath2(source) {
      assertPatternsInput(source);
      return utils.path.escapePosixPath(source);
    }
    posix.escapePath = escapePath2;
    function convertPathToPattern2(source) {
      assertPatternsInput(source);
      return utils.path.convertPosixPathToPattern(source);
    }
    posix.convertPathToPattern = convertPathToPattern2;
  })(FastGlob2.posix || (FastGlob2.posix = {}));
  (function(win32) {
    function escapePath2(source) {
      assertPatternsInput(source);
      return utils.path.escapeWindowsPath(source);
    }
    win32.escapePath = escapePath2;
    function convertPathToPattern2(source) {
      assertPatternsInput(source);
      return utils.path.convertWindowsPathToPattern(source);
    }
    win32.convertPathToPattern = convertPathToPattern2;
  })(FastGlob2.win32 || (FastGlob2.win32 = {}));
})(FastGlob || (FastGlob = {}));
function getWorks(source, _Provider, options) {
  const patterns = [].concat(source);
  const settings2 = new settings_1.default(options);
  const tasks2 = taskManager.generate(patterns, settings2);
  const provider2 = new _Provider(settings2);
  return tasks2.map(provider2.read, provider2);
}
function assertPatternsInput(input) {
  const source = [].concat(input);
  const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
  if (!isValidSource) {
    throw new TypeError("Patterns must be a string (non empty) or an array of strings");
  }
}
nodePath.posix.join;
const ASTRO_PATH_HEADER = "x-astro-path";
const ASTRO_PATH_PARAM = "x_astro_path";
const ASTRO_LOCALS_HEADER = "x-astro-locals";
const ASTRO_MIDDLEWARE_SECRET_HEADER = "x-astro-middleware-secret";
apply();
await import("./astro/env-setup_hR0vcEol.mjs").then((mod) => mod.setGetEnv((key) => process.env[key])).catch(() => {
});
const createExports = (manifest, { middlewareSecret, skewProtection }) => {
  const app = new NodeApp(manifest);
  const handler = async (req, res) => {
    const url = new URL(`https://example.com${req.url}`);
    const clientAddress = req.headers["x-forwarded-for"];
    const localsHeader = req.headers[ASTRO_LOCALS_HEADER];
    const middlewareSecretHeader = req.headers[ASTRO_MIDDLEWARE_SECRET_HEADER];
    const realPath = req.headers[ASTRO_PATH_HEADER] ?? url.searchParams.get(ASTRO_PATH_PARAM);
    if (typeof realPath === "string") {
      req.url = realPath;
    }
    let locals = {};
    if (localsHeader) {
      if (middlewareSecretHeader !== middlewareSecret) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }
      locals = typeof localsHeader === "string" ? JSON.parse(localsHeader) : JSON.parse(localsHeader[0]);
    }
    delete req.headers[ASTRO_MIDDLEWARE_SECRET_HEADER];
    if (skewProtection && process.env.VERCEL_SKEW_PROTECTION_ENABLED === "1") {
      req.headers["x-deployment-id"] = process.env.VERCEL_DEPLOYMENT_ID;
    }
    const webResponse = await app.render(req, { addCookieHeader: true, clientAddress, locals });
    await NodeApp.writeResponse(webResponse, res);
  };
  return { default: handler };
};
function start() {
}
export {
  createExports as c,
  start as s
};
