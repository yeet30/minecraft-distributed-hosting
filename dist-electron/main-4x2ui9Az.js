var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _Gaxios_instances, urlMayUseProxy_fn, applyRequestInterceptors_fn, applyResponseInterceptors_fn, prepareRequest_fn, appendTimeoutToSignal_fn, _proxyAgent, _fetch, _Gaxios_static, getProxyAgent_fn, getFetch_fn, _cache, _LRUCache_instances, moveToEnd_fn, evict_fn, _crypto, _clientAuthentication, _tokenExchangeEndpoint, _DefaultAwsSecurityCredentialsSupplier_instances, getImdsV2SessionToken_fn, getAwsRoleName_fn, retrieveAwsSecurityCredentials_fn, regionFromEnv_get, securityCredentialsFromEnv_get, _DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL, _tokenRefreshEndpoint;
import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path$3 from "node:path";
import path$2 from "path";
import fs$4 from "fs";
import http from "http";
import url from "url";
import require$$1$4 from "child_process";
import require$$1 from "https";
import require$$3 from "stream";
import require$$1$1 from "os";
import require$$0$2 from "events";
import require$$1$2 from "process";
import require$$2 from "util";
import require$$0$3 from "crypto";
import require$$1$3 from "querystring";
import require$$0$4 from "buffer";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var src$4 = {};
var googleauth = {};
var src$3 = {};
var gaxios = {};
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;
var isArray = function isArray2(arr) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(arr);
  }
  return toStr.call(arr) === "[object Array]";
};
var isPlainObject = function isPlainObject2(obj) {
  if (!obj || toStr.call(obj) !== "[object Object]") {
    return false;
  }
  var hasOwnConstructor = hasOwn.call(obj, "constructor");
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }
  var key;
  for (key in obj) {
  }
  return typeof key === "undefined" || hasOwn.call(obj, key);
};
var setProperty = function setProperty2(target, options) {
  if (defineProperty && options.name === "__proto__") {
    defineProperty(target, options.name, {
      enumerable: true,
      configurable: true,
      value: options.newValue,
      writable: true
    });
  } else {
    target[options.name] = options.newValue;
  }
};
var getProperty = function getProperty2(obj, name2) {
  if (name2 === "__proto__") {
    if (!hasOwn.call(obj, name2)) {
      return void 0;
    } else if (gOPD) {
      return gOPD(obj, name2).value;
    }
  }
  return obj[name2];
};
var extend = function extend2() {
  var options, name2, src2, copy, copyIsArray, clone;
  var target = arguments[0];
  var i = 1;
  var length = arguments.length;
  var deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if (target == null || typeof target !== "object" && typeof target !== "function") {
    target = {};
  }
  for (; i < length; ++i) {
    options = arguments[i];
    if (options != null) {
      for (name2 in options) {
        src2 = getProperty(target, name2);
        copy = getProperty(options, name2);
        if (target !== copy) {
          if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src2 && isArray(src2) ? src2 : [];
            } else {
              clone = src2 && isPlainObject(src2) ? src2 : {};
            }
            setProperty(target, { name: name2, newValue: extend2(deep, clone, copy) });
          } else if (typeof copy !== "undefined") {
            setProperty(target, { name: name2, newValue: copy });
          }
        }
      }
    }
  }
  return target;
};
var common = {};
const name$1 = "gaxios";
const version$1 = "7.1.3";
const description$1 = "A simple common HTTP client specifically for Google APIs and services.";
const main$1 = "build/cjs/src/index.js";
const types$1 = "build/cjs/src/index.d.ts";
const files$1 = [
  "build/"
];
const exports$1 = {
  ".": {
    "import": {
      types: "./build/esm/src/index.d.ts",
      "default": "./build/esm/src/index.js"
    },
    require: {
      types: "./build/cjs/src/index.d.ts",
      "default": "./build/cjs/src/index.js"
    }
  }
};
const scripts$1 = {
  lint: "gts check --no-inline-config",
  test: "c8 mocha build/esm/test",
  "presystem-test": "npm run compile",
  "system-test": "mocha build/esm/system-test --timeout 80000",
  compile: "tsc -b ./tsconfig.json ./tsconfig.cjs.json && node utils/enable-esm.mjs",
  fix: "gts fix",
  prepare: "npm run compile",
  pretest: "npm run compile",
  webpack: "webpack",
  "prebrowser-test": "npm run compile",
  "browser-test": "node build/browser-test/browser-test-runner.js",
  docs: "jsdoc -c .jsdoc.js",
  "docs-test": "linkinator docs",
  "predocs-test": "npm run docs",
  "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
  prelint: "cd samples; npm link ../; npm install",
  clean: "gts clean"
};
const repository$1 = {
  type: "git",
  directory: "packages/gaxios",
  url: "https://github.com/googleapis/google-cloud-node-core.git"
};
const keywords$1 = [
  "google"
];
const engines$1 = {
  node: ">=18"
};
const author$1 = "Google, LLC";
const license$1 = "Apache-2.0";
const devDependencies$1 = {
  "@babel/plugin-proposal-private-methods": "^7.18.6",
  "@types/cors": "^2.8.6",
  "@types/express": "^5.0.0",
  "@types/extend": "^3.0.1",
  "@types/mocha": "^10.0.10",
  "@types/multiparty": "4.2.1",
  "@types/mv": "^2.1.0",
  "@types/ncp": "^2.0.1",
  "@types/node": "^22.0.0",
  "@types/sinon": "^17.0.0",
  "@types/tmp": "0.2.6",
  assert: "^2.0.0",
  browserify: "^17.0.0",
  c8: "^10.0.0",
  cors: "^2.8.5",
  express: "^5.0.0",
  gts: "^6.0.0",
  "is-docker": "^3.0.0",
  jsdoc: "^4.0.0",
  "jsdoc-fresh": "^5.0.0",
  "jsdoc-region-tag": "^4.0.0",
  karma: "^6.0.0",
  "karma-chrome-launcher": "^3.0.0",
  "karma-coverage": "^2.0.0",
  "karma-firefox-launcher": "^2.0.0",
  "karma-mocha": "^2.0.0",
  "karma-remap-coverage": "^0.1.5",
  "karma-sourcemap-loader": "^0.4.0",
  "karma-webpack": "^5.0.1",
  linkinator: "^6.1.2",
  mocha: "^11.1.0",
  multiparty: "^4.2.1",
  mv: "^2.1.1",
  ncp: "^2.0.0",
  nock: "^14.0.0-beta.13",
  "null-loader": "^4.0.0",
  "pack-n-play": "^4.0.0",
  puppeteer: "^24.0.0",
  sinon: "^21.0.0",
  "stream-browserify": "^3.0.0",
  tmp: "0.2.5",
  "ts-loader": "^9.5.2",
  typescript: "^5.8.3",
  webpack: "^5.35.0",
  "webpack-cli": "^6.0.1"
};
const dependencies$1 = {
  extend: "^3.0.2",
  "https-proxy-agent": "^7.0.1",
  "node-fetch": "^3.3.2",
  rimraf: "^5.0.1"
};
const homepage = "https://github.com/googleapis/google-cloud-node-core/tree/main/packages/gaxios";
const require$$0$1 = {
  name: name$1,
  version: version$1,
  description: description$1,
  main: main$1,
  types: types$1,
  files: files$1,
  exports: exports$1,
  scripts: scripts$1,
  repository: repository$1,
  keywords: keywords$1,
  engines: engines$1,
  author: author$1,
  license: license$1,
  devDependencies: devDependencies$1,
  dependencies: dependencies$1,
  homepage
};
const pkg$1 = require$$0$1;
var util$5 = { pkg: pkg$1 };
(function(exports$12) {
  var _a2;
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.GaxiosError = exports$12.GAXIOS_ERROR_SYMBOL = void 0;
  exports$12.defaultErrorRedactor = defaultErrorRedactor;
  const extend_12 = __importDefault2(extend);
  const util_cjs_1 = __importDefault2(util$5);
  const pkg2 = util_cjs_1.default.pkg;
  exports$12.GAXIOS_ERROR_SYMBOL = Symbol.for(`${pkg2.name}-gaxios-error`);
  class GaxiosError extends Error {
    constructor(message, config, response, cause) {
      var _a3, _b;
      super(message, { cause });
      __publicField(this, "config");
      __publicField(this, "response");
      /**
       * An error code.
       * Can be a system error code, DOMException error name, or any error's 'code' property where it is a `string`.
       *
       * It is only a `number` when the cause is sourced from an API-level error (AIP-193).
       *
       * @see {@link https://nodejs.org/api/errors.html#errorcode error.code}
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException#error_names DOMException#error_names}
       * @see {@link https://google.aip.dev/193#http11json-representation AIP-193}
       *
       * @example
       * 'ECONNRESET'
       *
       * @example
       * 'TimeoutError'
       *
       * @example
       * 500
       */
      __publicField(this, "code");
      /**
       * An HTTP Status code.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Response/status Response#status}
       *
       * @example
       * 500
       */
      __publicField(this, "status");
      /**
       * @deprecated use {@link GaxiosError.cause} instead.
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause Error#cause}
       *
       * @privateRemarks
       *
       * We will want to remove this property later as the modern `cause` property is better suited
       * for displaying and relaying nested errors. Keeping this here makes the resulting
       * error log larger than it needs to be.
       *
       */
      __publicField(this, "error");
      /**
       * Support `instanceof` operator for `GaxiosError` across builds/duplicated files.
       *
       * @see {@link GAXIOS_ERROR_SYMBOL}
       * @see {@link GaxiosError[Symbol.hasInstance]}
       * @see {@link https://github.com/microsoft/TypeScript/issues/13965#issuecomment-278570200}
       * @see {@link https://stackoverflow.com/questions/46618852/require-and-instanceof}
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/@@hasInstance#reverting_to_default_instanceof_behavior}
       */
      __publicField(this, _a2, pkg2.version);
      this.config = config;
      this.response = response;
      this.error = cause instanceof Error ? cause : void 0;
      this.config = (0, extend_12.default)(true, {}, config);
      if (this.response) {
        this.response.config = (0, extend_12.default)(true, {}, this.response.config);
      }
      if (this.response) {
        try {
          this.response.data = translateData(
            this.config.responseType,
            // workaround for `node-fetch`'s `.data` deprecation...
            ((_a3 = this.response) == null ? void 0 : _a3.bodyUsed) ? (_b = this.response) == null ? void 0 : _b.data : void 0
          );
        } catch {
        }
        this.status = this.response.status;
      }
      if (cause instanceof DOMException) {
        this.code = cause.name;
      } else if (cause && typeof cause === "object" && "code" in cause && (typeof cause.code === "string" || typeof cause.code === "number")) {
        this.code = cause.code;
      }
    }
    /**
     * Support `instanceof` operator for `GaxiosError` across builds/duplicated files.
     *
     * @see {@link GAXIOS_ERROR_SYMBOL}
     * @see {@link GaxiosError[GAXIOS_ERROR_SYMBOL]}
     */
    static [(_a2 = exports$12.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](instance) {
      if (instance && typeof instance === "object" && exports$12.GAXIOS_ERROR_SYMBOL in instance && instance[exports$12.GAXIOS_ERROR_SYMBOL] === pkg2.version) {
        return true;
      }
      return Function.prototype[Symbol.hasInstance].call(GaxiosError, instance);
    }
    /**
     * An AIP-193 conforming error extractor.
     *
     * @see {@link https://google.aip.dev/193#http11json-representation AIP-193}
     *
     * @internal
     * @expiremental
     *
     * @param res the response object
     * @returns the extracted error information
     */
    static extractAPIErrorFromResponse(res, defaultErrorMessage = "The request failed") {
      let message = defaultErrorMessage;
      if (typeof res.data === "string") {
        message = res.data;
      }
      if (res.data && typeof res.data === "object" && "error" in res.data && res.data.error && !res.ok) {
        if (typeof res.data.error === "string") {
          return {
            message: res.data.error,
            code: res.status,
            status: res.statusText
          };
        }
        if (typeof res.data.error === "object") {
          message = "message" in res.data.error && typeof res.data.error.message === "string" ? res.data.error.message : message;
          const status = "status" in res.data.error && typeof res.data.error.status === "string" ? res.data.error.status : res.statusText;
          const code2 = "code" in res.data.error && typeof res.data.error.code === "number" ? res.data.error.code : res.status;
          if ("errors" in res.data.error && Array.isArray(res.data.error.errors)) {
            const errorMessages = [];
            for (const e of res.data.error.errors) {
              if (typeof e === "object" && "message" in e && typeof e.message === "string") {
                errorMessages.push(e.message);
              }
            }
            return Object.assign({
              message: errorMessages.join("\n") || message,
              code: code2,
              status
            }, res.data.error);
          }
          return Object.assign({
            message,
            code: code2,
            status
          }, res.data.error);
        }
      }
      return {
        message,
        code: res.status,
        status: res.statusText
      };
    }
  }
  exports$12.GaxiosError = GaxiosError;
  function translateData(responseType, data) {
    switch (responseType) {
      case "stream":
        return data;
      case "json":
        return JSON.parse(JSON.stringify(data));
      case "arraybuffer":
        return JSON.parse(Buffer.from(data).toString("utf8"));
      case "blob":
        return JSON.parse(data.text());
      default:
        return data;
    }
  }
  function defaultErrorRedactor(data) {
    const REDACT = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
    function redactHeaders(headers) {
      if (!headers)
        return;
      headers.forEach((_, key) => {
        if (/^authentication$/i.test(key) || /^authorization$/i.test(key) || /secret/i.test(key))
          headers.set(key, REDACT);
      });
    }
    function redactString(obj, key) {
      if (typeof obj === "object" && obj !== null && typeof obj[key] === "string") {
        const text = obj[key];
        if (/grant_type=/i.test(text) || /assertion=/i.test(text) || /secret/i.test(text)) {
          obj[key] = REDACT;
        }
      }
    }
    function redactObject(obj) {
      if (!obj || typeof obj !== "object") {
        return;
      } else if (obj instanceof FormData || obj instanceof URLSearchParams || // support `node-fetch` FormData/URLSearchParams
      "forEach" in obj && "set" in obj) {
        obj.forEach((_, key) => {
          if (["grant_type", "assertion"].includes(key) || /secret/.test(key)) {
            obj.set(key, REDACT);
          }
        });
      } else {
        if ("grant_type" in obj) {
          obj["grant_type"] = REDACT;
        }
        if ("assertion" in obj) {
          obj["assertion"] = REDACT;
        }
        if ("client_secret" in obj) {
          obj["client_secret"] = REDACT;
        }
      }
    }
    if (data.config) {
      redactHeaders(data.config.headers);
      redactString(data.config, "data");
      redactObject(data.config.data);
      redactString(data.config, "body");
      redactObject(data.config.body);
      if (data.config.url.searchParams.has("token")) {
        data.config.url.searchParams.set("token", REDACT);
      }
      if (data.config.url.searchParams.has("client_secret")) {
        data.config.url.searchParams.set("client_secret", REDACT);
      }
    }
    if (data.response) {
      defaultErrorRedactor({ config: data.response.config });
      redactHeaders(data.response.headers);
      if (data.response.bodyUsed) {
        redactString(data.response, "data");
        redactObject(data.response.data);
      }
    }
    return data;
  }
})(common);
var retry = {};
Object.defineProperty(retry, "__esModule", { value: true });
retry.getRetryConfig = getRetryConfig;
async function getRetryConfig(err) {
  let config = getConfig(err);
  if (!err || !err.config || !config && !err.config.retry) {
    return { shouldRetry: false };
  }
  config = config || {};
  config.currentRetryAttempt = config.currentRetryAttempt || 0;
  config.retry = config.retry === void 0 || config.retry === null ? 3 : config.retry;
  config.httpMethodsToRetry = config.httpMethodsToRetry || [
    "GET",
    "HEAD",
    "PUT",
    "OPTIONS",
    "DELETE"
  ];
  config.noResponseRetries = config.noResponseRetries === void 0 || config.noResponseRetries === null ? 2 : config.noResponseRetries;
  config.retryDelayMultiplier = config.retryDelayMultiplier ? config.retryDelayMultiplier : 2;
  config.timeOfFirstRequest = config.timeOfFirstRequest ? config.timeOfFirstRequest : Date.now();
  config.totalTimeout = config.totalTimeout ? config.totalTimeout : Number.MAX_SAFE_INTEGER;
  config.maxRetryDelay = config.maxRetryDelay ? config.maxRetryDelay : Number.MAX_SAFE_INTEGER;
  const retryRanges = [
    // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    // 1xx - Retry (Informational, request still processing)
    // 2xx - Do not retry (Success)
    // 3xx - Do not retry (Redirect)
    // 4xx - Do not retry (Client errors)
    // 408 - Retry ("Request Timeout")
    // 429 - Retry ("Too Many Requests")
    // 5xx - Retry (Server errors)
    [100, 199],
    [408, 408],
    [429, 429],
    [500, 599]
  ];
  config.statusCodesToRetry = config.statusCodesToRetry || retryRanges;
  err.config.retryConfig = config;
  const shouldRetryFn = config.shouldRetry || shouldRetryRequest;
  if (!await shouldRetryFn(err)) {
    return { shouldRetry: false, config: err.config };
  }
  const delay = getNextRetryDelay(config);
  err.config.retryConfig.currentRetryAttempt += 1;
  const backoff = config.retryBackoff ? config.retryBackoff(err, delay) : new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
  if (config.onRetryAttempt) {
    await config.onRetryAttempt(err);
  }
  await backoff;
  return { shouldRetry: true, config: err.config };
}
function shouldRetryRequest(err) {
  var _a2, _b;
  const config = getConfig(err);
  if (((_a2 = err.config.signal) == null ? void 0 : _a2.aborted) && err.code !== "TimeoutError" || err.code === "AbortError") {
    return false;
  }
  if (!config || config.retry === 0) {
    return false;
  }
  if (!err.response && (config.currentRetryAttempt || 0) >= config.noResponseRetries) {
    return false;
  }
  if (!config.httpMethodsToRetry || !config.httpMethodsToRetry.includes(((_b = err.config.method) == null ? void 0 : _b.toUpperCase()) || "GET")) {
    return false;
  }
  if (err.response && err.response.status) {
    let isInRange = false;
    for (const [min, max] of config.statusCodesToRetry) {
      const status = err.response.status;
      if (status >= min && status <= max) {
        isInRange = true;
        break;
      }
    }
    if (!isInRange) {
      return false;
    }
  }
  config.currentRetryAttempt = config.currentRetryAttempt || 0;
  if (config.currentRetryAttempt >= config.retry) {
    return false;
  }
  return true;
}
function getConfig(err) {
  if (err && err.config && err.config.retryConfig) {
    return err.config.retryConfig;
  }
  return;
}
function getNextRetryDelay(config) {
  const retryDelay = config.currentRetryAttempt ? 0 : config.retryDelay ?? 100;
  const calculatedDelay = retryDelay + (Math.pow(config.retryDelayMultiplier, config.currentRetryAttempt) - 1) / 2 * 1e3;
  const maxAllowableDelay = config.totalTimeout - (Date.now() - config.timeOfFirstRequest);
  return Math.min(calculatedDelay, maxAllowableDelay, config.maxRetryDelay);
}
var interceptor = {};
Object.defineProperty(interceptor, "__esModule", { value: true });
interceptor.GaxiosInterceptorManager = void 0;
class GaxiosInterceptorManager extends Set {
}
interceptor.GaxiosInterceptorManager = GaxiosInterceptorManager;
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var _a;
Object.defineProperty(gaxios, "__esModule", { value: true });
gaxios.Gaxios = void 0;
const extend_1 = __importDefault(extend);
const https_1 = require$$1;
const common_js_1 = common;
const retry_js_1 = retry;
const stream_1 = require$$3;
const interceptor_js_1 = interceptor;
const randomUUID = async () => {
  var _a2;
  return ((_a2 = globalThis.crypto) == null ? void 0 : _a2.randomUUID()) || (await import("crypto")).randomUUID();
};
const HTTP_STATUS_NO_CONTENT = 204;
class Gaxios {
  /**
   * The Gaxios class is responsible for making HTTP requests.
   * @param defaults The default set of options to be used for this instance.
   */
  constructor(defaults) {
    __privateAdd(this, _Gaxios_instances);
    __publicField(this, "agentCache", /* @__PURE__ */ new Map());
    /**
     * Default HTTP options that will be used for every HTTP request.
     */
    __publicField(this, "defaults");
    /**
     * Interceptors
     */
    __publicField(this, "interceptors");
    this.defaults = defaults || {};
    this.interceptors = {
      request: new interceptor_js_1.GaxiosInterceptorManager(),
      response: new interceptor_js_1.GaxiosInterceptorManager()
    };
  }
  /**
   * A {@link fetch `fetch`} compliant API for {@link Gaxios}.
   *
   * @remarks
   *
   * This is useful as a drop-in replacement for `fetch` API usage.
   *
   * @example
   *
   * ```ts
   * const gaxios = new Gaxios();
   * const myFetch: typeof fetch = (...args) => gaxios.fetch(...args);
   * await myFetch('https://example.com');
   * ```
   *
   * @param args `fetch` API or `Gaxios#request` parameters
   * @returns the {@link Response} with Gaxios-added properties
   */
  fetch(...args) {
    const input = args[0];
    const init = args[1];
    let url2 = void 0;
    const headers = new Headers();
    if (typeof input === "string") {
      url2 = new URL(input);
    } else if (input instanceof URL) {
      url2 = input;
    } else if (input && input.url) {
      url2 = new URL(input.url);
    }
    if (input && typeof input === "object" && "headers" in input) {
      _a.mergeHeaders(headers, input.headers);
    }
    if (init) {
      _a.mergeHeaders(headers, new Headers(init.headers));
    }
    if (typeof input === "object" && !(input instanceof URL)) {
      return this.request({ ...init, ...input, headers, url: url2 });
    } else {
      return this.request({ ...init, headers, url: url2 });
    }
  }
  /**
   * Perform an HTTP request with the given options.
   * @param opts Set of HTTP options that will be used for this HTTP request.
   */
  async request(opts = {}) {
    let prepared = await __privateMethod(this, _Gaxios_instances, prepareRequest_fn).call(this, opts);
    prepared = await __privateMethod(this, _Gaxios_instances, applyRequestInterceptors_fn).call(this, prepared);
    return __privateMethod(this, _Gaxios_instances, applyResponseInterceptors_fn).call(this, this._request(prepared));
  }
  async _defaultAdapter(config) {
    var _a2, _b;
    const fetchImpl = config.fetchImplementation || this.defaults.fetchImplementation || await __privateMethod(_a2 = _a, _Gaxios_static, getFetch_fn).call(_a2);
    const preparedOpts = { ...config };
    delete preparedOpts.data;
    const res = await fetchImpl(config.url, preparedOpts);
    const data = await this.getResponseData(config, res);
    if (!((_b = Object.getOwnPropertyDescriptor(res, "data")) == null ? void 0 : _b.configurable)) {
      Object.defineProperties(res, {
        data: {
          configurable: true,
          writable: true,
          enumerable: true,
          value: data
        }
      });
    }
    return Object.assign(res, { config, data });
  }
  /**
   * Internal, retryable version of the `request` method.
   * @param opts Set of HTTP options that will be used for this HTTP request.
   */
  async _request(opts) {
    var _a2;
    try {
      let translatedResponse;
      if (opts.adapter) {
        translatedResponse = await opts.adapter(opts, this._defaultAdapter.bind(this));
      } else {
        translatedResponse = await this._defaultAdapter(opts);
      }
      if (!opts.validateStatus(translatedResponse.status)) {
        if (opts.responseType === "stream") {
          const response = [];
          for await (const chunk of translatedResponse.data) {
            response.push(chunk);
          }
          translatedResponse.data = response.toString();
        }
        const errorInfo = common_js_1.GaxiosError.extractAPIErrorFromResponse(translatedResponse, `Request failed with status code ${translatedResponse.status}`);
        throw new common_js_1.GaxiosError(errorInfo == null ? void 0 : errorInfo.message, opts, translatedResponse, errorInfo);
      }
      return translatedResponse;
    } catch (e) {
      let err;
      if (e instanceof common_js_1.GaxiosError) {
        err = e;
      } else if (e instanceof Error) {
        err = new common_js_1.GaxiosError(e.message, opts, void 0, e);
      } else {
        err = new common_js_1.GaxiosError("Unexpected Gaxios Error", opts, void 0, e);
      }
      const { shouldRetry, config } = await (0, retry_js_1.getRetryConfig)(err);
      if (shouldRetry && config) {
        err.config.retryConfig.currentRetryAttempt = config.retryConfig.currentRetryAttempt;
        opts.retryConfig = (_a2 = err.config) == null ? void 0 : _a2.retryConfig;
        __privateMethod(this, _Gaxios_instances, appendTimeoutToSignal_fn).call(this, opts);
        return this._request(opts);
      }
      if (opts.errorRedactor) {
        opts.errorRedactor(err);
      }
      throw err;
    }
  }
  async getResponseData(opts, res) {
    var _a2;
    if (res.status === HTTP_STATUS_NO_CONTENT) {
      return "";
    }
    if (opts.maxContentLength && res.headers.has("content-length") && opts.maxContentLength < Number.parseInt(((_a2 = res.headers) == null ? void 0 : _a2.get("content-length")) || "")) {
      throw new common_js_1.GaxiosError("Response's `Content-Length` is over the limit.", opts, Object.assign(res, { config: opts }));
    }
    switch (opts.responseType) {
      case "stream":
        return res.body;
      case "json": {
        const data = await res.text();
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
      case "arraybuffer":
        return res.arrayBuffer();
      case "blob":
        return res.blob();
      case "text":
        return res.text();
      default:
        return this.getResponseDataFromContentType(res);
    }
  }
  /**
   * By default, throw for any non-2xx status code
   * @param status status code from the HTTP response
   */
  validateStatus(status) {
    return status >= 200 && status < 300;
  }
  /**
   * Attempts to parse a response by looking at the Content-Type header.
   * @param {Response} response the HTTP response.
   * @returns a promise that resolves to the response data.
   */
  async getResponseDataFromContentType(response) {
    let contentType = response.headers.get("Content-Type");
    if (contentType === null) {
      return response.text();
    }
    contentType = contentType.toLowerCase();
    if (contentType.includes("application/json")) {
      let data = await response.text();
      try {
        data = JSON.parse(data);
      } catch {
      }
      return data;
    } else if (contentType.match(/^text\//)) {
      return response.text();
    } else {
      return response.blob();
    }
  }
  /**
   * Creates an async generator that yields the pieces of a multipart/related request body.
   * This implementation follows the spec: https://www.ietf.org/rfc/rfc2387.txt. However, recursive
   * multipart/related requests are not currently supported.
   *
   * @param {GaxiosMultipartOptions[]} multipartOptions the pieces to turn into a multipart/related body.
   * @param {string} boundary the boundary string to be placed between each part.
   */
  async *getMultipartRequest(multipartOptions, boundary) {
    const finale = `--${boundary}--`;
    for (const currentPart of multipartOptions) {
      const partContentType = currentPart.headers.get("Content-Type") || "application/octet-stream";
      const preamble = `--${boundary}\r
Content-Type: ${partContentType}\r
\r
`;
      yield preamble;
      if (typeof currentPart.content === "string") {
        yield currentPart.content;
      } else {
        yield* currentPart.content;
      }
      yield "\r\n";
    }
    yield finale;
  }
  /**
   * Merges headers.
   * If the base headers do not exist a new `Headers` object will be returned.
   *
   * @remarks
   *
   * Using this utility can be helpful when the headers are not known to exist:
   * - if they exist as `Headers`, that instance will be used
   *   - it improves performance and allows users to use their existing references to their `Headers`
   * - if they exist in another form (`HeadersInit`), they will be used to create a new `Headers` object
   * - if the base headers do not exist a new `Headers` object will be created
   *
   * @param base headers to append/overwrite to
   * @param append headers to append/overwrite with
   * @returns the base headers instance with merged `Headers`
   */
  static mergeHeaders(base, ...append) {
    base = base instanceof Headers ? base : new Headers(base);
    for (const headers of append) {
      const add = headers instanceof Headers ? headers : new Headers(headers);
      add.forEach((value, key) => {
        key === "set-cookie" ? base.append(key, value) : base.set(key, value);
      });
    }
    return base;
  }
}
_Gaxios_instances = new WeakSet();
urlMayUseProxy_fn = function(url2, noProxy = []) {
  var _a2;
  const candidate = new URL(url2);
  const noProxyList = [...noProxy];
  const noProxyEnvList = ((_a2 = process.env.NO_PROXY ?? process.env.no_proxy) == null ? void 0 : _a2.split(",")) || [];
  for (const rule of noProxyEnvList) {
    noProxyList.push(rule.trim());
  }
  for (const rule of noProxyList) {
    if (rule instanceof RegExp) {
      if (rule.test(candidate.toString())) {
        return false;
      }
    } else if (rule instanceof URL) {
      if (rule.origin === candidate.origin) {
        return false;
      }
    } else if (rule.startsWith("*.") || rule.startsWith(".")) {
      const cleanedRule = rule.replace(/^\*\./, ".");
      if (candidate.hostname.endsWith(cleanedRule)) {
        return false;
      }
    } else if (rule === candidate.origin || rule === candidate.hostname || rule === candidate.href) {
      return false;
    }
  }
  return true;
};
applyRequestInterceptors_fn = async function(options) {
  let promiseChain = Promise.resolve(options);
  for (const interceptor2 of this.interceptors.request.values()) {
    if (interceptor2) {
      promiseChain = promiseChain.then(interceptor2.resolved, interceptor2.rejected);
    }
  }
  return promiseChain;
};
applyResponseInterceptors_fn = async function(response) {
  let promiseChain = Promise.resolve(response);
  for (const interceptor2 of this.interceptors.response.values()) {
    if (interceptor2) {
      promiseChain = promiseChain.then(interceptor2.resolved, interceptor2.rejected);
    }
  }
  return promiseChain;
};
prepareRequest_fn = async function(options) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  const preparedHeaders = new Headers(this.defaults.headers);
  _a.mergeHeaders(preparedHeaders, options.headers);
  const opts = (0, extend_1.default)(true, {}, this.defaults, options);
  if (!opts.url) {
    throw new Error("URL is required.");
  }
  if (opts.baseURL) {
    opts.url = new URL(opts.url, opts.baseURL);
  }
  opts.url = new URL(opts.url);
  if (opts.params) {
    if (opts.paramsSerializer) {
      let additionalQueryParams = opts.paramsSerializer(opts.params);
      if (additionalQueryParams.startsWith("?")) {
        additionalQueryParams = additionalQueryParams.slice(1);
      }
      const prefix = opts.url.toString().includes("?") ? "&" : "?";
      opts.url = opts.url + prefix + additionalQueryParams;
    } else {
      const url2 = opts.url instanceof URL ? opts.url : new URL(opts.url);
      for (const [key, value] of new URLSearchParams(opts.params)) {
        url2.searchParams.append(key, value);
      }
      opts.url = url2;
    }
  }
  if (typeof options.maxContentLength === "number") {
    opts.size = options.maxContentLength;
  }
  if (typeof options.maxRedirects === "number") {
    opts.follow = options.maxRedirects;
  }
  const shouldDirectlyPassData = typeof opts.data === "string" || opts.data instanceof ArrayBuffer || opts.data instanceof Blob || // Node 18 does not have a global `File` object
  globalThis.File && opts.data instanceof File || opts.data instanceof FormData || opts.data instanceof stream_1.Readable || opts.data instanceof ReadableStream || opts.data instanceof String || opts.data instanceof URLSearchParams || ArrayBuffer.isView(opts.data) || // `Buffer` (Node.js), `DataView`, `TypedArray`
  /**
   * @deprecated `node-fetch` or another third-party's request types
   */
  ["Blob", "File", "FormData"].includes(((_b = (_a2 = opts.data) == null ? void 0 : _a2.constructor) == null ? void 0 : _b.name) || "");
  if ((_c = opts.multipart) == null ? void 0 : _c.length) {
    const boundary = await randomUUID();
    preparedHeaders.set("content-type", `multipart/related; boundary=${boundary}`);
    opts.body = stream_1.Readable.from(this.getMultipartRequest(opts.multipart, boundary));
  } else if (shouldDirectlyPassData) {
    opts.body = opts.data;
  } else if (typeof opts.data === "object") {
    if (preparedHeaders.get("Content-Type") === "application/x-www-form-urlencoded") {
      opts.body = opts.paramsSerializer ? opts.paramsSerializer(opts.data) : new URLSearchParams(opts.data);
    } else {
      if (!preparedHeaders.has("content-type")) {
        preparedHeaders.set("content-type", "application/json");
      }
      opts.body = JSON.stringify(opts.data);
    }
  } else if (opts.data) {
    opts.body = opts.data;
  }
  opts.validateStatus = opts.validateStatus || this.validateStatus;
  opts.responseType = opts.responseType || "unknown";
  if (!preparedHeaders.has("accept") && opts.responseType === "json") {
    preparedHeaders.set("accept", "application/json");
  }
  const proxy = opts.proxy || ((_d = process.env) == null ? void 0 : _d.HTTPS_PROXY) || ((_e = process.env) == null ? void 0 : _e.https_proxy) || ((_f = process.env) == null ? void 0 : _f.HTTP_PROXY) || ((_g = process.env) == null ? void 0 : _g.http_proxy);
  if (opts.agent) ;
  else if (proxy && __privateMethod(this, _Gaxios_instances, urlMayUseProxy_fn).call(this, opts.url, opts.noProxy)) {
    const HttpsProxyAgent = await __privateMethod(_h = _a, _Gaxios_static, getProxyAgent_fn).call(_h);
    if (this.agentCache.has(proxy)) {
      opts.agent = this.agentCache.get(proxy);
    } else {
      opts.agent = new HttpsProxyAgent(proxy, {
        cert: opts.cert,
        key: opts.key
      });
      this.agentCache.set(proxy, opts.agent);
    }
  } else if (opts.cert && opts.key) {
    if (this.agentCache.has(opts.key)) {
      opts.agent = this.agentCache.get(opts.key);
    } else {
      opts.agent = new https_1.Agent({
        cert: opts.cert,
        key: opts.key
      });
      this.agentCache.set(opts.key, opts.agent);
    }
  }
  if (typeof opts.errorRedactor !== "function" && opts.errorRedactor !== false) {
    opts.errorRedactor = common_js_1.defaultErrorRedactor;
  }
  if (opts.body && !("duplex" in opts)) {
    opts.duplex = "half";
  }
  __privateMethod(this, _Gaxios_instances, appendTimeoutToSignal_fn).call(this, opts);
  return Object.assign(opts, {
    headers: preparedHeaders,
    url: opts.url instanceof URL ? opts.url : new URL(opts.url)
  });
};
appendTimeoutToSignal_fn = function(opts) {
  if (opts.timeout) {
    const timeoutSignal = AbortSignal.timeout(opts.timeout);
    if (opts.signal && !opts.signal.aborted) {
      opts.signal = AbortSignal.any([opts.signal, timeoutSignal]);
    } else {
      opts.signal = timeoutSignal;
    }
  }
};
_proxyAgent = new WeakMap();
_fetch = new WeakMap();
_Gaxios_static = new WeakSet();
getProxyAgent_fn = async function() {
  __privateGet(this, _proxyAgent) || __privateSet(this, _proxyAgent, (await import("./index-BkLT4TWc.js").then((n) => n.i)).HttpsProxyAgent);
  return __privateGet(this, _proxyAgent);
};
getFetch_fn = async function() {
  const hasWindow = typeof window !== "undefined" && !!window;
  __privateGet(this, _fetch) || __privateSet(this, _fetch, hasWindow ? window.fetch : (await import("./index-CnutBTru.js")).default);
  return __privateGet(this, _fetch);
};
__privateAdd(Gaxios, _Gaxios_static);
/**
 * A cache for the lazily-loaded proxy agent.
 *
 * Should use {@link Gaxios[#getProxyAgent]} to retrieve.
 */
// using `import` to dynamically import the types here
__privateAdd(Gaxios, _proxyAgent);
/**
 * A cache for the lazily-loaded fetch library.
 *
 * Should use {@link Gaxios[#getFetch]} to retrieve.
 */
//
__privateAdd(Gaxios, _fetch);
gaxios.Gaxios = Gaxios;
_a = Gaxios;
(function(exports$12) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports$13) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$13, p)) __createBinding(exports$13, m, p);
  };
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.instance = exports$12.Gaxios = exports$12.GaxiosError = void 0;
  exports$12.request = request;
  const gaxios_js_1 = gaxios;
  Object.defineProperty(exports$12, "Gaxios", { enumerable: true, get: function() {
    return gaxios_js_1.Gaxios;
  } });
  var common_js_12 = common;
  Object.defineProperty(exports$12, "GaxiosError", { enumerable: true, get: function() {
    return common_js_12.GaxiosError;
  } });
  __exportStar(interceptor, exports$12);
  exports$12.instance = new gaxios_js_1.Gaxios();
  async function request(opts) {
    return exports$12.instance.request(opts);
  }
})(src$3);
var src$2 = {};
var jsonBigint = { exports: {} };
var stringify = { exports: {} };
var bignumber = { exports: {} };
(function(module) {
  (function(globalObject) {
    var BigNumber2, isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], SQRT_BASE = 1e7, MAX = 1e9;
    function clone(configObject) {
      var div, convertBase, parseNumeric, P = BigNumber3.prototype = { constructor: BigNumber3, toString: null, valueOf: null }, ONE = new BigNumber3(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
        prefix: "",
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ",",
        decimalSeparator: ".",
        fractionGroupSize: 0,
        fractionGroupSeparator: " ",
        // non-breaking space
        suffix: ""
      }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
      function BigNumber3(v, b) {
        var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
        if (!(x instanceof BigNumber3)) return new BigNumber3(v, b);
        if (b == null) {
          if (v && v._isBigNumber === true) {
            x.s = v.s;
            if (!v.c || v.e > MAX_EXP) {
              x.c = x.e = null;
            } else if (v.e < MIN_EXP) {
              x.c = [x.e = 0];
            } else {
              x.e = v.e;
              x.c = v.c.slice();
            }
            return;
          }
          if ((isNum = typeof v == "number") && v * 0 == 0) {
            x.s = 1 / v < 0 ? (v = -v, -1) : 1;
            if (v === ~~v) {
              for (e = 0, i = v; i >= 10; i /= 10, e++) ;
              if (e > MAX_EXP) {
                x.c = x.e = null;
              } else {
                x.e = e;
                x.c = [v];
              }
              return;
            }
            str = String(v);
          } else {
            if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
            x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
          }
          if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
          if ((i = str.search(/e/i)) > 0) {
            if (e < 0) e = i;
            e += +str.slice(i + 1);
            str = str.substring(0, i);
          } else if (e < 0) {
            e = str.length;
          }
        } else {
          intCheck(b, 2, ALPHABET.length, "Base");
          if (b == 10 && alphabetHasNormalDecimalDigits) {
            x = new BigNumber3(v);
            return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
          }
          str = String(v);
          if (isNum = typeof v == "number") {
            if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
            x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
            if (BigNumber3.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
              throw Error(tooManyDigits + v);
            }
          } else {
            x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
          }
          alphabet = ALPHABET.slice(0, b);
          e = i = 0;
          for (len = str.length; i < len; i++) {
            if (alphabet.indexOf(c = str.charAt(i)) < 0) {
              if (c == ".") {
                if (i > e) {
                  e = len;
                  continue;
                }
              } else if (!caseChanged) {
                if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                  caseChanged = true;
                  i = -1;
                  e = 0;
                  continue;
                }
              }
              return parseNumeric(x, String(v), isNum, b);
            }
          }
          isNum = false;
          str = convertBase(str, b, 10, x.s);
          if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
          else e = str.length;
        }
        for (i = 0; str.charCodeAt(i) === 48; i++) ;
        for (len = str.length; str.charCodeAt(--len) === 48; ) ;
        if (str = str.slice(i, ++len)) {
          len -= i;
          if (isNum && BigNumber3.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error(tooManyDigits + x.s * v);
          }
          if ((e = e - i - 1) > MAX_EXP) {
            x.c = x.e = null;
          } else if (e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = e;
            x.c = [];
            i = (e + 1) % LOG_BASE;
            if (e < 0) i += LOG_BASE;
            if (i < len) {
              if (i) x.c.push(+str.slice(0, i));
              for (len -= LOG_BASE; i < len; ) {
                x.c.push(+str.slice(i, i += LOG_BASE));
              }
              i = LOG_BASE - (str = str.slice(i)).length;
            } else {
              i -= len;
            }
            for (; i--; str += "0") ;
            x.c.push(+str);
          }
        } else {
          x.c = [x.e = 0];
        }
      }
      BigNumber3.clone = clone;
      BigNumber3.ROUND_UP = 0;
      BigNumber3.ROUND_DOWN = 1;
      BigNumber3.ROUND_CEIL = 2;
      BigNumber3.ROUND_FLOOR = 3;
      BigNumber3.ROUND_HALF_UP = 4;
      BigNumber3.ROUND_HALF_DOWN = 5;
      BigNumber3.ROUND_HALF_EVEN = 6;
      BigNumber3.ROUND_HALF_CEIL = 7;
      BigNumber3.ROUND_HALF_FLOOR = 8;
      BigNumber3.EUCLID = 9;
      BigNumber3.config = BigNumber3.set = function(obj) {
        var p, v;
        if (obj != null) {
          if (typeof obj == "object") {
            if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              DECIMAL_PLACES = v;
            }
            if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
              v = obj[p];
              intCheck(v, 0, 8, p);
              ROUNDING_MODE = v;
            }
            if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, 0, p);
                intCheck(v[1], 0, MAX, p);
                TO_EXP_NEG = v[0];
                TO_EXP_POS = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
              }
            }
            if (obj.hasOwnProperty(p = "RANGE")) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, -1, p);
                intCheck(v[1], 1, MAX, p);
                MIN_EXP = v[0];
                MAX_EXP = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                if (v) {
                  MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                } else {
                  throw Error(bignumberError + p + " cannot be zero: " + v);
                }
              }
            }
            if (obj.hasOwnProperty(p = "CRYPTO")) {
              v = obj[p];
              if (v === !!v) {
                if (v) {
                  if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                    CRYPTO = v;
                  } else {
                    CRYPTO = !v;
                    throw Error(bignumberError + "crypto unavailable");
                  }
                } else {
                  CRYPTO = v;
                }
              } else {
                throw Error(bignumberError + p + " not true or false: " + v);
              }
            }
            if (obj.hasOwnProperty(p = "MODULO_MODE")) {
              v = obj[p];
              intCheck(v, 0, 9, p);
              MODULO_MODE = v;
            }
            if (obj.hasOwnProperty(p = "POW_PRECISION")) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              POW_PRECISION = v;
            }
            if (obj.hasOwnProperty(p = "FORMAT")) {
              v = obj[p];
              if (typeof v == "object") FORMAT = v;
              else throw Error(bignumberError + p + " not an object: " + v);
            }
            if (obj.hasOwnProperty(p = "ALPHABET")) {
              v = obj[p];
              if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
                ALPHABET = v;
              } else {
                throw Error(bignumberError + p + " invalid: " + v);
              }
            }
          } else {
            throw Error(bignumberError + "Object expected: " + obj);
          }
        }
        return {
          DECIMAL_PLACES,
          ROUNDING_MODE,
          EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
          RANGE: [MIN_EXP, MAX_EXP],
          CRYPTO,
          MODULO_MODE,
          POW_PRECISION,
          FORMAT,
          ALPHABET
        };
      };
      BigNumber3.isBigNumber = function(v) {
        if (!v || v._isBigNumber !== true) return false;
        if (!BigNumber3.DEBUG) return true;
        var i, n, c = v.c, e = v.e, s = v.s;
        out: if ({}.toString.call(c) == "[object Array]") {
          if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
            if (c[0] === 0) {
              if (e === 0 && c.length === 1) return true;
              break out;
            }
            i = (e + 1) % LOG_BASE;
            if (i < 1) i += LOG_BASE;
            if (String(c[0]).length == i) {
              for (i = 0; i < c.length; i++) {
                n = c[i];
                if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
              }
              if (n !== 0) return true;
            }
          }
        } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
          return true;
        }
        throw Error(bignumberError + "Invalid BigNumber: " + v);
      };
      BigNumber3.maximum = BigNumber3.max = function() {
        return maxOrMin(arguments, -1);
      };
      BigNumber3.minimum = BigNumber3.min = function() {
        return maxOrMin(arguments, 1);
      };
      BigNumber3.random = function() {
        var pow2_53 = 9007199254740992;
        var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
          return mathfloor(Math.random() * pow2_53);
        } : function() {
          return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
        };
        return function(dp) {
          var a, b, e, k, v, i = 0, c = [], rand = new BigNumber3(ONE);
          if (dp == null) dp = DECIMAL_PLACES;
          else intCheck(dp, 0, MAX);
          k = mathceil(dp / LOG_BASE);
          if (CRYPTO) {
            if (crypto.getRandomValues) {
              a = crypto.getRandomValues(new Uint32Array(k *= 2));
              for (; i < k; ) {
                v = a[i] * 131072 + (a[i + 1] >>> 11);
                if (v >= 9e15) {
                  b = crypto.getRandomValues(new Uint32Array(2));
                  a[i] = b[0];
                  a[i + 1] = b[1];
                } else {
                  c.push(v % 1e14);
                  i += 2;
                }
              }
              i = k / 2;
            } else if (crypto.randomBytes) {
              a = crypto.randomBytes(k *= 7);
              for (; i < k; ) {
                v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
                if (v >= 9e15) {
                  crypto.randomBytes(7).copy(a, i);
                } else {
                  c.push(v % 1e14);
                  i += 7;
                }
              }
              i = k / 7;
            } else {
              CRYPTO = false;
              throw Error(bignumberError + "crypto unavailable");
            }
          }
          if (!CRYPTO) {
            for (; i < k; ) {
              v = random53bitInt();
              if (v < 9e15) c[i++] = v % 1e14;
            }
          }
          k = c[--i];
          dp %= LOG_BASE;
          if (k && dp) {
            v = POWS_TEN[LOG_BASE - dp];
            c[i] = mathfloor(k / v) * v;
          }
          for (; c[i] === 0; c.pop(), i--) ;
          if (i < 0) {
            c = [e = 0];
          } else {
            for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE) ;
            for (i = 1, v = c[0]; v >= 10; v /= 10, i++) ;
            if (i < LOG_BASE) e -= LOG_BASE - i;
          }
          rand.e = e;
          rand.c = c;
          return rand;
        };
      }();
      BigNumber3.sum = function() {
        var i = 1, args = arguments, sum = new BigNumber3(args[0]);
        for (; i < args.length; ) sum = sum.plus(args[i++]);
        return sum;
      };
      convertBase = /* @__PURE__ */ function() {
        var decimal = "0123456789";
        function toBaseOut(str, baseIn, baseOut, alphabet) {
          var j, arr = [0], arrL, i = 0, len = str.length;
          for (; i < len; ) {
            for (arrL = arr.length; arrL--; arr[arrL] *= baseIn) ;
            arr[0] += alphabet.indexOf(str.charAt(i++));
            for (j = 0; j < arr.length; j++) {
              if (arr[j] > baseOut - 1) {
                if (arr[j + 1] == null) arr[j + 1] = 0;
                arr[j + 1] += arr[j] / baseOut | 0;
                arr[j] %= baseOut;
              }
            }
          }
          return arr.reverse();
        }
        return function(str, baseIn, baseOut, sign3, callerIsToString) {
          var alphabet, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
          if (i >= 0) {
            k = POW_PRECISION;
            POW_PRECISION = 0;
            str = str.replace(".", "");
            y = new BigNumber3(baseIn);
            x = y.pow(str.length - i);
            POW_PRECISION = k;
            y.c = toBaseOut(
              toFixedPoint(coeffToString(x.c), x.e, "0"),
              10,
              baseOut,
              decimal
            );
            y.e = y.c.length;
          }
          xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
          e = k = xc.length;
          for (; xc[--k] == 0; xc.pop()) ;
          if (!xc[0]) return alphabet.charAt(0);
          if (i < 0) {
            --e;
          } else {
            x.c = xc;
            x.e = e;
            x.s = sign3;
            x = div(x, y, dp, rm, baseOut);
            xc = x.c;
            r = x.r;
            e = x.e;
          }
          d = e + dp + 1;
          i = xc[d];
          k = baseOut / 2;
          r = r || d < 0 || xc[d + 1] != null;
          r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
          if (d < 1 || !xc[0]) {
            str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
          } else {
            xc.length = d;
            if (r) {
              for (--baseOut; ++xc[--d] > baseOut; ) {
                xc[d] = 0;
                if (!d) {
                  ++e;
                  xc = [1].concat(xc);
                }
              }
            }
            for (k = xc.length; !xc[--k]; ) ;
            for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++])) ;
            str = toFixedPoint(str, e, alphabet.charAt(0));
          }
          return str;
        };
      }();
      div = /* @__PURE__ */ function() {
        function multiply(x, k, base) {
          var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
          for (x = x.slice(); i--; ) {
            xlo = x[i] % SQRT_BASE;
            xhi = x[i] / SQRT_BASE | 0;
            m = khi * xlo + xhi * klo;
            temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
            carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
            x[i] = temp % base;
          }
          if (carry) x = [carry].concat(x);
          return x;
        }
        function compare2(a, b, aL, bL) {
          var i, cmp;
          if (aL != bL) {
            cmp = aL > bL ? 1 : -1;
          } else {
            for (i = cmp = 0; i < aL; i++) {
              if (a[i] != b[i]) {
                cmp = a[i] > b[i] ? 1 : -1;
                break;
              }
            }
          }
          return cmp;
        }
        function subtract(a, b, aL, base) {
          var i = 0;
          for (; aL--; ) {
            a[aL] -= i;
            i = a[aL] < b[aL] ? 1 : 0;
            a[aL] = i * base + a[aL] - b[aL];
          }
          for (; !a[0] && a.length > 1; a.splice(0, 1)) ;
        }
        return function(x, y, dp, rm, base) {
          var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
          if (!xc || !xc[0] || !yc || !yc[0]) {
            return new BigNumber3(
              // Return NaN if either NaN, or both Infinity or 0.
              !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
                // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                xc && xc[0] == 0 || !yc ? s * 0 : s / 0
              )
            );
          }
          q = new BigNumber3(s);
          qc = q.c = [];
          e = x.e - y.e;
          s = dp + e + 1;
          if (!base) {
            base = BASE;
            e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
            s = s / LOG_BASE | 0;
          }
          for (i = 0; yc[i] == (xc[i] || 0); i++) ;
          if (yc[i] > (xc[i] || 0)) e--;
          if (s < 0) {
            qc.push(1);
            more = true;
          } else {
            xL = xc.length;
            yL = yc.length;
            i = 0;
            s += 2;
            n = mathfloor(base / (yc[0] + 1));
            if (n > 1) {
              yc = multiply(yc, n, base);
              xc = multiply(xc, n, base);
              yL = yc.length;
              xL = xc.length;
            }
            xi = yL;
            rem = xc.slice(0, yL);
            remL = rem.length;
            for (; remL < yL; rem[remL++] = 0) ;
            yz = yc.slice();
            yz = [0].concat(yz);
            yc0 = yc[0];
            if (yc[1] >= base / 2) yc0++;
            do {
              n = 0;
              cmp = compare2(yc, rem, yL, remL);
              if (cmp < 0) {
                rem0 = rem[0];
                if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
                n = mathfloor(rem0 / yc0);
                if (n > 1) {
                  if (n >= base) n = base - 1;
                  prod = multiply(yc, n, base);
                  prodL = prod.length;
                  remL = rem.length;
                  while (compare2(prod, rem, prodL, remL) == 1) {
                    n--;
                    subtract(prod, yL < prodL ? yz : yc, prodL, base);
                    prodL = prod.length;
                    cmp = 1;
                  }
                } else {
                  if (n == 0) {
                    cmp = n = 1;
                  }
                  prod = yc.slice();
                  prodL = prod.length;
                }
                if (prodL < remL) prod = [0].concat(prod);
                subtract(rem, prod, remL, base);
                remL = rem.length;
                if (cmp == -1) {
                  while (compare2(yc, rem, yL, remL) < 1) {
                    n++;
                    subtract(rem, yL < remL ? yz : yc, remL, base);
                    remL = rem.length;
                  }
                }
              } else if (cmp === 0) {
                n++;
                rem = [0];
              }
              qc[i++] = n;
              if (rem[0]) {
                rem[remL++] = xc[xi] || 0;
              } else {
                rem = [xc[xi]];
                remL = 1;
              }
            } while ((xi++ < xL || rem[0] != null) && s--);
            more = rem[0] != null;
            if (!qc[0]) qc.splice(0, 1);
          }
          if (base == BASE) {
            for (i = 1, s = qc[0]; s >= 10; s /= 10, i++) ;
            round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
          } else {
            q.e = e;
            q.r = +more;
          }
          return q;
        };
      }();
      function format(n, i, rm, id) {
        var c0, e, ne, len, str;
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);
        if (!n.c) return n.toString();
        c0 = n.c[0];
        ne = n.e;
        if (i == null) {
          str = coeffToString(n.c);
          str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
        } else {
          n = round(new BigNumber3(n), i, rm);
          e = n.e;
          str = coeffToString(n.c);
          len = str.length;
          if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
            for (; len < i; str += "0", len++) ;
            str = toExponential(str, e);
          } else {
            i -= ne + (id === 2 && e > ne);
            str = toFixedPoint(str, e, "0");
            if (e + 1 > len) {
              if (--i > 0) for (str += "."; i--; str += "0") ;
            } else {
              i += e - len;
              if (i > 0) {
                if (e + 1 == len) str += ".";
                for (; i--; str += "0") ;
              }
            }
          }
        }
        return n.s < 0 && c0 ? "-" + str : str;
      }
      function maxOrMin(args, n) {
        var k, y, i = 1, x = new BigNumber3(args[0]);
        for (; i < args.length; i++) {
          y = new BigNumber3(args[i]);
          if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
            x = y;
          }
        }
        return x;
      }
      function normalise(n, c, e) {
        var i = 1, j = c.length;
        for (; !c[--j]; c.pop()) ;
        for (j = c[0]; j >= 10; j /= 10, i++) ;
        if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
          n.c = n.e = null;
        } else if (e < MIN_EXP) {
          n.c = [n.e = 0];
        } else {
          n.e = e;
          n.c = c;
        }
        return n;
      }
      parseNumeric = /* @__PURE__ */ function() {
        var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
        return function(x, str, isNum, b) {
          var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
          if (isInfinityOrNaN.test(s)) {
            x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
          } else {
            if (!isNum) {
              s = s.replace(basePrefix, function(m, p1, p2) {
                base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
                return !b || b == base ? p1 : m;
              });
              if (b) {
                base = b;
                s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
              }
              if (str != s) return new BigNumber3(s, base);
            }
            if (BigNumber3.DEBUG) {
              throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
            }
            x.s = null;
          }
          x.c = x.e = null;
        };
      }();
      function round(x, sd, rm, r) {
        var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
        if (xc) {
          out: {
            for (d = 1, k = xc[0]; k >= 10; k /= 10, d++) ;
            i = sd - d;
            if (i < 0) {
              i += LOG_BASE;
              j = sd;
              n = xc[ni = 0];
              rd = mathfloor(n / pows10[d - j - 1] % 10);
            } else {
              ni = mathceil((i + 1) / LOG_BASE);
              if (ni >= xc.length) {
                if (r) {
                  for (; xc.length <= ni; xc.push(0)) ;
                  n = rd = 0;
                  d = 1;
                  i %= LOG_BASE;
                  j = i - LOG_BASE + 1;
                } else {
                  break out;
                }
              } else {
                n = k = xc[ni];
                for (d = 1; k >= 10; k /= 10, d++) ;
                i %= LOG_BASE;
                j = i - LOG_BASE + d;
                rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
              }
            }
            r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
            // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
            // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
            xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
            r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
            (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
            if (sd < 1 || !xc[0]) {
              xc.length = 0;
              if (r) {
                sd -= x.e + 1;
                xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                x.e = -sd || 0;
              } else {
                xc[0] = x.e = 0;
              }
              return x;
            }
            if (i == 0) {
              xc.length = ni;
              k = 1;
              ni--;
            } else {
              xc.length = ni + 1;
              k = pows10[LOG_BASE - i];
              xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
            }
            if (r) {
              for (; ; ) {
                if (ni == 0) {
                  for (i = 1, j = xc[0]; j >= 10; j /= 10, i++) ;
                  j = xc[0] += k;
                  for (k = 1; j >= 10; j /= 10, k++) ;
                  if (i != k) {
                    x.e++;
                    if (xc[0] == BASE) xc[0] = 1;
                  }
                  break;
                } else {
                  xc[ni] += k;
                  if (xc[ni] != BASE) break;
                  xc[ni--] = 0;
                  k = 1;
                }
              }
            }
            for (i = xc.length; xc[--i] === 0; xc.pop()) ;
          }
          if (x.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (x.e < MIN_EXP) {
            x.c = [x.e = 0];
          }
        }
        return x;
      }
      function valueOf(n) {
        var str, e = n.e;
        if (e === null) return n.toString();
        str = coeffToString(n.c);
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
        return n.s < 0 ? "-" + str : str;
      }
      P.absoluteValue = P.abs = function() {
        var x = new BigNumber3(this);
        if (x.s < 0) x.s = 1;
        return x;
      };
      P.comparedTo = function(y, b) {
        return compare(this, new BigNumber3(y, b));
      };
      P.decimalPlaces = P.dp = function(dp, rm) {
        var c, n, v, x = this;
        if (dp != null) {
          intCheck(dp, 0, MAX);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          return round(new BigNumber3(x), dp + x.e + 1, rm);
        }
        if (!(c = x.c)) return null;
        n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
        if (v = c[v]) for (; v % 10 == 0; v /= 10, n--) ;
        if (n < 0) n = 0;
        return n;
      };
      P.dividedBy = P.div = function(y, b) {
        return div(this, new BigNumber3(y, b), DECIMAL_PLACES, ROUNDING_MODE);
      };
      P.dividedToIntegerBy = P.idiv = function(y, b) {
        return div(this, new BigNumber3(y, b), 0, 1);
      };
      P.exponentiatedBy = P.pow = function(n, m) {
        var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
        n = new BigNumber3(n);
        if (n.c && !n.isInteger()) {
          throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
        }
        if (m != null) m = new BigNumber3(m);
        nIsBig = n.e > 14;
        if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
          y = new BigNumber3(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
          return m ? y.mod(m) : y;
        }
        nIsNeg = n.s < 0;
        if (m) {
          if (m.c ? !m.c[0] : !m.s) return new BigNumber3(NaN);
          isModExp = !nIsNeg && x.isInteger() && m.isInteger();
          if (isModExp) x = x.mod(m);
        } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
          k = x.s < 0 && isOdd(n) ? -0 : 0;
          if (x.e > -1) k = 1 / k;
          return new BigNumber3(nIsNeg ? 1 / k : k);
        } else if (POW_PRECISION) {
          k = mathceil(POW_PRECISION / LOG_BASE + 2);
        }
        if (nIsBig) {
          half = new BigNumber3(0.5);
          if (nIsNeg) n.s = 1;
          nIsOdd = isOdd(n);
        } else {
          i = Math.abs(+valueOf(n));
          nIsOdd = i % 2;
        }
        y = new BigNumber3(ONE);
        for (; ; ) {
          if (nIsOdd) {
            y = y.times(x);
            if (!y.c) break;
            if (k) {
              if (y.c.length > k) y.c.length = k;
            } else if (isModExp) {
              y = y.mod(m);
            }
          }
          if (i) {
            i = mathfloor(i / 2);
            if (i === 0) break;
            nIsOdd = i % 2;
          } else {
            n = n.times(half);
            round(n, n.e + 1, 1);
            if (n.e > 14) {
              nIsOdd = isOdd(n);
            } else {
              i = +valueOf(n);
              if (i === 0) break;
              nIsOdd = i % 2;
            }
          }
          x = x.times(x);
          if (k) {
            if (x.c && x.c.length > k) x.c.length = k;
          } else if (isModExp) {
            x = x.mod(m);
          }
        }
        if (isModExp) return y;
        if (nIsNeg) y = ONE.div(y);
        return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
      };
      P.integerValue = function(rm) {
        var n = new BigNumber3(this);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);
        return round(n, n.e + 1, rm);
      };
      P.isEqualTo = P.eq = function(y, b) {
        return compare(this, new BigNumber3(y, b)) === 0;
      };
      P.isFinite = function() {
        return !!this.c;
      };
      P.isGreaterThan = P.gt = function(y, b) {
        return compare(this, new BigNumber3(y, b)) > 0;
      };
      P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
        return (b = compare(this, new BigNumber3(y, b))) === 1 || b === 0;
      };
      P.isInteger = function() {
        return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
      };
      P.isLessThan = P.lt = function(y, b) {
        return compare(this, new BigNumber3(y, b)) < 0;
      };
      P.isLessThanOrEqualTo = P.lte = function(y, b) {
        return (b = compare(this, new BigNumber3(y, b))) === -1 || b === 0;
      };
      P.isNaN = function() {
        return !this.s;
      };
      P.isNegative = function() {
        return this.s < 0;
      };
      P.isPositive = function() {
        return this.s > 0;
      };
      P.isZero = function() {
        return !!this.c && this.c[0] == 0;
      };
      P.minus = function(y, b) {
        var i, j, t, xLTy, x = this, a = x.s;
        y = new BigNumber3(y, b);
        b = y.s;
        if (!a || !b) return new BigNumber3(NaN);
        if (a != b) {
          y.s = -b;
          return x.plus(y);
        }
        var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
        if (!xe || !ye) {
          if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber3(yc ? x : NaN);
          if (!xc[0] || !yc[0]) {
            return yc[0] ? (y.s = -b, y) : new BigNumber3(xc[0] ? x : (
              // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
              ROUNDING_MODE == 3 ? -0 : 0
            ));
          }
        }
        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();
        if (a = xe - ye) {
          if (xLTy = a < 0) {
            a = -a;
            t = xc;
          } else {
            ye = xe;
            t = yc;
          }
          t.reverse();
          for (b = a; b--; t.push(0)) ;
          t.reverse();
        } else {
          j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
          for (a = b = 0; b < j; b++) {
            if (xc[b] != yc[b]) {
              xLTy = xc[b] < yc[b];
              break;
            }
          }
        }
        if (xLTy) {
          t = xc;
          xc = yc;
          yc = t;
          y.s = -y.s;
        }
        b = (j = yc.length) - (i = xc.length);
        if (b > 0) for (; b--; xc[i++] = 0) ;
        b = BASE - 1;
        for (; j > a; ) {
          if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i]; xc[i] = b) ;
            --xc[i];
            xc[j] += BASE;
          }
          xc[j] -= yc[j];
        }
        for (; xc[0] == 0; xc.splice(0, 1), --ye) ;
        if (!xc[0]) {
          y.s = ROUNDING_MODE == 3 ? -1 : 1;
          y.c = [y.e = 0];
          return y;
        }
        return normalise(y, xc, ye);
      };
      P.modulo = P.mod = function(y, b) {
        var q, s, x = this;
        y = new BigNumber3(y, b);
        if (!x.c || !y.s || y.c && !y.c[0]) {
          return new BigNumber3(NaN);
        } else if (!y.c || x.c && !x.c[0]) {
          return new BigNumber3(x);
        }
        if (MODULO_MODE == 9) {
          s = y.s;
          y.s = 1;
          q = div(x, y, 0, 3);
          y.s = s;
          q.s *= s;
        } else {
          q = div(x, y, 0, MODULO_MODE);
        }
        y = x.minus(q.times(y));
        if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
        return y;
      };
      P.multipliedBy = P.times = function(y, b) {
        var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber3(y, b)).c;
        if (!xc || !yc || !xc[0] || !yc[0]) {
          if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
            y.c = y.e = y.s = null;
          } else {
            y.s *= x.s;
            if (!xc || !yc) {
              y.c = y.e = null;
            } else {
              y.c = [0];
              y.e = 0;
            }
          }
          return y;
        }
        e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
        y.s *= x.s;
        xcL = xc.length;
        ycL = yc.length;
        if (xcL < ycL) {
          zc = xc;
          xc = yc;
          yc = zc;
          i = xcL;
          xcL = ycL;
          ycL = i;
        }
        for (i = xcL + ycL, zc = []; i--; zc.push(0)) ;
        base = BASE;
        sqrtBase = SQRT_BASE;
        for (i = ycL; --i >= 0; ) {
          c = 0;
          ylo = yc[i] % sqrtBase;
          yhi = yc[i] / sqrtBase | 0;
          for (k = xcL, j = i + k; j > i; ) {
            xlo = xc[--k] % sqrtBase;
            xhi = xc[k] / sqrtBase | 0;
            m = yhi * xlo + xhi * ylo;
            xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
            c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
            zc[j--] = xlo % base;
          }
          zc[j] = c;
        }
        if (c) {
          ++e;
        } else {
          zc.splice(0, 1);
        }
        return normalise(y, zc, e);
      };
      P.negated = function() {
        var x = new BigNumber3(this);
        x.s = -x.s || null;
        return x;
      };
      P.plus = function(y, b) {
        var t, x = this, a = x.s;
        y = new BigNumber3(y, b);
        b = y.s;
        if (!a || !b) return new BigNumber3(NaN);
        if (a != b) {
          y.s = -b;
          return x.minus(y);
        }
        var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
        if (!xe || !ye) {
          if (!xc || !yc) return new BigNumber3(a / 0);
          if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber3(xc[0] ? x : a * 0);
        }
        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();
        if (a = xe - ye) {
          if (a > 0) {
            ye = xe;
            t = yc;
          } else {
            a = -a;
            t = xc;
          }
          t.reverse();
          for (; a--; t.push(0)) ;
          t.reverse();
        }
        a = xc.length;
        b = yc.length;
        if (a - b < 0) {
          t = yc;
          yc = xc;
          xc = t;
          b = a;
        }
        for (a = 0; b; ) {
          a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
          xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
        }
        if (a) {
          xc = [a].concat(xc);
          ++ye;
        }
        return normalise(y, xc, ye);
      };
      P.precision = P.sd = function(sd, rm) {
        var c, n, v, x = this;
        if (sd != null && sd !== !!sd) {
          intCheck(sd, 1, MAX);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          return round(new BigNumber3(x), sd, rm);
        }
        if (!(c = x.c)) return null;
        v = c.length - 1;
        n = v * LOG_BASE + 1;
        if (v = c[v]) {
          for (; v % 10 == 0; v /= 10, n--) ;
          for (v = c[0]; v >= 10; v /= 10, n++) ;
        }
        if (sd && x.e + 1 > n) n = x.e + 1;
        return n;
      };
      P.shiftedBy = function(k) {
        intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
        return this.times("1e" + k);
      };
      P.squareRoot = P.sqrt = function() {
        var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber3("0.5");
        if (s !== 1 || !c || !c[0]) {
          return new BigNumber3(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
        }
        s = Math.sqrt(+valueOf(x));
        if (s == 0 || s == 1 / 0) {
          n = coeffToString(c);
          if ((n.length + e) % 2 == 0) n += "0";
          s = Math.sqrt(+n);
          e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
          if (s == 1 / 0) {
            n = "5e" + e;
          } else {
            n = s.toExponential();
            n = n.slice(0, n.indexOf("e") + 1) + e;
          }
          r = new BigNumber3(n);
        } else {
          r = new BigNumber3(s + "");
        }
        if (r.c[0]) {
          e = r.e;
          s = e + dp;
          if (s < 3) s = 0;
          for (; ; ) {
            t = r;
            r = half.times(t.plus(div(x, t, dp, 1)));
            if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
              if (r.e < e) --s;
              n = n.slice(s - 3, s + 1);
              if (n == "9999" || !rep && n == "4999") {
                if (!rep) {
                  round(t, t.e + DECIMAL_PLACES + 2, 0);
                  if (t.times(t).eq(x)) {
                    r = t;
                    break;
                  }
                }
                dp += 4;
                s += 4;
                rep = 1;
              } else {
                if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                  round(r, r.e + DECIMAL_PLACES + 2, 1);
                  m = !r.times(r).eq(x);
                }
                break;
              }
            }
          }
        }
        return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
      };
      P.toExponential = function(dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp++;
        }
        return format(this, dp, rm, 1);
      };
      P.toFixed = function(dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp = dp + this.e + 1;
        }
        return format(this, dp, rm);
      };
      P.toFormat = function(dp, rm, format2) {
        var str, x = this;
        if (format2 == null) {
          if (dp != null && rm && typeof rm == "object") {
            format2 = rm;
            rm = null;
          } else if (dp && typeof dp == "object") {
            format2 = dp;
            dp = rm = null;
          } else {
            format2 = FORMAT;
          }
        } else if (typeof format2 != "object") {
          throw Error(bignumberError + "Argument not an object: " + format2);
        }
        str = x.toFixed(dp, rm);
        if (x.c) {
          var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
          if (g2) {
            i = g1;
            g1 = g2;
            g2 = i;
            len -= i;
          }
          if (g1 > 0 && len > 0) {
            i = len % g1 || g1;
            intPart = intDigits.substr(0, i);
            for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
            if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
            if (isNeg) intPart = "-" + intPart;
          }
          str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(
            new RegExp("\\d{" + g2 + "}\\B", "g"),
            "$&" + (format2.fractionGroupSeparator || "")
          ) : fractionPart) : intPart;
        }
        return (format2.prefix || "") + str + (format2.suffix || "");
      };
      P.toFraction = function(md) {
        var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
        if (md != null) {
          n = new BigNumber3(md);
          if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
            throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
          }
        }
        if (!xc) return new BigNumber3(x);
        d = new BigNumber3(ONE);
        n1 = d0 = new BigNumber3(ONE);
        d1 = n0 = new BigNumber3(ONE);
        s = coeffToString(xc);
        e = d.e = s.length - x.e - 1;
        d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
        md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
        exp = MAX_EXP;
        MAX_EXP = 1 / 0;
        n = new BigNumber3(s);
        n0.c[0] = 0;
        for (; ; ) {
          q = div(n, d, 0, 1);
          d2 = d0.plus(q.times(d1));
          if (d2.comparedTo(md) == 1) break;
          d0 = d1;
          d1 = d2;
          n1 = n0.plus(q.times(d2 = n1));
          n0 = d2;
          d = n.minus(q.times(d2 = d));
          n = d2;
        }
        d2 = div(md.minus(d0), d1, 0, 1);
        n0 = n0.plus(d2.times(n1));
        d0 = d0.plus(d2.times(d1));
        n0.s = n1.s = x.s;
        e = e * 2;
        r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()
        ) < 1 ? [n1, d1] : [n0, d0];
        MAX_EXP = exp;
        return r;
      };
      P.toNumber = function() {
        return +valueOf(this);
      };
      P.toPrecision = function(sd, rm) {
        if (sd != null) intCheck(sd, 1, MAX);
        return format(this, sd, rm, 2);
      };
      P.toString = function(b) {
        var str, n = this, s = n.s, e = n.e;
        if (e === null) {
          if (s) {
            str = "Infinity";
            if (s < 0) str = "-" + str;
          } else {
            str = "NaN";
          }
        } else {
          if (b == null) {
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
          } else if (b === 10 && alphabetHasNormalDecimalDigits) {
            n = round(new BigNumber3(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
            str = toFixedPoint(coeffToString(n.c), n.e, "0");
          } else {
            intCheck(b, 2, ALPHABET.length, "Base");
            str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
          }
          if (s < 0 && n.c[0]) str = "-" + str;
        }
        return str;
      };
      P.valueOf = P.toJSON = function() {
        return valueOf(this);
      };
      P._isBigNumber = true;
      if (configObject != null) BigNumber3.set(configObject);
      return BigNumber3;
    }
    function bitFloor(n) {
      var i = n | 0;
      return n > 0 || n === i ? i : i - 1;
    }
    function coeffToString(a) {
      var s, z, i = 1, j = a.length, r = a[0] + "";
      for (; i < j; ) {
        s = a[i++] + "";
        z = LOG_BASE - s.length;
        for (; z--; s = "0" + s) ;
        r += s;
      }
      for (j = r.length; r.charCodeAt(--j) === 48; ) ;
      return r.slice(0, j + 1 || 1);
    }
    function compare(x, y) {
      var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
      if (!i || !j) return null;
      a = xc && !xc[0];
      b = yc && !yc[0];
      if (a || b) return a ? b ? 0 : -j : i;
      if (i != j) return i;
      a = i < 0;
      b = k == l;
      if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
      if (!b) return k > l ^ a ? 1 : -1;
      j = (k = xc.length) < (l = yc.length) ? k : l;
      for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
      return k == l ? 0 : k > l ^ a ? 1 : -1;
    }
    function intCheck(n, min, max, name2) {
      if (n < min || n > max || n !== mathfloor(n)) {
        throw Error(bignumberError + (name2 || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
      }
    }
    function isOdd(n) {
      var k = n.c.length - 1;
      return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
    }
    function toExponential(str, e) {
      return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
    }
    function toFixedPoint(str, e, z) {
      var len, zs;
      if (e < 0) {
        for (zs = z + "."; ++e; zs += z) ;
        str = zs + str;
      } else {
        len = str.length;
        if (++e > len) {
          for (zs = z, e -= len; --e; zs += z) ;
          str += zs;
        } else if (e < len) {
          str = str.slice(0, e) + "." + str.slice(e);
        }
      }
      return str;
    }
    BigNumber2 = clone();
    BigNumber2["default"] = BigNumber2.BigNumber = BigNumber2;
    if (module.exports) {
      module.exports = BigNumber2;
    } else {
      if (!globalObject) {
        globalObject = typeof self != "undefined" && self ? self : window;
      }
      globalObject.BigNumber = BigNumber2;
    }
  })(commonjsGlobal);
})(bignumber);
var bignumberExports = bignumber.exports;
(function(module) {
  var BigNumber2 = bignumberExports;
  var JSON2 = module.exports;
  (function() {
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
      // table of character substitutions
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\"
    }, rep;
    function quote(string) {
      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
        var c = meta[a];
        return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
      var i, k, v, length, mind = gap, partial, value = holder[key], isBigNumber = value != null && (value instanceof BigNumber2 || BigNumber2.isBigNumber(value));
      if (value && typeof value === "object" && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      }
      if (typeof rep === "function") {
        value = rep.call(holder, key, value);
      }
      switch (typeof value) {
        case "string":
          if (isBigNumber) {
            return value;
          } else {
            return quote(value);
          }
        case "number":
          return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
        case "bigint":
          return String(value);
        case "object":
          if (!value) {
            return "null";
          }
          gap += indent;
          partial = [];
          if (Object.prototype.toString.apply(value) === "[object Array]") {
            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || "null";
            }
            v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
            gap = mind;
            return v;
          }
          if (rep && typeof rep === "object") {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
              if (typeof rep[i] === "string") {
                k = rep[i];
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
              }
            }
          } else {
            Object.keys(value).forEach(function(k2) {
              var v2 = str(k2, value);
              if (v2) {
                partial.push(quote(k2) + (gap ? ": " : ":") + v2);
              }
            });
          }
          v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
          gap = mind;
          return v;
      }
    }
    if (typeof JSON2.stringify !== "function") {
      JSON2.stringify = function(value, replacer, space) {
        var i;
        gap = "";
        indent = "";
        if (typeof space === "number") {
          for (i = 0; i < space; i += 1) {
            indent += " ";
          }
        } else if (typeof space === "string") {
          indent = space;
        }
        rep = replacer;
        if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
          throw new Error("JSON.stringify");
        }
        return str("", { "": value });
      };
    }
  })();
})(stringify);
var stringifyExports = stringify.exports;
var BigNumber = null;
const suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
const suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
var json_parse$1 = function(options) {
  var _options = {
    strict: false,
    // not being strict means do not generate syntax errors for "duplicate key"
    storeAsString: false,
    // toggles whether the values should be stored as BigNumber (default) or a string
    alwaysParseAsBig: false,
    // toggles whether all numbers should be Big
    useNativeBigInt: false,
    // toggles whether to use native BigInt instead of bignumber.js
    protoAction: "error",
    constructorAction: "error"
  };
  if (options !== void 0 && options !== null) {
    if (options.strict === true) {
      _options.strict = true;
    }
    if (options.storeAsString === true) {
      _options.storeAsString = true;
    }
    _options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
    _options.useNativeBigInt = options.useNativeBigInt === true ? options.useNativeBigInt : false;
    if (typeof options.constructorAction !== "undefined") {
      if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve") {
        _options.constructorAction = options.constructorAction;
      } else {
        throw new Error(
          `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`
        );
      }
    }
    if (typeof options.protoAction !== "undefined") {
      if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve") {
        _options.protoAction = options.protoAction;
      } else {
        throw new Error(
          `Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`
        );
      }
    }
  }
  var at, ch, escapee = {
    '"': '"',
    "\\": "\\",
    "/": "/",
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "	"
  }, text, error = function(m) {
    throw {
      name: "SyntaxError",
      message: m,
      at,
      text
    };
  }, next = function(c) {
    if (c && c !== ch) {
      error("Expected '" + c + "' instead of '" + ch + "'");
    }
    ch = text.charAt(at);
    at += 1;
    return ch;
  }, number = function() {
    var number2, string2 = "";
    if (ch === "-") {
      string2 = "-";
      next("-");
    }
    while (ch >= "0" && ch <= "9") {
      string2 += ch;
      next();
    }
    if (ch === ".") {
      string2 += ".";
      while (next() && ch >= "0" && ch <= "9") {
        string2 += ch;
      }
    }
    if (ch === "e" || ch === "E") {
      string2 += ch;
      next();
      if (ch === "-" || ch === "+") {
        string2 += ch;
        next();
      }
      while (ch >= "0" && ch <= "9") {
        string2 += ch;
        next();
      }
    }
    number2 = +string2;
    if (!isFinite(number2)) {
      error("Bad number");
    } else {
      if (BigNumber == null) BigNumber = bignumberExports;
      if (string2.length > 15)
        return _options.storeAsString ? string2 : _options.useNativeBigInt ? BigInt(string2) : new BigNumber(string2);
      else
        return !_options.alwaysParseAsBig ? number2 : _options.useNativeBigInt ? BigInt(number2) : new BigNumber(number2);
    }
  }, string = function() {
    var hex, i, string2 = "", uffff;
    if (ch === '"') {
      var startAt = at;
      while (next()) {
        if (ch === '"') {
          if (at - 1 > startAt) string2 += text.substring(startAt, at - 1);
          next();
          return string2;
        }
        if (ch === "\\") {
          if (at - 1 > startAt) string2 += text.substring(startAt, at - 1);
          next();
          if (ch === "u") {
            uffff = 0;
            for (i = 0; i < 4; i += 1) {
              hex = parseInt(next(), 16);
              if (!isFinite(hex)) {
                break;
              }
              uffff = uffff * 16 + hex;
            }
            string2 += String.fromCharCode(uffff);
          } else if (typeof escapee[ch] === "string") {
            string2 += escapee[ch];
          } else {
            break;
          }
          startAt = at;
        }
      }
    }
    error("Bad string");
  }, white = function() {
    while (ch && ch <= " ") {
      next();
    }
  }, word = function() {
    switch (ch) {
      case "t":
        next("t");
        next("r");
        next("u");
        next("e");
        return true;
      case "f":
        next("f");
        next("a");
        next("l");
        next("s");
        next("e");
        return false;
      case "n":
        next("n");
        next("u");
        next("l");
        next("l");
        return null;
    }
    error("Unexpected '" + ch + "'");
  }, value, array = function() {
    var array2 = [];
    if (ch === "[") {
      next("[");
      white();
      if (ch === "]") {
        next("]");
        return array2;
      }
      while (ch) {
        array2.push(value());
        white();
        if (ch === "]") {
          next("]");
          return array2;
        }
        next(",");
        white();
      }
    }
    error("Bad array");
  }, object = function() {
    var key, object2 = /* @__PURE__ */ Object.create(null);
    if (ch === "{") {
      next("{");
      white();
      if (ch === "}") {
        next("}");
        return object2;
      }
      while (ch) {
        key = string();
        white();
        next(":");
        if (_options.strict === true && Object.hasOwnProperty.call(object2, key)) {
          error('Duplicate key "' + key + '"');
        }
        if (suspectProtoRx.test(key) === true) {
          if (_options.protoAction === "error") {
            error("Object contains forbidden prototype property");
          } else if (_options.protoAction === "ignore") {
            value();
          } else {
            object2[key] = value();
          }
        } else if (suspectConstructorRx.test(key) === true) {
          if (_options.constructorAction === "error") {
            error("Object contains forbidden constructor property");
          } else if (_options.constructorAction === "ignore") {
            value();
          } else {
            object2[key] = value();
          }
        } else {
          object2[key] = value();
        }
        white();
        if (ch === "}") {
          next("}");
          return object2;
        }
        next(",");
        white();
      }
    }
    error("Bad object");
  };
  value = function() {
    white();
    switch (ch) {
      case "{":
        return object();
      case "[":
        return array();
      case '"':
        return string();
      case "-":
        return number();
      default:
        return ch >= "0" && ch <= "9" ? number() : word();
    }
  };
  return function(source, reviver) {
    var result;
    text = source + "";
    at = 0;
    ch = " ";
    result = value();
    white();
    if (ch) {
      error("Syntax error");
    }
    return typeof reviver === "function" ? function walk(holder, key) {
      var v, value2 = holder[key];
      if (value2 && typeof value2 === "object") {
        Object.keys(value2).forEach(function(k) {
          v = walk(value2, k);
          if (v !== void 0) {
            value2[k] = v;
          } else {
            delete value2[k];
          }
        });
      }
      return reviver.call(holder, key, value2);
    }({ "": result }, "") : result;
  };
};
var parse = json_parse$1;
var json_stringify = stringifyExports.stringify;
var json_parse = parse;
jsonBigint.exports = function(options) {
  return {
    parse: json_parse(options),
    stringify: json_stringify
  };
};
jsonBigint.exports.parse = json_parse();
jsonBigint.exports.stringify = json_stringify;
var jsonBigintExports = jsonBigint.exports;
var gcpResidency = {};
(function(exports$12) {
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.GCE_LINUX_BIOS_PATHS = void 0;
  exports$12.isGoogleCloudServerless = isGoogleCloudServerless;
  exports$12.isGoogleComputeEngineLinux = isGoogleComputeEngineLinux;
  exports$12.isGoogleComputeEngineMACAddress = isGoogleComputeEngineMACAddress;
  exports$12.isGoogleComputeEngine = isGoogleComputeEngine;
  exports$12.detectGCPResidency = detectGCPResidency;
  const fs_1 = fs$4;
  const os_1 = require$$1$1;
  exports$12.GCE_LINUX_BIOS_PATHS = {
    BIOS_DATE: "/sys/class/dmi/id/bios_date",
    BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
  };
  const GCE_MAC_ADDRESS_REGEX = /^42:01/;
  function isGoogleCloudServerless() {
    const isGFEnvironment = process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE;
    return !!isGFEnvironment;
  }
  function isGoogleComputeEngineLinux() {
    if ((0, os_1.platform)() !== "linux")
      return false;
    try {
      (0, fs_1.statSync)(exports$12.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
      const biosVendor = (0, fs_1.readFileSync)(exports$12.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
      return /Google/.test(biosVendor);
    } catch {
      return false;
    }
  }
  function isGoogleComputeEngineMACAddress() {
    const interfaces = (0, os_1.networkInterfaces)();
    for (const item of Object.values(interfaces)) {
      if (!item)
        continue;
      for (const { mac } of item) {
        if (GCE_MAC_ADDRESS_REGEX.test(mac)) {
          return true;
        }
      }
    }
    return false;
  }
  function isGoogleComputeEngine() {
    return isGoogleComputeEngineLinux() || isGoogleComputeEngineMACAddress();
  }
  function detectGCPResidency() {
    return isGoogleCloudServerless() || isGoogleComputeEngine();
  }
})(gcpResidency);
var src$1 = {};
var loggingUtils = {};
var colours = {};
Object.defineProperty(colours, "__esModule", { value: true });
colours.Colours = void 0;
class Colours {
  /**
   * @param stream The stream (e.g. process.stderr)
   * @returns true if the stream should have colourization enabled
   */
  static isEnabled(stream2) {
    return stream2 && // May happen in browsers.
    stream2.isTTY && (typeof stream2.getColorDepth === "function" ? stream2.getColorDepth() > 2 : true);
  }
  static refresh() {
    Colours.enabled = Colours.isEnabled(process === null || process === void 0 ? void 0 : process.stderr);
    if (!this.enabled) {
      Colours.reset = "";
      Colours.bright = "";
      Colours.dim = "";
      Colours.red = "";
      Colours.green = "";
      Colours.yellow = "";
      Colours.blue = "";
      Colours.magenta = "";
      Colours.cyan = "";
      Colours.white = "";
      Colours.grey = "";
    } else {
      Colours.reset = "\x1B[0m";
      Colours.bright = "\x1B[1m";
      Colours.dim = "\x1B[2m";
      Colours.red = "\x1B[31m";
      Colours.green = "\x1B[32m";
      Colours.yellow = "\x1B[33m";
      Colours.blue = "\x1B[34m";
      Colours.magenta = "\x1B[35m";
      Colours.cyan = "\x1B[36m";
      Colours.white = "\x1B[37m";
      Colours.grey = "\x1B[90m";
    }
  }
}
colours.Colours = Colours;
Colours.enabled = false;
Colours.reset = "";
Colours.bright = "";
Colours.dim = "";
Colours.red = "";
Colours.green = "";
Colours.yellow = "";
Colours.blue = "";
Colours.magenta = "";
Colours.cyan = "";
Colours.white = "";
Colours.grey = "";
Colours.refresh();
(function(exports$12) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || /* @__PURE__ */ function() {
    var ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    return function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
      }
      __setModuleDefault(result, mod);
      return result;
    };
  }();
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.env = exports$12.DebugLogBackendBase = exports$12.placeholder = exports$12.AdhocDebugLogger = exports$12.LogSeverity = void 0;
  exports$12.getNodeBackend = getNodeBackend;
  exports$12.getDebugBackend = getDebugBackend;
  exports$12.getStructuredBackend = getStructuredBackend;
  exports$12.setBackend = setBackend;
  exports$12.log = log;
  const events_1 = require$$0$2;
  const process2 = __importStar(require$$1$2);
  const util2 = __importStar(require$$2);
  const colours_1 = colours;
  var LogSeverity;
  (function(LogSeverity2) {
    LogSeverity2["DEFAULT"] = "DEFAULT";
    LogSeverity2["DEBUG"] = "DEBUG";
    LogSeverity2["INFO"] = "INFO";
    LogSeverity2["WARNING"] = "WARNING";
    LogSeverity2["ERROR"] = "ERROR";
  })(LogSeverity || (exports$12.LogSeverity = LogSeverity = {}));
  class AdhocDebugLogger extends events_1.EventEmitter {
    /**
     * @param upstream The backend will pass a function that will be
     *   called whenever our logger function is invoked.
     */
    constructor(namespace, upstream) {
      super();
      this.namespace = namespace;
      this.upstream = upstream;
      this.func = Object.assign(this.invoke.bind(this), {
        // Also add an instance pointer back to us.
        instance: this,
        // And pull over the EventEmitter functionality.
        on: (event, listener) => this.on(event, listener)
      });
      this.func.debug = (...args) => this.invokeSeverity(LogSeverity.DEBUG, ...args);
      this.func.info = (...args) => this.invokeSeverity(LogSeverity.INFO, ...args);
      this.func.warn = (...args) => this.invokeSeverity(LogSeverity.WARNING, ...args);
      this.func.error = (...args) => this.invokeSeverity(LogSeverity.ERROR, ...args);
      this.func.sublog = (namespace2) => log(namespace2, this.func);
    }
    invoke(fields, ...args) {
      if (this.upstream) {
        try {
          this.upstream(fields, ...args);
        } catch (e) {
        }
      }
      try {
        this.emit("log", fields, args);
      } catch (e) {
      }
    }
    invokeSeverity(severity, ...args) {
      this.invoke({ severity }, ...args);
    }
  }
  exports$12.AdhocDebugLogger = AdhocDebugLogger;
  exports$12.placeholder = new AdhocDebugLogger("", () => {
  }).func;
  class DebugLogBackendBase {
    constructor() {
      var _a2;
      this.cached = /* @__PURE__ */ new Map();
      this.filters = [];
      this.filtersSet = false;
      let nodeFlag = (_a2 = process2.env[exports$12.env.nodeEnables]) !== null && _a2 !== void 0 ? _a2 : "*";
      if (nodeFlag === "all") {
        nodeFlag = "*";
      }
      this.filters = nodeFlag.split(",");
    }
    log(namespace, fields, ...args) {
      try {
        if (!this.filtersSet) {
          this.setFilters();
          this.filtersSet = true;
        }
        let logger = this.cached.get(namespace);
        if (!logger) {
          logger = this.makeLogger(namespace);
          this.cached.set(namespace, logger);
        }
        logger(fields, ...args);
      } catch (e) {
        console.error(e);
      }
    }
  }
  exports$12.DebugLogBackendBase = DebugLogBackendBase;
  class NodeBackend extends DebugLogBackendBase {
    constructor() {
      super(...arguments);
      this.enabledRegexp = /.*/g;
    }
    isEnabled(namespace) {
      return this.enabledRegexp.test(namespace);
    }
    makeLogger(namespace) {
      if (!this.enabledRegexp.test(namespace)) {
        return () => {
        };
      }
      return (fields, ...args) => {
        var _a2;
        const nscolour = `${colours_1.Colours.green}${namespace}${colours_1.Colours.reset}`;
        const pid = `${colours_1.Colours.yellow}${process2.pid}${colours_1.Colours.reset}`;
        let level;
        switch (fields.severity) {
          case LogSeverity.ERROR:
            level = `${colours_1.Colours.red}${fields.severity}${colours_1.Colours.reset}`;
            break;
          case LogSeverity.INFO:
            level = `${colours_1.Colours.magenta}${fields.severity}${colours_1.Colours.reset}`;
            break;
          case LogSeverity.WARNING:
            level = `${colours_1.Colours.yellow}${fields.severity}${colours_1.Colours.reset}`;
            break;
          default:
            level = (_a2 = fields.severity) !== null && _a2 !== void 0 ? _a2 : LogSeverity.DEFAULT;
            break;
        }
        const msg = util2.formatWithOptions({ colors: colours_1.Colours.enabled }, ...args);
        const filteredFields = Object.assign({}, fields);
        delete filteredFields.severity;
        const fieldsJson = Object.getOwnPropertyNames(filteredFields).length ? JSON.stringify(filteredFields) : "";
        const fieldsColour = fieldsJson ? `${colours_1.Colours.grey}${fieldsJson}${colours_1.Colours.reset}` : "";
        console.error("%s [%s|%s] %s%s", pid, nscolour, level, msg, fieldsJson ? ` ${fieldsColour}` : "");
      };
    }
    // Regexp patterns below are from here:
    // https://github.com/nodejs/node/blob/c0aebed4b3395bd65d54b18d1fd00f071002ac20/lib/internal/util/debuglog.js#L36
    setFilters() {
      const totalFilters = this.filters.join(",");
      const regexp = totalFilters.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
      this.enabledRegexp = new RegExp(`^${regexp}$`, "i");
    }
  }
  function getNodeBackend() {
    return new NodeBackend();
  }
  class DebugBackend extends DebugLogBackendBase {
    constructor(pkg2) {
      super();
      this.debugPkg = pkg2;
    }
    makeLogger(namespace) {
      const debugLogger = this.debugPkg(namespace);
      return (fields, ...args) => {
        debugLogger(args[0], ...args.slice(1));
      };
    }
    setFilters() {
      var _a2;
      const existingFilters = (_a2 = process2.env["NODE_DEBUG"]) !== null && _a2 !== void 0 ? _a2 : "";
      process2.env["NODE_DEBUG"] = `${existingFilters}${existingFilters ? "," : ""}${this.filters.join(",")}`;
    }
  }
  function getDebugBackend(debugPkg) {
    return new DebugBackend(debugPkg);
  }
  class StructuredBackend extends DebugLogBackendBase {
    constructor(upstream) {
      var _a2;
      super();
      this.upstream = (_a2 = upstream) !== null && _a2 !== void 0 ? _a2 : void 0;
    }
    makeLogger(namespace) {
      var _a2;
      const debugLogger = (_a2 = this.upstream) === null || _a2 === void 0 ? void 0 : _a2.makeLogger(namespace);
      return (fields, ...args) => {
        var _a22;
        const severity = (_a22 = fields.severity) !== null && _a22 !== void 0 ? _a22 : LogSeverity.INFO;
        const json = Object.assign({
          severity,
          message: util2.format(...args)
        }, fields);
        const jsonString = JSON.stringify(json);
        if (debugLogger) {
          debugLogger(fields, jsonString);
        } else {
          console.log("%s", jsonString);
        }
      };
    }
    setFilters() {
      var _a2;
      (_a2 = this.upstream) === null || _a2 === void 0 ? void 0 : _a2.setFilters();
    }
  }
  function getStructuredBackend(upstream) {
    return new StructuredBackend(upstream);
  }
  exports$12.env = {
    /**
     * Filter wildcards specific to the Node syntax, and similar to the built-in
     * utils.debuglog() environment variable. If missing, disables logging.
     */
    nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
  };
  const loggerCache = /* @__PURE__ */ new Map();
  let cachedBackend = void 0;
  function setBackend(backend) {
    cachedBackend = backend;
    loggerCache.clear();
  }
  function log(namespace, parent) {
    if (!cachedBackend) {
      const enablesFlag = process2.env[exports$12.env.nodeEnables];
      if (!enablesFlag) {
        return exports$12.placeholder;
      }
    }
    if (!namespace) {
      return exports$12.placeholder;
    }
    if (parent) {
      namespace = `${parent.instance.namespace}:${namespace}`;
    }
    const existing = loggerCache.get(namespace);
    if (existing) {
      return existing.func;
    }
    if (cachedBackend === null) {
      return exports$12.placeholder;
    } else if (cachedBackend === void 0) {
      cachedBackend = getNodeBackend();
    }
    const logger = (() => {
      let previousBackend = void 0;
      const newLogger = new AdhocDebugLogger(namespace, (fields, ...args) => {
        if (previousBackend !== cachedBackend) {
          if (cachedBackend === null) {
            return;
          } else if (cachedBackend === void 0) {
            cachedBackend = getNodeBackend();
          }
          previousBackend = cachedBackend;
        }
        cachedBackend === null || cachedBackend === void 0 ? void 0 : cachedBackend.log(namespace, fields, ...args);
      });
      return newLogger;
    })();
    loggerCache.set(namespace, logger);
    return logger.func;
  }
})(loggingUtils);
(function(exports$12) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports$13) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$13, p)) __createBinding(exports$13, m, p);
  };
  Object.defineProperty(exports$12, "__esModule", { value: true });
  __exportStar(loggingUtils, exports$12);
})(src$1);
(function(exports$12) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || /* @__PURE__ */ function() {
    var ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    return function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
      }
      __setModuleDefault(result, mod);
      return result;
    };
  }();
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.gcpResidencyCache = exports$12.METADATA_SERVER_DETECTION = exports$12.HEADERS = exports$12.HEADER_VALUE = exports$12.HEADER_NAME = exports$12.SECONDARY_HOST_ADDRESS = exports$12.HOST_ADDRESS = exports$12.BASE_PATH = void 0;
  exports$12.instance = instance;
  exports$12.project = project;
  exports$12.universe = universe;
  exports$12.bulk = bulk;
  exports$12.isAvailable = isAvailable;
  exports$12.resetIsAvailableCache = resetIsAvailableCache;
  exports$12.getGCPResidency = getGCPResidency;
  exports$12.setGCPResidency = setGCPResidency;
  exports$12.requestTimeout = requestTimeout;
  const gaxios_12 = src$3;
  const jsonBigint2 = jsonBigintExports;
  const gcp_residency_1 = gcpResidency;
  const logger = __importStar(src$1);
  exports$12.BASE_PATH = "/computeMetadata/v1";
  exports$12.HOST_ADDRESS = "http://169.254.169.254";
  exports$12.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
  exports$12.HEADER_NAME = "Metadata-Flavor";
  exports$12.HEADER_VALUE = "Google";
  exports$12.HEADERS = Object.freeze({ [exports$12.HEADER_NAME]: exports$12.HEADER_VALUE });
  const log = logger.log("gcp-metadata");
  exports$12.METADATA_SERVER_DETECTION = Object.freeze({
    "assume-present": "don't try to ping the metadata server, but assume it's present",
    none: "don't try to ping the metadata server, but don't try to use it either",
    "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
    "ping-only": "skip the BIOS probe, and go straight to pinging"
  });
  function getBaseUrl(baseUrl) {
    if (!baseUrl) {
      baseUrl = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || exports$12.HOST_ADDRESS;
    }
    if (!/^https?:\/\//.test(baseUrl)) {
      baseUrl = `http://${baseUrl}`;
    }
    return new URL(exports$12.BASE_PATH, baseUrl).href;
  }
  function validate(options) {
    Object.keys(options).forEach((key) => {
      switch (key) {
        case "params":
        case "property":
        case "headers":
          break;
        case "qs":
          throw new Error("'qs' is not a valid configuration option. Please use 'params' instead.");
        default:
          throw new Error(`'${key}' is not a valid configuration option.`);
      }
    });
  }
  async function metadataAccessor(type, options = {}, noResponseRetries = 3, fastFail = false) {
    const headers = new Headers(exports$12.HEADERS);
    let metadataKey = "";
    let params = {};
    if (typeof type === "object") {
      const metadataAccessor2 = type;
      new Headers(metadataAccessor2.headers).forEach((value, key) => headers.set(key, value));
      metadataKey = metadataAccessor2.metadataKey;
      params = metadataAccessor2.params || params;
      noResponseRetries = metadataAccessor2.noResponseRetries || noResponseRetries;
      fastFail = metadataAccessor2.fastFail || fastFail;
    } else {
      metadataKey = type;
    }
    if (typeof options === "string") {
      metadataKey += `/${options}`;
    } else {
      validate(options);
      if (options.property) {
        metadataKey += `/${options.property}`;
      }
      new Headers(options.headers).forEach((value, key) => headers.set(key, value));
      params = options.params || params;
    }
    const requestMethod = fastFail ? fastFailMetadataRequest : gaxios_12.request;
    const req = {
      url: `${getBaseUrl()}/${metadataKey}`,
      headers,
      retryConfig: { noResponseRetries },
      params,
      responseType: "text",
      timeout: requestTimeout()
    };
    log.info("instance request %j", req);
    const res = await requestMethod(req);
    log.info("instance metadata is %s", res.data);
    const metadataFlavor = res.headers.get(exports$12.HEADER_NAME);
    if (metadataFlavor !== exports$12.HEADER_VALUE) {
      throw new RangeError(`Invalid response from metadata service: incorrect ${exports$12.HEADER_NAME} header. Expected '${exports$12.HEADER_VALUE}', got ${metadataFlavor ? `'${metadataFlavor}'` : "no header"}`);
    }
    if (typeof res.data === "string") {
      try {
        return jsonBigint2.parse(res.data);
      } catch {
      }
    }
    return res.data;
  }
  async function fastFailMetadataRequest(options) {
    var _a2;
    const secondaryOptions = {
      ...options,
      url: (_a2 = options.url) == null ? void 0 : _a2.toString().replace(getBaseUrl(), getBaseUrl(exports$12.SECONDARY_HOST_ADDRESS))
    };
    const r1 = (0, gaxios_12.request)(options);
    const r2 = (0, gaxios_12.request)(secondaryOptions);
    return Promise.any([r1, r2]);
  }
  function instance(options) {
    return metadataAccessor("instance", options);
  }
  function project(options) {
    return metadataAccessor("project", options);
  }
  function universe(options) {
    return metadataAccessor("universe", options);
  }
  async function bulk(properties) {
    const r = {};
    await Promise.all(properties.map((item) => {
      return (async () => {
        const res = await metadataAccessor(item);
        const key = item.metadataKey;
        r[key] = res;
      })();
    }));
    return r;
  }
  function detectGCPAvailableRetries() {
    return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0;
  }
  let cachedIsAvailableResponse;
  async function isAvailable() {
    if (process.env.METADATA_SERVER_DETECTION) {
      const value = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
      if (!(value in exports$12.METADATA_SERVER_DETECTION)) {
        throw new RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${value}\`, but it should be \`${Object.keys(exports$12.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
      }
      switch (value) {
        case "assume-present":
          return true;
        case "none":
          return false;
        case "bios-only":
          return getGCPResidency();
      }
    }
    try {
      if (cachedIsAvailableResponse === void 0) {
        cachedIsAvailableResponse = metadataAccessor(
          "instance",
          void 0,
          detectGCPAvailableRetries(),
          // If the default HOST_ADDRESS has been overridden, we should not
          // make an effort to try SECONDARY_HOST_ADDRESS (as we are likely in
          // a non-GCP environment):
          !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST)
        );
      }
      await cachedIsAvailableResponse;
      return true;
    } catch (e) {
      const err = e;
      if (process.env.DEBUG_AUTH) {
        console.info(err);
      }
      if (err.type === "request-timeout") {
        return false;
      }
      if (err.response && err.response.status === 404) {
        return false;
      } else {
        if (!(err.response && err.response.status === 404) && // A warning is emitted if we see an unexpected err.code, or err.code
        // is not populated:
        (!err.code || ![
          "EHOSTDOWN",
          "EHOSTUNREACH",
          "ENETUNREACH",
          "ENOENT",
          "ENOTFOUND",
          "ECONNREFUSED"
        ].includes(err.code.toString()))) {
          let code2 = "UNKNOWN";
          if (err.code)
            code2 = err.code.toString();
          process.emitWarning(`received unexpected error = ${err.message} code = ${code2}`, "MetadataLookupWarning");
        }
        return false;
      }
    }
  }
  function resetIsAvailableCache() {
    cachedIsAvailableResponse = void 0;
  }
  exports$12.gcpResidencyCache = null;
  function getGCPResidency() {
    if (exports$12.gcpResidencyCache === null) {
      setGCPResidency();
    }
    return exports$12.gcpResidencyCache;
  }
  function setGCPResidency(value = null) {
    exports$12.gcpResidencyCache = value !== null ? value : (0, gcp_residency_1.detectGCPResidency)();
  }
  function requestTimeout() {
    return getGCPResidency() ? 0 : 3e3;
  }
  __exportStar(gcpResidency, exports$12);
})(src$2);
var crypto$5 = {};
var crypto$4 = {};
var base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end2) {
  var tmp;
  var output = [];
  for (var i = start; i < end2; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var shared$1 = {};
Object.defineProperty(shared$1, "__esModule", { value: true });
shared$1.fromArrayBufferToHex = fromArrayBufferToHex;
function fromArrayBufferToHex(arrayBuffer) {
  const byteArray = Array.from(new Uint8Array(arrayBuffer));
  return byteArray.map((byte) => {
    return byte.toString(16).padStart(2, "0");
  }).join("");
}
Object.defineProperty(crypto$4, "__esModule", { value: true });
crypto$4.BrowserCrypto = void 0;
const base64js = base64Js;
const shared_1 = shared$1;
class BrowserCrypto {
  constructor() {
    if (typeof window === "undefined" || window.crypto === void 0 || window.crypto.subtle === void 0) {
      throw new Error("SubtleCrypto not found. Make sure it's an https:// website.");
    }
  }
  async sha256DigestBase64(str) {
    const inputBuffer = new TextEncoder().encode(str);
    const outputBuffer = await window.crypto.subtle.digest("SHA-256", inputBuffer);
    return base64js.fromByteArray(new Uint8Array(outputBuffer));
  }
  randomBytesBase64(count) {
    const array = new Uint8Array(count);
    window.crypto.getRandomValues(array);
    return base64js.fromByteArray(array);
  }
  static padBase64(base64) {
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    return base64;
  }
  async verify(pubkey, data, signature) {
    const algo = {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    };
    const dataArray = new TextEncoder().encode(data);
    const signatureArray = base64js.toByteArray(BrowserCrypto.padBase64(signature));
    const cryptoKey = await window.crypto.subtle.importKey("jwk", pubkey, algo, true, ["verify"]);
    const result = await window.crypto.subtle.verify(algo, cryptoKey, signatureArray, dataArray);
    return result;
  }
  async sign(privateKey, data) {
    const algo = {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    };
    const dataArray = new TextEncoder().encode(data);
    const cryptoKey = await window.crypto.subtle.importKey("jwk", privateKey, algo, true, ["sign"]);
    const result = await window.crypto.subtle.sign(algo, cryptoKey, dataArray);
    return base64js.fromByteArray(new Uint8Array(result));
  }
  decodeBase64StringUtf8(base64) {
    const uint8array = base64js.toByteArray(BrowserCrypto.padBase64(base64));
    const result = new TextDecoder().decode(uint8array);
    return result;
  }
  encodeBase64StringUtf8(text) {
    const uint8array = new TextEncoder().encode(text);
    const result = base64js.fromByteArray(uint8array);
    return result;
  }
  /**
   * Computes the SHA-256 hash of the provided string.
   * @param str The plain text string to hash.
   * @return A promise that resolves with the SHA-256 hash of the provided
   *   string in hexadecimal encoding.
   */
  async sha256DigestHex(str) {
    const inputBuffer = new TextEncoder().encode(str);
    const outputBuffer = await window.crypto.subtle.digest("SHA-256", inputBuffer);
    return (0, shared_1.fromArrayBufferToHex)(outputBuffer);
  }
  /**
   * Computes the HMAC hash of a message using the provided crypto key and the
   * SHA-256 algorithm.
   * @param key The secret crypto key in utf-8 or ArrayBuffer format.
   * @param msg The plain text message.
   * @return A promise that resolves with the HMAC-SHA256 hash in ArrayBuffer
   *   format.
   */
  async signWithHmacSha256(key, msg) {
    const rawKey = typeof key === "string" ? key : String.fromCharCode(...new Uint16Array(key));
    const enc = new TextEncoder();
    const cryptoKey = await window.crypto.subtle.importKey("raw", enc.encode(rawKey), {
      name: "HMAC",
      hash: {
        name: "SHA-256"
      }
    }, false, ["sign"]);
    return window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
  }
}
crypto$4.BrowserCrypto = BrowserCrypto;
var crypto$3 = {};
Object.defineProperty(crypto$3, "__esModule", { value: true });
crypto$3.NodeCrypto = void 0;
const crypto$2 = require$$0$3;
class NodeCrypto {
  async sha256DigestBase64(str) {
    return crypto$2.createHash("sha256").update(str).digest("base64");
  }
  randomBytesBase64(count) {
    return crypto$2.randomBytes(count).toString("base64");
  }
  async verify(pubkey, data, signature) {
    const verifier = crypto$2.createVerify("RSA-SHA256");
    verifier.update(data);
    verifier.end();
    return verifier.verify(pubkey, signature, "base64");
  }
  async sign(privateKey, data) {
    const signer = crypto$2.createSign("RSA-SHA256");
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, "base64");
  }
  decodeBase64StringUtf8(base64) {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  encodeBase64StringUtf8(text) {
    return Buffer.from(text, "utf-8").toString("base64");
  }
  /**
   * Computes the SHA-256 hash of the provided string.
   * @param str The plain text string to hash.
   * @return A promise that resolves with the SHA-256 hash of the provided
   *   string in hexadecimal encoding.
   */
  async sha256DigestHex(str) {
    return crypto$2.createHash("sha256").update(str).digest("hex");
  }
  /**
   * Computes the HMAC hash of a message using the provided crypto key and the
   * SHA-256 algorithm.
   * @param key The secret crypto key in utf-8 or ArrayBuffer format.
   * @param msg The plain text message.
   * @return A promise that resolves with the HMAC-SHA256 hash in ArrayBuffer
   *   format.
   */
  async signWithHmacSha256(key, msg) {
    const cryptoKey = typeof key === "string" ? key : toBuffer(key);
    return toArrayBuffer(crypto$2.createHmac("sha256", cryptoKey).update(msg).digest());
  }
}
crypto$3.NodeCrypto = NodeCrypto;
function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
function toBuffer(arrayBuffer) {
  return Buffer.from(arrayBuffer);
}
(function(exports$12) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports$13) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$13, p)) __createBinding(exports$13, m, p);
  };
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.createCrypto = createCrypto;
  exports$12.hasBrowserCrypto = hasBrowserCrypto;
  const crypto_12 = crypto$4;
  const crypto_2 = crypto$3;
  __exportStar(shared$1, exports$12);
  function createCrypto() {
    if (hasBrowserCrypto()) {
      return new crypto_12.BrowserCrypto();
    }
    return new crypto_2.NodeCrypto();
  }
  function hasBrowserCrypto() {
    return typeof window !== "undefined" && typeof window.crypto !== "undefined" && typeof window.crypto.subtle !== "undefined";
  }
})(crypto$5);
var computeclient = {};
var oauth2client = {};
var safeBuffer = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(module, exports$12) {
  var buffer = require$$0$4;
  var Buffer2 = buffer.Buffer;
  function copyProps(src2, dst) {
    for (var key in src2) {
      dst[key] = src2[key];
    }
  }
  if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports$12);
    exports$12.Buffer = SafeBuffer;
  }
  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer2(arg, encodingOrOffset, length);
  }
  SafeBuffer.prototype = Object.create(Buffer2.prototype);
  copyProps(Buffer2, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer2(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer2(size);
    if (fill !== void 0) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer2(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
})(safeBuffer, safeBuffer.exports);
var safeBufferExports = safeBuffer.exports;
function getParamSize(keySize) {
  var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
  return result;
}
var paramBytesForAlg = {
  ES256: getParamSize(256),
  ES384: getParamSize(384),
  ES512: getParamSize(521)
};
function getParamBytesForAlg$1(alg) {
  var paramBytes = paramBytesForAlg[alg];
  if (paramBytes) {
    return paramBytes;
  }
  throw new Error('Unknown algorithm "' + alg + '"');
}
var paramBytesForAlg_1 = getParamBytesForAlg$1;
var Buffer$6 = safeBufferExports.Buffer;
var getParamBytesForAlg = paramBytesForAlg_1;
var MAX_OCTET = 128, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 32, TAG_SEQ = 16, TAG_INT = 2, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
function base64Url(base64) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function signatureAsBuffer(signature) {
  if (Buffer$6.isBuffer(signature)) {
    return signature;
  } else if ("string" === typeof signature) {
    return Buffer$6.from(signature, "base64");
  }
  throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
}
function derToJose(signature, alg) {
  signature = signatureAsBuffer(signature);
  var paramBytes = getParamBytesForAlg(alg);
  var maxEncodedParamLength = paramBytes + 1;
  var inputLength = signature.length;
  var offset = 0;
  if (signature[offset++] !== ENCODED_TAG_SEQ) {
    throw new Error('Could not find expected "seq"');
  }
  var seqLength = signature[offset++];
  if (seqLength === (MAX_OCTET | 1)) {
    seqLength = signature[offset++];
  }
  if (inputLength - offset < seqLength) {
    throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
  }
  if (signature[offset++] !== ENCODED_TAG_INT) {
    throw new Error('Could not find expected "int" for "r"');
  }
  var rLength = signature[offset++];
  if (inputLength - offset - 2 < rLength) {
    throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
  }
  if (maxEncodedParamLength < rLength) {
    throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
  }
  var rOffset = offset;
  offset += rLength;
  if (signature[offset++] !== ENCODED_TAG_INT) {
    throw new Error('Could not find expected "int" for "s"');
  }
  var sLength = signature[offset++];
  if (inputLength - offset !== sLength) {
    throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
  }
  if (maxEncodedParamLength < sLength) {
    throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
  }
  var sOffset = offset;
  offset += sLength;
  if (offset !== inputLength) {
    throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
  }
  var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
  var dst = Buffer$6.allocUnsafe(rPadding + rLength + sPadding + sLength);
  for (offset = 0; offset < rPadding; ++offset) {
    dst[offset] = 0;
  }
  signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
  offset = paramBytes;
  for (var o = offset; offset < o + sPadding; ++offset) {
    dst[offset] = 0;
  }
  signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
  dst = dst.toString("base64");
  dst = base64Url(dst);
  return dst;
}
function countPadding(buf, start, stop) {
  var padding = 0;
  while (start + padding < stop && buf[start + padding] === 0) {
    ++padding;
  }
  var needsSign = buf[start + padding] >= MAX_OCTET;
  if (needsSign) {
    --padding;
  }
  return padding;
}
function joseToDer(signature, alg) {
  signature = signatureAsBuffer(signature);
  var paramBytes = getParamBytesForAlg(alg);
  var signatureBytes = signature.length;
  if (signatureBytes !== paramBytes * 2) {
    throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
  }
  var rPadding = countPadding(signature, 0, paramBytes);
  var sPadding = countPadding(signature, paramBytes, signature.length);
  var rLength = paramBytes - rPadding;
  var sLength = paramBytes - sPadding;
  var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
  var shortLength = rsBytes < MAX_OCTET;
  var dst = Buffer$6.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
  var offset = 0;
  dst[offset++] = ENCODED_TAG_SEQ;
  if (shortLength) {
    dst[offset++] = rsBytes;
  } else {
    dst[offset++] = MAX_OCTET | 1;
    dst[offset++] = rsBytes & 255;
  }
  dst[offset++] = ENCODED_TAG_INT;
  dst[offset++] = rLength;
  if (rPadding < 0) {
    dst[offset++] = 0;
    offset += signature.copy(dst, offset, 0, paramBytes);
  } else {
    offset += signature.copy(dst, offset, rPadding, paramBytes);
  }
  dst[offset++] = ENCODED_TAG_INT;
  dst[offset++] = sLength;
  if (sPadding < 0) {
    dst[offset++] = 0;
    signature.copy(dst, offset, paramBytes);
  } else {
    signature.copy(dst, offset, paramBytes + sPadding);
  }
  return dst;
}
var ecdsaSigFormatter = {
  derToJose,
  joseToDer
};
var util$4 = {};
Object.defineProperty(util$4, "__esModule", { value: true });
util$4.LRUCache = void 0;
util$4.snakeToCamel = snakeToCamel;
util$4.originalOrCamelOptions = originalOrCamelOptions;
util$4.removeUndefinedValuesInObject = removeUndefinedValuesInObject;
util$4.isValidFile = isValidFile;
util$4.getWellKnownCertificateConfigFileLocation = getWellKnownCertificateConfigFileLocation;
const fs$3 = fs$4;
const os = require$$1$1;
const path$1 = path$2;
const WELL_KNOWN_CERTIFICATE_CONFIG_FILE = "certificate_config.json";
const CLOUDSDK_CONFIG_DIRECTORY = "gcloud";
function snakeToCamel(str) {
  return str.replace(/([_][^_])/g, (match) => match.slice(1).toUpperCase());
}
function originalOrCamelOptions(obj) {
  function get(key) {
    const o = obj || {};
    return o[key] ?? o[snakeToCamel(key)];
  }
  return { get };
}
class LRUCache {
  constructor(options) {
    __privateAdd(this, _LRUCache_instances);
    __publicField(this, "capacity");
    /**
     * Maps are in order. Thus, the older item is the first item.
     *
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
     */
    __privateAdd(this, _cache, /* @__PURE__ */ new Map());
    __publicField(this, "maxAge");
    this.capacity = options.capacity;
    this.maxAge = options.maxAge;
  }
  /**
   * Add an item to the cache.
   *
   * @param key the key to upsert
   * @param value the value of the key
   */
  set(key, value) {
    __privateMethod(this, _LRUCache_instances, moveToEnd_fn).call(this, key, value);
    __privateMethod(this, _LRUCache_instances, evict_fn).call(this);
  }
  /**
   * Get an item from the cache.
   *
   * @param key the key to retrieve
   */
  get(key) {
    const item = __privateGet(this, _cache).get(key);
    if (!item)
      return;
    __privateMethod(this, _LRUCache_instances, moveToEnd_fn).call(this, key, item.value);
    __privateMethod(this, _LRUCache_instances, evict_fn).call(this);
    return item.value;
  }
}
_cache = new WeakMap();
_LRUCache_instances = new WeakSet();
/**
 * Moves the key to the end of the cache.
 *
 * @param key the key to move
 * @param value the value of the key
 */
moveToEnd_fn = function(key, value) {
  __privateGet(this, _cache).delete(key);
  __privateGet(this, _cache).set(key, {
    value,
    lastAccessed: Date.now()
  });
};
/**
 * Maintain the cache based on capacity and TTL.
 */
evict_fn = function() {
  const cutoffDate = this.maxAge ? Date.now() - this.maxAge : 0;
  let oldestItem = __privateGet(this, _cache).entries().next();
  while (!oldestItem.done && (__privateGet(this, _cache).size > this.capacity || // too many
  oldestItem.value[1].lastAccessed < cutoffDate)) {
    __privateGet(this, _cache).delete(oldestItem.value[0]);
    oldestItem = __privateGet(this, _cache).entries().next();
  }
};
util$4.LRUCache = LRUCache;
function removeUndefinedValuesInObject(object) {
  Object.entries(object).forEach(([key, value]) => {
    if (value === void 0 || value === "undefined") {
      delete object[key];
    }
  });
  return object;
}
async function isValidFile(filePath) {
  try {
    const stats = await fs$3.promises.lstat(filePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}
function getWellKnownCertificateConfigFileLocation() {
  const configDir = process.env.CLOUDSDK_CONFIG || (_isWindows() ? path$1.join(process.env.APPDATA || "", CLOUDSDK_CONFIG_DIRECTORY) : path$1.join(process.env.HOME || "", ".config", CLOUDSDK_CONFIG_DIRECTORY));
  return path$1.join(configDir, WELL_KNOWN_CERTIFICATE_CONFIG_FILE);
}
function _isWindows() {
  return os.platform().startsWith("win");
}
var authclient = {};
var shared = {};
const name = "google-auth-library";
const version = "10.5.0";
const author = "Google Inc.";
const description = "Google APIs Authentication Client Library for Node.js";
const engines = {
  node: ">=18"
};
const main = "./build/src/index.js";
const types = "./build/src/index.d.ts";
const repository = "googleapis/google-auth-library-nodejs.git";
const keywords = [
  "google",
  "api",
  "google apis",
  "client",
  "client library"
];
const dependencies = {
  "base64-js": "^1.3.0",
  "ecdsa-sig-formatter": "^1.0.11",
  gaxios: "^7.0.0",
  "gcp-metadata": "^8.0.0",
  "google-logging-utils": "^1.0.0",
  gtoken: "^8.0.0",
  jws: "^4.0.0"
};
const devDependencies = {
  "@types/base64-js": "^1.2.5",
  "@types/jws": "^3.1.0",
  "@types/mocha": "^10.0.10",
  "@types/mv": "^2.1.0",
  "@types/ncp": "^2.0.1",
  "@types/node": "^22.0.0",
  "@types/sinon": "^17.0.0",
  "assert-rejects": "^1.0.0",
  c8: "^10.0.0",
  codecov: "^3.0.2",
  gts: "^6.0.0",
  "is-docker": "^3.0.0",
  jsdoc: "^4.0.0",
  "jsdoc-fresh": "^5.0.0",
  "jsdoc-region-tag": "^4.0.0",
  karma: "^6.0.0",
  "karma-chrome-launcher": "^3.0.0",
  "karma-coverage": "^2.0.0",
  "karma-firefox-launcher": "^2.0.0",
  "karma-mocha": "^2.0.0",
  "karma-sourcemap-loader": "^0.4.0",
  "karma-webpack": "^5.0.1",
  keypair: "^1.0.4",
  mocha: "^11.1.0",
  mv: "^2.1.1",
  ncp: "^2.0.0",
  nock: "^14.0.5",
  "null-loader": "^4.0.0",
  puppeteer: "^24.0.0",
  sinon: "^21.0.0",
  "ts-loader": "^8.0.0",
  typescript: "5.8.2",
  webpack: "^5.21.2",
  "webpack-cli": "^4.0.0"
};
const files = [
  "build/src",
  "!build/src/**/*.map"
];
const scripts = {
  test: "c8 mocha build/test",
  clean: "gts clean",
  prepare: "npm run compile",
  lint: "gts check --no-inline-config",
  compile: "tsc -p .",
  fix: "gts fix",
  pretest: "npm run compile -- --sourceMap",
  docs: "jsdoc -c .jsdoc.js",
  "samples-setup": "cd samples/ && npm link ../ && npm run setup && cd ../",
  "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
  "system-test": "mocha build/system-test --timeout 60000",
  "presystem-test": "npm run compile -- --sourceMap",
  webpack: "webpack",
  "browser-test": "karma start",
  "docs-test": "echo 'disabled until linkinator is fixed'",
  "predocs-test": "npm run docs",
  prelint: "cd samples; npm link ../; npm install"
};
const license = "Apache-2.0";
const require$$0 = {
  name,
  version,
  author,
  description,
  engines,
  main,
  types,
  repository,
  keywords,
  dependencies,
  devDependencies,
  files,
  scripts,
  license
};
Object.defineProperty(shared, "__esModule", { value: true });
shared.USER_AGENT = shared.PRODUCT_NAME = shared.pkg = void 0;
const pkg = require$$0;
shared.pkg = pkg;
const PRODUCT_NAME = "google-api-nodejs-client";
shared.PRODUCT_NAME = PRODUCT_NAME;
const USER_AGENT = `${PRODUCT_NAME}/${pkg.version}`;
shared.USER_AGENT = USER_AGENT;
(function(exports$12) {
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.AuthClient = exports$12.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = exports$12.DEFAULT_UNIVERSE = void 0;
  const events_1 = require$$0$2;
  const gaxios_12 = src$3;
  const util_12 = util$4;
  const google_logging_utils_1 = src$1;
  const shared_cjs_1 = shared;
  exports$12.DEFAULT_UNIVERSE = "googleapis.com";
  exports$12.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 5 * 60 * 1e3;
  const _AuthClient = class _AuthClient extends events_1.EventEmitter {
    constructor(opts = {}) {
      super();
      __publicField(this, "apiKey");
      __publicField(this, "projectId");
      /**
       * The quota project ID. The quota project can be used by client libraries for the billing purpose.
       * See {@link https://cloud.google.com/docs/quota Working with quotas}
       */
      __publicField(this, "quotaProjectId");
      /**
       * The {@link Gaxios `Gaxios`} instance used for making requests.
       */
      __publicField(this, "transporter");
      __publicField(this, "credentials", {});
      __publicField(this, "eagerRefreshThresholdMillis", exports$12.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS);
      __publicField(this, "forceRefreshOnFailure", false);
      __publicField(this, "universeDomain", exports$12.DEFAULT_UNIVERSE);
      const options = (0, util_12.originalOrCamelOptions)(opts);
      this.apiKey = opts.apiKey;
      this.projectId = options.get("project_id") ?? null;
      this.quotaProjectId = options.get("quota_project_id");
      this.credentials = options.get("credentials") ?? {};
      this.universeDomain = options.get("universe_domain") ?? exports$12.DEFAULT_UNIVERSE;
      this.transporter = opts.transporter ?? new gaxios_12.Gaxios(opts.transporterOptions);
      if (options.get("useAuthRequestParameters") !== false) {
        this.transporter.interceptors.request.add(_AuthClient.DEFAULT_REQUEST_INTERCEPTOR);
        this.transporter.interceptors.response.add(_AuthClient.DEFAULT_RESPONSE_INTERCEPTOR);
      }
      if (opts.eagerRefreshThresholdMillis) {
        this.eagerRefreshThresholdMillis = opts.eagerRefreshThresholdMillis;
      }
      this.forceRefreshOnFailure = opts.forceRefreshOnFailure ?? false;
    }
    /**
     * A {@link fetch `fetch`} compliant API for {@link AuthClient}.
     *
     * @see {@link AuthClient.request} for the classic method.
     *
     * @remarks
     *
     * This is useful as a drop-in replacement for `fetch` API usage.
     *
     * @example
     *
     * ```ts
     * const authClient = new AuthClient();
     * const fetchWithAuthClient: typeof fetch = (...args) => authClient.fetch(...args);
     * await fetchWithAuthClient('https://example.com');
     * ```
     *
     * @param args `fetch` API or {@link Gaxios.fetch `Gaxios#fetch`} parameters
     * @returns the {@link GaxiosResponse} with Gaxios-added properties
     */
    fetch(...args) {
      const input = args[0];
      const init = args[1];
      let url2 = void 0;
      const headers = new Headers();
      if (typeof input === "string") {
        url2 = new URL(input);
      } else if (input instanceof URL) {
        url2 = input;
      } else if (input && input.url) {
        url2 = new URL(input.url);
      }
      if (input && typeof input === "object" && "headers" in input) {
        gaxios_12.Gaxios.mergeHeaders(headers, input.headers);
      }
      if (init) {
        gaxios_12.Gaxios.mergeHeaders(headers, new Headers(init.headers));
      }
      if (typeof input === "object" && !(input instanceof URL)) {
        return this.request({ ...init, ...input, headers, url: url2 });
      } else {
        return this.request({ ...init, headers, url: url2 });
      }
    }
    /**
     * Sets the auth credentials.
     */
    setCredentials(credentials) {
      this.credentials = credentials;
    }
    /**
     * Append additional headers, e.g., x-goog-user-project, shared across the
     * classes inheriting AuthClient. This method should be used by any method
     * that overrides getRequestMetadataAsync(), which is a shared helper for
     * setting request information in both gRPC and HTTP API calls.
     *
     * @param headers object to append additional headers to.
     */
    addSharedMetadataHeaders(headers) {
      if (!headers.has("x-goog-user-project") && // don't override a value the user sets.
      this.quotaProjectId) {
        headers.set("x-goog-user-project", this.quotaProjectId);
      }
      return headers;
    }
    /**
     * Adds the `x-goog-user-project` and `authorization` headers to the target Headers
     * object, if they exist on the source.
     *
     * @param target the headers to target
     * @param source the headers to source from
     * @returns the target headers
     */
    addUserProjectAndAuthHeaders(target, source) {
      const xGoogUserProject = source.get("x-goog-user-project");
      const authorizationHeader = source.get("authorization");
      if (xGoogUserProject) {
        target.set("x-goog-user-project", xGoogUserProject);
      }
      if (authorizationHeader) {
        target.set("authorization", authorizationHeader);
      }
      return target;
    }
    /**
     * Sets the method name that is making a Gaxios request, so that logging may tag
     * log lines with the operation.
     * @param config A Gaxios request config
     * @param methodName The method name making the call
     */
    static setMethodName(config, methodName) {
      try {
        const symbols = config;
        symbols[_AuthClient.RequestMethodNameSymbol] = methodName;
      } catch (e) {
      }
    }
    /**
     * Retry config for Auth-related requests.
     *
     * @remarks
     *
     * This is not a part of the default {@link AuthClient.transporter transporter/gaxios}
     * config as some downstream APIs would prefer if customers explicitly enable retries,
     * such as GCS.
     */
    static get RETRY_CONFIG() {
      return {
        retry: true,
        retryConfig: {
          httpMethodsToRetry: ["GET", "PUT", "POST", "HEAD", "OPTIONS", "DELETE"]
        }
      };
    }
  };
  /**
   * Symbols that can be added to GaxiosOptions to specify the method name that is
   * making an RPC call, for logging purposes, as well as a string ID that can be
   * used to correlate calls and responses.
   */
  __publicField(_AuthClient, "RequestMethodNameSymbol", Symbol("request method name"));
  __publicField(_AuthClient, "RequestLogIdSymbol", Symbol("request log id"));
  __publicField(_AuthClient, "log", (0, google_logging_utils_1.log)("auth"));
  __publicField(_AuthClient, "DEFAULT_REQUEST_INTERCEPTOR", {
    resolved: async (config) => {
      if (!config.headers.has("x-goog-api-client")) {
        const nodeVersion = process.version.replace(/^v/, "");
        config.headers.set("x-goog-api-client", `gl-node/${nodeVersion}`);
      }
      const userAgent = config.headers.get("User-Agent");
      if (!userAgent) {
        config.headers.set("User-Agent", shared_cjs_1.USER_AGENT);
      } else if (!userAgent.includes(`${shared_cjs_1.PRODUCT_NAME}/`)) {
        config.headers.set("User-Agent", `${userAgent} ${shared_cjs_1.USER_AGENT}`);
      }
      try {
        const symbols = config;
        const methodName = symbols[_AuthClient.RequestMethodNameSymbol];
        const logId = `${Math.floor(Math.random() * 1e3)}`;
        symbols[_AuthClient.RequestLogIdSymbol] = logId;
        const logObject = {
          url: config.url,
          headers: config.headers
        };
        if (methodName) {
          _AuthClient.log.info("%s [%s] request %j", methodName, logId, logObject);
        } else {
          _AuthClient.log.info("[%s] request %j", logId, logObject);
        }
      } catch (e) {
      }
      return config;
    }
  });
  __publicField(_AuthClient, "DEFAULT_RESPONSE_INTERCEPTOR", {
    resolved: async (response) => {
      try {
        const symbols = response.config;
        const methodName = symbols[_AuthClient.RequestMethodNameSymbol];
        const logId = symbols[_AuthClient.RequestLogIdSymbol];
        if (methodName) {
          _AuthClient.log.info("%s [%s] response %j", methodName, logId, response.data);
        } else {
          _AuthClient.log.info("[%s] response %j", logId, response.data);
        }
      } catch (e) {
      }
      return response;
    },
    rejected: async (error) => {
      var _a2, _b;
      try {
        const symbols = error.config;
        const methodName = symbols[_AuthClient.RequestMethodNameSymbol];
        const logId = symbols[_AuthClient.RequestLogIdSymbol];
        if (methodName) {
          _AuthClient.log.info("%s [%s] error %j", methodName, logId, (_a2 = error.response) == null ? void 0 : _a2.data);
        } else {
          _AuthClient.log.error("[%s] error %j", logId, (_b = error.response) == null ? void 0 : _b.data);
        }
      } catch (e) {
      }
      throw error;
    }
  });
  let AuthClient = _AuthClient;
  exports$12.AuthClient = AuthClient;
})(authclient);
var loginticket = {};
Object.defineProperty(loginticket, "__esModule", { value: true });
loginticket.LoginTicket = void 0;
class LoginTicket {
  /**
   * Create a simple class to extract user ID from an ID Token
   *
   * @param {string} env Envelope of the jwt
   * @param {TokenPayload} pay Payload of the jwt
   * @constructor
   */
  constructor(env, pay) {
    __publicField(this, "envelope");
    __publicField(this, "payload");
    this.envelope = env;
    this.payload = pay;
  }
  getEnvelope() {
    return this.envelope;
  }
  getPayload() {
    return this.payload;
  }
  /**
   * Create a simple class to extract user ID from an ID Token
   *
   * @return The user ID
   */
  getUserId() {
    const payload = this.getPayload();
    if (payload && payload.sub) {
      return payload.sub;
    }
    return null;
  }
  /**
   * Returns attributes from the login ticket.  This can contain
   * various information about the user session.
   *
   * @return The envelope and payload
   */
  getAttributes() {
    return { envelope: this.getEnvelope(), payload: this.getPayload() };
  }
}
loginticket.LoginTicket = LoginTicket;
Object.defineProperty(oauth2client, "__esModule", { value: true });
oauth2client.OAuth2Client = oauth2client.ClientAuthentication = oauth2client.CertificateFormat = oauth2client.CodeChallengeMethod = void 0;
const gaxios_1$8 = src$3;
const querystring = require$$1$3;
const stream$1 = require$$3;
const formatEcdsa$1 = ecdsaSigFormatter;
const util_1$6 = util$4;
const crypto_1$2 = crypto$5;
const authclient_1$7 = authclient;
const loginticket_1 = loginticket;
var CodeChallengeMethod;
(function(CodeChallengeMethod2) {
  CodeChallengeMethod2["Plain"] = "plain";
  CodeChallengeMethod2["S256"] = "S256";
})(CodeChallengeMethod || (oauth2client.CodeChallengeMethod = CodeChallengeMethod = {}));
var CertificateFormat;
(function(CertificateFormat2) {
  CertificateFormat2["PEM"] = "PEM";
  CertificateFormat2["JWK"] = "JWK";
})(CertificateFormat || (oauth2client.CertificateFormat = CertificateFormat = {}));
var ClientAuthentication;
(function(ClientAuthentication2) {
  ClientAuthentication2["ClientSecretPost"] = "ClientSecretPost";
  ClientAuthentication2["ClientSecretBasic"] = "ClientSecretBasic";
  ClientAuthentication2["None"] = "None";
})(ClientAuthentication || (oauth2client.ClientAuthentication = ClientAuthentication = {}));
const _OAuth2Client = class _OAuth2Client extends authclient_1$7.AuthClient {
  /**
   * An OAuth2 Client for Google APIs.
   *
   * @param options The OAuth2 Client Options. Passing an `clientId` directly is **@DEPRECATED**.
   * @param clientSecret **@DEPRECATED**. Provide a {@link OAuth2ClientOptions `OAuth2ClientOptions`} object in the first parameter instead.
   * @param redirectUri **@DEPRECATED**. Provide a {@link OAuth2ClientOptions `OAuth2ClientOptions`} object in the first parameter instead.
   */
  constructor(options = {}, clientSecret, redirectUri) {
    var _a2;
    super(typeof options === "object" ? options : {});
    __publicField(this, "redirectUri");
    __publicField(this, "certificateCache", {});
    __publicField(this, "certificateExpiry", null);
    __publicField(this, "certificateCacheFormat", CertificateFormat.PEM);
    __publicField(this, "refreshTokenPromises", /* @__PURE__ */ new Map());
    __publicField(this, "endpoints");
    __publicField(this, "issuers");
    __publicField(this, "clientAuthentication");
    // TODO: refactor tests to make this private
    __publicField(this, "_clientId");
    // TODO: refactor tests to make this private
    __publicField(this, "_clientSecret");
    __publicField(this, "refreshHandler");
    if (typeof options !== "object") {
      options = {
        clientId: options,
        clientSecret,
        redirectUri
      };
    }
    this._clientId = options.clientId || options.client_id;
    this._clientSecret = options.clientSecret || options.client_secret;
    this.redirectUri = options.redirectUri || ((_a2 = options.redirect_uris) == null ? void 0 : _a2[0]);
    this.endpoints = {
      tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
      oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      oauth2TokenUrl: "https://oauth2.googleapis.com/token",
      oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
      oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
      oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
      oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
      ...options.endpoints
    };
    this.clientAuthentication = options.clientAuthentication || ClientAuthentication.ClientSecretPost;
    this.issuers = options.issuers || [
      "accounts.google.com",
      "https://accounts.google.com",
      this.universeDomain
    ];
  }
  /**
   * Generates URL for consent page landing.
   * @param opts Options.
   * @return URL to consent page.
   */
  generateAuthUrl(opts = {}) {
    if (opts.code_challenge_method && !opts.code_challenge) {
      throw new Error("If a code_challenge_method is provided, code_challenge must be included.");
    }
    opts.response_type = opts.response_type || "code";
    opts.client_id = opts.client_id || this._clientId;
    opts.redirect_uri = opts.redirect_uri || this.redirectUri;
    if (Array.isArray(opts.scope)) {
      opts.scope = opts.scope.join(" ");
    }
    const rootUrl = this.endpoints.oauth2AuthBaseUrl.toString();
    return rootUrl + "?" + querystring.stringify(opts);
  }
  generateCodeVerifier() {
    throw new Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.");
  }
  /**
   * Convenience method to automatically generate a code_verifier, and its
   * resulting SHA256. If used, this must be paired with a S256
   * code_challenge_method.
   *
   * For a full example see:
   * https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/oauth2-codeVerifier.js
   */
  async generateCodeVerifierAsync() {
    const crypto2 = (0, crypto_1$2.createCrypto)();
    const randomString = crypto2.randomBytesBase64(96);
    const codeVerifier = randomString.replace(/\+/g, "~").replace(/=/g, "_").replace(/\//g, "-");
    const unencodedCodeChallenge = await crypto2.sha256DigestBase64(codeVerifier);
    const codeChallenge = unencodedCodeChallenge.split("=")[0].replace(/\+/g, "-").replace(/\//g, "_");
    return { codeVerifier, codeChallenge };
  }
  getToken(codeOrOptions, callback) {
    const options = typeof codeOrOptions === "string" ? { code: codeOrOptions } : codeOrOptions;
    if (callback) {
      this.getTokenAsync(options).then((r) => callback(null, r.tokens, r.res), (e) => callback(e, null, e.response));
    } else {
      return this.getTokenAsync(options);
    }
  }
  async getTokenAsync(options) {
    const url2 = this.endpoints.oauth2TokenUrl.toString();
    const headers = new Headers();
    const values = {
      client_id: options.client_id || this._clientId,
      code_verifier: options.codeVerifier,
      code: options.code,
      grant_type: "authorization_code",
      redirect_uri: options.redirect_uri || this.redirectUri
    };
    if (this.clientAuthentication === ClientAuthentication.ClientSecretBasic) {
      const basic = Buffer.from(`${this._clientId}:${this._clientSecret}`);
      headers.set("authorization", `Basic ${basic.toString("base64")}`);
    }
    if (this.clientAuthentication === ClientAuthentication.ClientSecretPost) {
      values.client_secret = this._clientSecret;
    }
    const opts = {
      ..._OAuth2Client.RETRY_CONFIG,
      method: "POST",
      url: url2,
      data: new URLSearchParams((0, util_1$6.removeUndefinedValuesInObject)(values)),
      headers
    };
    authclient_1$7.AuthClient.setMethodName(opts, "getTokenAsync");
    const res = await this.transporter.request(opts);
    const tokens = res.data;
    if (res.data && res.data.expires_in) {
      tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + res.data.expires_in * 1e3;
      delete tokens.expires_in;
    }
    this.emit("tokens", tokens);
    return { tokens, res };
  }
  /**
   * Refreshes the access token.
   * @param refresh_token Existing refresh token.
   * @private
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      return this.refreshTokenNoCache(refreshToken);
    }
    if (this.refreshTokenPromises.has(refreshToken)) {
      return this.refreshTokenPromises.get(refreshToken);
    }
    const p = this.refreshTokenNoCache(refreshToken).then((r) => {
      this.refreshTokenPromises.delete(refreshToken);
      return r;
    }, (e) => {
      this.refreshTokenPromises.delete(refreshToken);
      throw e;
    });
    this.refreshTokenPromises.set(refreshToken, p);
    return p;
  }
  async refreshTokenNoCache(refreshToken) {
    var _a2;
    if (!refreshToken) {
      throw new Error("No refresh token is set.");
    }
    const url2 = this.endpoints.oauth2TokenUrl.toString();
    const data = {
      refresh_token: refreshToken,
      client_id: this._clientId,
      client_secret: this._clientSecret,
      grant_type: "refresh_token"
    };
    let res;
    try {
      const opts = {
        ..._OAuth2Client.RETRY_CONFIG,
        method: "POST",
        url: url2,
        data: new URLSearchParams((0, util_1$6.removeUndefinedValuesInObject)(data))
      };
      authclient_1$7.AuthClient.setMethodName(opts, "refreshTokenNoCache");
      res = await this.transporter.request(opts);
    } catch (e) {
      if (e instanceof gaxios_1$8.GaxiosError && e.message === "invalid_grant" && ((_a2 = e.response) == null ? void 0 : _a2.data) && /ReAuth/i.test(e.response.data.error_description)) {
        e.message = JSON.stringify(e.response.data);
      }
      throw e;
    }
    const tokens = res.data;
    if (res.data && res.data.expires_in) {
      tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + res.data.expires_in * 1e3;
      delete tokens.expires_in;
    }
    this.emit("tokens", tokens);
    return { tokens, res };
  }
  refreshAccessToken(callback) {
    if (callback) {
      this.refreshAccessTokenAsync().then((r) => callback(null, r.credentials, r.res), callback);
    } else {
      return this.refreshAccessTokenAsync();
    }
  }
  async refreshAccessTokenAsync() {
    const r = await this.refreshToken(this.credentials.refresh_token);
    const tokens = r.tokens;
    tokens.refresh_token = this.credentials.refresh_token;
    this.credentials = tokens;
    return { credentials: this.credentials, res: r.res };
  }
  getAccessToken(callback) {
    if (callback) {
      this.getAccessTokenAsync().then((r) => callback(null, r.token, r.res), callback);
    } else {
      return this.getAccessTokenAsync();
    }
  }
  async getAccessTokenAsync() {
    const shouldRefresh = !this.credentials.access_token || this.isTokenExpiring();
    if (shouldRefresh) {
      if (!this.credentials.refresh_token) {
        if (this.refreshHandler) {
          const refreshedAccessToken = await this.processAndValidateRefreshHandler();
          if (refreshedAccessToken == null ? void 0 : refreshedAccessToken.access_token) {
            this.setCredentials(refreshedAccessToken);
            return { token: this.credentials.access_token };
          }
        } else {
          throw new Error("No refresh token or refresh handler callback is set.");
        }
      }
      const r = await this.refreshAccessTokenAsync();
      if (!r.credentials || r.credentials && !r.credentials.access_token) {
        throw new Error("Could not refresh access token.");
      }
      return { token: r.credentials.access_token, res: r.res };
    } else {
      return { token: this.credentials.access_token };
    }
  }
  /**
   * The main authentication interface.  It takes an optional url which when
   * present is the endpoint being accessed, and returns a Promise which
   * resolves with authorization header fields.
   *
   * In OAuth2Client, the result has the form:
   * { authorization: 'Bearer <access_token_value>' }
   */
  async getRequestHeaders(url2) {
    const headers = (await this.getRequestMetadataAsync(url2)).headers;
    return headers;
  }
  async getRequestMetadataAsync(url2) {
    const thisCreds = this.credentials;
    if (!thisCreds.access_token && !thisCreds.refresh_token && !this.apiKey && !this.refreshHandler) {
      throw new Error("No access, refresh token, API key or refresh handler callback is set.");
    }
    if (thisCreds.access_token && !this.isTokenExpiring()) {
      thisCreds.token_type = thisCreds.token_type || "Bearer";
      const headers2 = new Headers({
        authorization: thisCreds.token_type + " " + thisCreds.access_token
      });
      return { headers: this.addSharedMetadataHeaders(headers2) };
    }
    if (this.refreshHandler) {
      const refreshedAccessToken = await this.processAndValidateRefreshHandler();
      if (refreshedAccessToken == null ? void 0 : refreshedAccessToken.access_token) {
        this.setCredentials(refreshedAccessToken);
        const headers2 = new Headers({
          authorization: "Bearer " + this.credentials.access_token
        });
        return { headers: this.addSharedMetadataHeaders(headers2) };
      }
    }
    if (this.apiKey) {
      return { headers: new Headers({ "X-Goog-Api-Key": this.apiKey }) };
    }
    let r = null;
    let tokens = null;
    try {
      r = await this.refreshToken(thisCreds.refresh_token);
      tokens = r.tokens;
    } catch (err) {
      const e = err;
      if (e.response && (e.response.status === 403 || e.response.status === 404)) {
        e.message = `Could not refresh access token: ${e.message}`;
      }
      throw e;
    }
    const credentials = this.credentials;
    credentials.token_type = credentials.token_type || "Bearer";
    tokens.refresh_token = credentials.refresh_token;
    this.credentials = tokens;
    const headers = new Headers({
      authorization: credentials.token_type + " " + tokens.access_token
    });
    return { headers: this.addSharedMetadataHeaders(headers), res: r.res };
  }
  /**
   * Generates an URL to revoke the given token.
   * @param token The existing token to be revoked.
   *
   * @deprecated use instance method {@link OAuth2Client.getRevokeTokenURL}
   */
  static getRevokeTokenUrl(token) {
    return new _OAuth2Client().getRevokeTokenURL(token).toString();
  }
  /**
   * Generates a URL to revoke the given token.
   *
   * @param token The existing token to be revoked.
   */
  getRevokeTokenURL(token) {
    const url2 = new URL(this.endpoints.oauth2RevokeUrl);
    url2.searchParams.append("token", token);
    return url2;
  }
  revokeToken(token, callback) {
    const opts = {
      ..._OAuth2Client.RETRY_CONFIG,
      url: this.getRevokeTokenURL(token).toString(),
      method: "POST"
    };
    authclient_1$7.AuthClient.setMethodName(opts, "revokeToken");
    if (callback) {
      this.transporter.request(opts).then((r) => callback(null, r), callback);
    } else {
      return this.transporter.request(opts);
    }
  }
  revokeCredentials(callback) {
    if (callback) {
      this.revokeCredentialsAsync().then((res) => callback(null, res), callback);
    } else {
      return this.revokeCredentialsAsync();
    }
  }
  async revokeCredentialsAsync() {
    const token = this.credentials.access_token;
    this.credentials = {};
    if (token) {
      return this.revokeToken(token);
    } else {
      throw new Error("No access token to revoke.");
    }
  }
  request(opts, callback) {
    if (callback) {
      this.requestAsync(opts).then((r) => callback(null, r), (e) => {
        return callback(e, e.response);
      });
    } else {
      return this.requestAsync(opts);
    }
  }
  async requestAsync(opts, reAuthRetried = false) {
    try {
      const r = await this.getRequestMetadataAsync();
      opts.headers = gaxios_1$8.Gaxios.mergeHeaders(opts.headers);
      this.addUserProjectAndAuthHeaders(opts.headers, r.headers);
      if (this.apiKey) {
        opts.headers.set("X-Goog-Api-Key", this.apiKey);
      }
      return await this.transporter.request(opts);
    } catch (e) {
      const res = e.response;
      if (res) {
        const statusCode = res.status;
        const mayRequireRefresh = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure);
        const mayRequireRefreshWithNoRefreshToken = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler;
        const isReadableStream = res.config.data instanceof stream$1.Readable;
        const isAuthErr = statusCode === 401 || statusCode === 403;
        if (!reAuthRetried && isAuthErr && !isReadableStream && mayRequireRefresh) {
          await this.refreshAccessTokenAsync();
          return this.requestAsync(opts, true);
        } else if (!reAuthRetried && isAuthErr && !isReadableStream && mayRequireRefreshWithNoRefreshToken) {
          const refreshedAccessToken = await this.processAndValidateRefreshHandler();
          if (refreshedAccessToken == null ? void 0 : refreshedAccessToken.access_token) {
            this.setCredentials(refreshedAccessToken);
          }
          return this.requestAsync(opts, true);
        }
      }
      throw e;
    }
  }
  verifyIdToken(options, callback) {
    if (callback && typeof callback !== "function") {
      throw new Error("This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.");
    }
    if (callback) {
      this.verifyIdTokenAsync(options).then((r) => callback(null, r), callback);
    } else {
      return this.verifyIdTokenAsync(options);
    }
  }
  async verifyIdTokenAsync(options) {
    if (!options.idToken) {
      throw new Error("The verifyIdToken method requires an ID Token");
    }
    const response = await this.getFederatedSignonCertsAsync();
    const login = await this.verifySignedJwtWithCertsAsync(options.idToken, response.certs, options.audience, this.issuers, options.maxExpiry);
    return login;
  }
  /**
   * Obtains information about the provisioned access token.  Especially useful
   * if you want to check the scopes that were provisioned to a given token.
   *
   * @param accessToken Required.  The Access Token for which you want to get
   * user info.
   */
  async getTokenInfo(accessToken) {
    const { data } = await this.transporter.request({
      ..._OAuth2Client.RETRY_CONFIG,
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        authorization: `Bearer ${accessToken}`
      },
      url: this.endpoints.tokenInfoUrl.toString()
    });
    const info = Object.assign({
      expiry_date: (/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1e3,
      scopes: data.scope.split(" ")
    }, data);
    delete info.expires_in;
    delete info.scope;
    return info;
  }
  getFederatedSignonCerts(callback) {
    if (callback) {
      this.getFederatedSignonCertsAsync().then((r) => callback(null, r.certs, r.res), callback);
    } else {
      return this.getFederatedSignonCertsAsync();
    }
  }
  async getFederatedSignonCertsAsync() {
    var _a2, _b;
    const nowTime = (/* @__PURE__ */ new Date()).getTime();
    const format = (0, crypto_1$2.hasBrowserCrypto)() ? CertificateFormat.JWK : CertificateFormat.PEM;
    if (this.certificateExpiry && nowTime < this.certificateExpiry.getTime() && this.certificateCacheFormat === format) {
      return { certs: this.certificateCache, format };
    }
    let res;
    let url2;
    switch (format) {
      case CertificateFormat.PEM:
        url2 = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
        break;
      case CertificateFormat.JWK:
        url2 = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
        break;
      default:
        throw new Error(`Unsupported certificate format ${format}`);
    }
    try {
      const opts = {
        ..._OAuth2Client.RETRY_CONFIG,
        url: url2
      };
      authclient_1$7.AuthClient.setMethodName(opts, "getFederatedSignonCertsAsync");
      res = await this.transporter.request(opts);
    } catch (e) {
      if (e instanceof Error) {
        e.message = `Failed to retrieve verification certificates: ${e.message}`;
      }
      throw e;
    }
    const cacheControl = res == null ? void 0 : res.headers.get("cache-control");
    let cacheAge = -1;
    if (cacheControl) {
      const maxAge = (_b = (_a2 = /max-age=(?<maxAge>[0-9]+)/.exec(cacheControl)) == null ? void 0 : _a2.groups) == null ? void 0 : _b.maxAge;
      if (maxAge) {
        cacheAge = Number(maxAge) * 1e3;
      }
    }
    let certificates = {};
    switch (format) {
      case CertificateFormat.PEM:
        certificates = res.data;
        break;
      case CertificateFormat.JWK:
        for (const key of res.data.keys) {
          certificates[key.kid] = key;
        }
        break;
      default:
        throw new Error(`Unsupported certificate format ${format}`);
    }
    const now = /* @__PURE__ */ new Date();
    this.certificateExpiry = cacheAge === -1 ? null : new Date(now.getTime() + cacheAge);
    this.certificateCache = certificates;
    this.certificateCacheFormat = format;
    return { certs: certificates, format, res };
  }
  getIapPublicKeys(callback) {
    if (callback) {
      this.getIapPublicKeysAsync().then((r) => callback(null, r.pubkeys, r.res), callback);
    } else {
      return this.getIapPublicKeysAsync();
    }
  }
  async getIapPublicKeysAsync() {
    let res;
    const url2 = this.endpoints.oauth2IapPublicKeyUrl.toString();
    try {
      const opts = {
        ..._OAuth2Client.RETRY_CONFIG,
        url: url2
      };
      authclient_1$7.AuthClient.setMethodName(opts, "getIapPublicKeysAsync");
      res = await this.transporter.request(opts);
    } catch (e) {
      if (e instanceof Error) {
        e.message = `Failed to retrieve verification certificates: ${e.message}`;
      }
      throw e;
    }
    return { pubkeys: res.data, res };
  }
  verifySignedJwtWithCerts() {
    throw new Error("verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.");
  }
  /**
   * Verify the id token is signed with the correct certificate
   * and is from the correct audience.
   * @param jwt The jwt to verify (The ID Token in this case).
   * @param certs The array of certs to test the jwt against.
   * @param requiredAudience The audience to test the jwt against.
   * @param issuers The allowed issuers of the jwt (Optional).
   * @param maxExpiry The max expiry the certificate can be (Optional).
   * @return Returns a promise resolving to LoginTicket on verification.
   */
  async verifySignedJwtWithCertsAsync(jwt, certs, requiredAudience, issuers, maxExpiry) {
    const crypto2 = (0, crypto_1$2.createCrypto)();
    if (!maxExpiry) {
      maxExpiry = _OAuth2Client.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
    }
    const segments = jwt.split(".");
    if (segments.length !== 3) {
      throw new Error("Wrong number of segments in token: " + jwt);
    }
    const signed = segments[0] + "." + segments[1];
    let signature = segments[2];
    let envelope;
    let payload;
    try {
      envelope = JSON.parse(crypto2.decodeBase64StringUtf8(segments[0]));
    } catch (err) {
      if (err instanceof Error) {
        err.message = `Can't parse token envelope: ${segments[0]}': ${err.message}`;
      }
      throw err;
    }
    if (!envelope) {
      throw new Error("Can't parse token envelope: " + segments[0]);
    }
    try {
      payload = JSON.parse(crypto2.decodeBase64StringUtf8(segments[1]));
    } catch (err) {
      if (err instanceof Error) {
        err.message = `Can't parse token payload '${segments[0]}`;
      }
      throw err;
    }
    if (!payload) {
      throw new Error("Can't parse token payload: " + segments[1]);
    }
    if (!Object.prototype.hasOwnProperty.call(certs, envelope.kid)) {
      throw new Error("No pem found for envelope: " + JSON.stringify(envelope));
    }
    const cert = certs[envelope.kid];
    if (envelope.alg === "ES256") {
      signature = formatEcdsa$1.joseToDer(signature, "ES256").toString("base64");
    }
    const verified = await crypto2.verify(cert, signed, signature);
    if (!verified) {
      throw new Error("Invalid token signature: " + jwt);
    }
    if (!payload.iat) {
      throw new Error("No issue time in token: " + JSON.stringify(payload));
    }
    if (!payload.exp) {
      throw new Error("No expiration time in token: " + JSON.stringify(payload));
    }
    const iat = Number(payload.iat);
    if (isNaN(iat))
      throw new Error("iat field using invalid format");
    const exp = Number(payload.exp);
    if (isNaN(exp))
      throw new Error("exp field using invalid format");
    const now = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    if (exp >= now + maxExpiry) {
      throw new Error("Expiration time too far in future: " + JSON.stringify(payload));
    }
    const earliest = iat - _OAuth2Client.CLOCK_SKEW_SECS_;
    const latest = exp + _OAuth2Client.CLOCK_SKEW_SECS_;
    if (now < earliest) {
      throw new Error("Token used too early, " + now + " < " + earliest + ": " + JSON.stringify(payload));
    }
    if (now > latest) {
      throw new Error("Token used too late, " + now + " > " + latest + ": " + JSON.stringify(payload));
    }
    if (issuers && issuers.indexOf(payload.iss) < 0) {
      throw new Error("Invalid issuer, expected one of [" + issuers + "], but got " + payload.iss);
    }
    if (typeof requiredAudience !== "undefined" && requiredAudience !== null) {
      const aud = payload.aud;
      let audVerified = false;
      if (requiredAudience.constructor === Array) {
        audVerified = requiredAudience.indexOf(aud) > -1;
      } else {
        audVerified = aud === requiredAudience;
      }
      if (!audVerified) {
        throw new Error("Wrong recipient, payload audience != requiredAudience");
      }
    }
    return new loginticket_1.LoginTicket(envelope, payload);
  }
  /**
   * Returns a promise that resolves with AccessTokenResponse type if
   * refreshHandler is defined.
   * If not, nothing is returned.
   */
  async processAndValidateRefreshHandler() {
    if (this.refreshHandler) {
      const accessTokenResponse = await this.refreshHandler();
      if (!accessTokenResponse.access_token) {
        throw new Error("No access token is returned by the refreshHandler callback.");
      }
      return accessTokenResponse;
    }
    return;
  }
  /**
   * Returns true if a token is expired or will expire within
   * eagerRefreshThresholdMillismilliseconds.
   * If there is no expiry time, assumes the token is not expired or expiring.
   */
  isTokenExpiring() {
    const expiryDate = this.credentials.expiry_date;
    return expiryDate ? expiryDate <= (/* @__PURE__ */ new Date()).getTime() + this.eagerRefreshThresholdMillis : false;
  }
};
/**
 * @deprecated use instance's {@link OAuth2Client.endpoints}
 */
__publicField(_OAuth2Client, "GOOGLE_TOKEN_INFO_URL", "https://oauth2.googleapis.com/tokeninfo");
/**
 * Clock skew - five minutes in seconds
 */
__publicField(_OAuth2Client, "CLOCK_SKEW_SECS_", 300);
/**
 * The default max Token Lifetime is one day in seconds
 */
__publicField(_OAuth2Client, "DEFAULT_MAX_TOKEN_LIFETIME_SECS_", 86400);
let OAuth2Client = _OAuth2Client;
oauth2client.OAuth2Client = OAuth2Client;
Object.defineProperty(computeclient, "__esModule", { value: true });
computeclient.Compute = void 0;
const gaxios_1$7 = src$3;
const gcpMetadata$1 = src$2;
const oauth2client_1$4 = oauth2client;
class Compute extends oauth2client_1$4.OAuth2Client {
  /**
   * Google Compute Engine service account credentials.
   *
   * Retrieve access token from the metadata server.
   * See: https://cloud.google.com/compute/docs/access/authenticate-workloads#applications
   */
  constructor(options = {}) {
    super(options);
    __publicField(this, "serviceAccountEmail");
    __publicField(this, "scopes");
    this.credentials = { expiry_date: 1, refresh_token: "compute-placeholder" };
    this.serviceAccountEmail = options.serviceAccountEmail || "default";
    this.scopes = Array.isArray(options.scopes) ? options.scopes : options.scopes ? [options.scopes] : [];
  }
  /**
   * Refreshes the access token.
   * @param refreshToken Unused parameter
   */
  async refreshTokenNoCache() {
    const tokenPath = `service-accounts/${this.serviceAccountEmail}/token`;
    let data;
    try {
      const instanceOptions = {
        property: tokenPath
      };
      if (this.scopes.length > 0) {
        instanceOptions.params = {
          scopes: this.scopes.join(",")
        };
      }
      data = await gcpMetadata$1.instance(instanceOptions);
    } catch (e) {
      if (e instanceof gaxios_1$7.GaxiosError) {
        e.message = `Could not refresh access token: ${e.message}`;
        this.wrapError(e);
      }
      throw e;
    }
    const tokens = data;
    if (data && data.expires_in) {
      tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1e3;
      delete tokens.expires_in;
    }
    this.emit("tokens", tokens);
    return { tokens, res: null };
  }
  /**
   * Fetches an ID token.
   * @param targetAudience the audience for the fetched ID token.
   */
  async fetchIdToken(targetAudience) {
    const idTokenPath = `service-accounts/${this.serviceAccountEmail}/identity?format=full&audience=${targetAudience}`;
    let idToken;
    try {
      const instanceOptions = {
        property: idTokenPath
      };
      idToken = await gcpMetadata$1.instance(instanceOptions);
    } catch (e) {
      if (e instanceof Error) {
        e.message = `Could not fetch ID token: ${e.message}`;
      }
      throw e;
    }
    return idToken;
  }
  wrapError(e) {
    const res = e.response;
    if (res && res.status) {
      e.status = res.status;
      if (res.status === 403) {
        e.message = "A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified: " + e.message;
      } else if (res.status === 404) {
        e.message = "A Not Found error was returned while attempting to retrieve an accesstoken for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have any permission scopes specified: " + e.message;
      }
    }
  }
}
computeclient.Compute = Compute;
var idtokenclient = {};
Object.defineProperty(idtokenclient, "__esModule", { value: true });
idtokenclient.IdTokenClient = void 0;
const oauth2client_1$3 = oauth2client;
class IdTokenClient extends oauth2client_1$3.OAuth2Client {
  /**
   * Google ID Token client
   *
   * Retrieve ID token from the metadata server.
   * See: https://cloud.google.com/docs/authentication/get-id-token#metadata-server
   */
  constructor(options) {
    super(options);
    __publicField(this, "targetAudience");
    __publicField(this, "idTokenProvider");
    this.targetAudience = options.targetAudience;
    this.idTokenProvider = options.idTokenProvider;
  }
  async getRequestMetadataAsync() {
    if (!this.credentials.id_token || !this.credentials.expiry_date || this.isTokenExpiring()) {
      const idToken = await this.idTokenProvider.fetchIdToken(this.targetAudience);
      this.credentials = {
        id_token: idToken,
        expiry_date: this.getIdTokenExpiryDate(idToken)
      };
    }
    const headers = new Headers({
      authorization: "Bearer " + this.credentials.id_token
    });
    return { headers };
  }
  getIdTokenExpiryDate(idToken) {
    const payloadB64 = idToken.split(".")[1];
    if (payloadB64) {
      const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("ascii"));
      return payload.exp * 1e3;
    }
  }
}
idtokenclient.IdTokenClient = IdTokenClient;
var envDetect = {};
Object.defineProperty(envDetect, "__esModule", { value: true });
envDetect.GCPEnv = void 0;
envDetect.clear = clear;
envDetect.getEnv = getEnv;
const gcpMetadata = src$2;
var GCPEnv;
(function(GCPEnv2) {
  GCPEnv2["APP_ENGINE"] = "APP_ENGINE";
  GCPEnv2["KUBERNETES_ENGINE"] = "KUBERNETES_ENGINE";
  GCPEnv2["CLOUD_FUNCTIONS"] = "CLOUD_FUNCTIONS";
  GCPEnv2["COMPUTE_ENGINE"] = "COMPUTE_ENGINE";
  GCPEnv2["CLOUD_RUN"] = "CLOUD_RUN";
  GCPEnv2["CLOUD_RUN_JOBS"] = "CLOUD_RUN_JOBS";
  GCPEnv2["NONE"] = "NONE";
})(GCPEnv || (envDetect.GCPEnv = GCPEnv = {}));
let envPromise;
function clear() {
  envPromise = void 0;
}
async function getEnv() {
  if (envPromise) {
    return envPromise;
  }
  envPromise = getEnvMemoized();
  return envPromise;
}
async function getEnvMemoized() {
  let env = GCPEnv.NONE;
  if (isAppEngine()) {
    env = GCPEnv.APP_ENGINE;
  } else if (isCloudFunction()) {
    env = GCPEnv.CLOUD_FUNCTIONS;
  } else if (await isComputeEngine()) {
    if (await isKubernetesEngine()) {
      env = GCPEnv.KUBERNETES_ENGINE;
    } else if (isCloudRun()) {
      env = GCPEnv.CLOUD_RUN;
    } else if (isCloudRunJob()) {
      env = GCPEnv.CLOUD_RUN_JOBS;
    } else {
      env = GCPEnv.COMPUTE_ENGINE;
    }
  } else {
    env = GCPEnv.NONE;
  }
  return env;
}
function isAppEngine() {
  return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME);
}
function isCloudFunction() {
  return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET);
}
function isCloudRun() {
  return !!process.env.K_CONFIGURATION;
}
function isCloudRunJob() {
  return !!process.env.CLOUD_RUN_JOB;
}
async function isKubernetesEngine() {
  try {
    await gcpMetadata.instance("attributes/cluster-name");
    return true;
  } catch (e) {
    return false;
  }
}
async function isComputeEngine() {
  return gcpMetadata.isAvailable();
}
var jwtclient = {};
var src = {};
var jws$2 = {};
var Buffer$5 = safeBufferExports.Buffer;
var Stream$2 = require$$3;
var util$3 = require$$2;
function DataStream$2(data) {
  this.buffer = null;
  this.writable = true;
  this.readable = true;
  if (!data) {
    this.buffer = Buffer$5.alloc(0);
    return this;
  }
  if (typeof data.pipe === "function") {
    this.buffer = Buffer$5.alloc(0);
    data.pipe(this);
    return this;
  }
  if (data.length || typeof data === "object") {
    this.buffer = data;
    this.writable = false;
    process.nextTick((function() {
      this.emit("end", data);
      this.readable = false;
      this.emit("close");
    }).bind(this));
    return this;
  }
  throw new TypeError("Unexpected data type (" + typeof data + ")");
}
util$3.inherits(DataStream$2, Stream$2);
DataStream$2.prototype.write = function write(data) {
  this.buffer = Buffer$5.concat([this.buffer, Buffer$5.from(data)]);
  this.emit("data", data);
};
DataStream$2.prototype.end = function end(data) {
  if (data)
    this.write(data);
  this.emit("end", data);
  this.emit("close");
  this.writable = false;
  this.readable = false;
};
var dataStream = DataStream$2;
var bufferEqualConstantTime;
var hasRequiredBufferEqualConstantTime;
function requireBufferEqualConstantTime() {
  if (hasRequiredBufferEqualConstantTime) return bufferEqualConstantTime;
  hasRequiredBufferEqualConstantTime = 1;
  var Buffer2 = require$$0$4.Buffer;
  var SlowBuffer = require$$0$4.SlowBuffer;
  bufferEqualConstantTime = bufferEq;
  function bufferEq(a, b) {
    if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    var c = 0;
    for (var i = 0; i < a.length; i++) {
      c |= a[i] ^ b[i];
    }
    return c === 0;
  }
  bufferEq.install = function() {
    Buffer2.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
      return bufferEq(this, that);
    };
  };
  var origBufEqual = Buffer2.prototype.equal;
  var origSlowBufEqual = SlowBuffer.prototype.equal;
  bufferEq.restore = function() {
    Buffer2.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
  };
  return bufferEqualConstantTime;
}
var Buffer$4 = safeBufferExports.Buffer;
var crypto$1 = require$$0$3;
var formatEcdsa = ecdsaSigFormatter;
var util$2 = require$$2;
var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
var MSG_INVALID_SECRET = "secret must be a string or buffer";
var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
var supportsKeyObjects = typeof crypto$1.createPublicKey === "function";
if (supportsKeyObjects) {
  MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
  MSG_INVALID_SECRET += "or a KeyObject";
}
function checkIsPublicKey(key) {
  if (Buffer$4.isBuffer(key)) {
    return;
  }
  if (typeof key === "string") {
    return;
  }
  if (!supportsKeyObjects) {
    throw typeError(MSG_INVALID_VERIFIER_KEY);
  }
  if (typeof key !== "object") {
    throw typeError(MSG_INVALID_VERIFIER_KEY);
  }
  if (typeof key.type !== "string") {
    throw typeError(MSG_INVALID_VERIFIER_KEY);
  }
  if (typeof key.asymmetricKeyType !== "string") {
    throw typeError(MSG_INVALID_VERIFIER_KEY);
  }
  if (typeof key.export !== "function") {
    throw typeError(MSG_INVALID_VERIFIER_KEY);
  }
}
function checkIsPrivateKey(key) {
  if (Buffer$4.isBuffer(key)) {
    return;
  }
  if (typeof key === "string") {
    return;
  }
  if (typeof key === "object") {
    return;
  }
  throw typeError(MSG_INVALID_SIGNER_KEY);
}
function checkIsSecretKey(key) {
  if (Buffer$4.isBuffer(key)) {
    return;
  }
  if (typeof key === "string") {
    return key;
  }
  if (!supportsKeyObjects) {
    throw typeError(MSG_INVALID_SECRET);
  }
  if (typeof key !== "object") {
    throw typeError(MSG_INVALID_SECRET);
  }
  if (key.type !== "secret") {
    throw typeError(MSG_INVALID_SECRET);
  }
  if (typeof key.export !== "function") {
    throw typeError(MSG_INVALID_SECRET);
  }
}
function fromBase64(base64) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function toBase64(base64url2) {
  base64url2 = base64url2.toString();
  var padding = 4 - base64url2.length % 4;
  if (padding !== 4) {
    for (var i = 0; i < padding; ++i) {
      base64url2 += "=";
    }
  }
  return base64url2.replace(/\-/g, "+").replace(/_/g, "/");
}
function typeError(template) {
  var args = [].slice.call(arguments, 1);
  var errMsg = util$2.format.bind(util$2, template).apply(null, args);
  return new TypeError(errMsg);
}
function bufferOrString(obj) {
  return Buffer$4.isBuffer(obj) || typeof obj === "string";
}
function normalizeInput(thing) {
  if (!bufferOrString(thing))
    thing = JSON.stringify(thing);
  return thing;
}
function createHmacSigner(bits) {
  return function sign3(thing, secret) {
    checkIsSecretKey(secret);
    thing = normalizeInput(thing);
    var hmac = crypto$1.createHmac("sha" + bits, secret);
    var sig = (hmac.update(thing), hmac.digest("base64"));
    return fromBase64(sig);
  };
}
var bufferEqual;
var timingSafeEqual = "timingSafeEqual" in crypto$1 ? function timingSafeEqual2(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  return crypto$1.timingSafeEqual(a, b);
} : function timingSafeEqual3(a, b) {
  if (!bufferEqual) {
    bufferEqual = requireBufferEqualConstantTime();
  }
  return bufferEqual(a, b);
};
function createHmacVerifier(bits) {
  return function verify2(thing, signature, secret) {
    var computedSig = createHmacSigner(bits)(thing, secret);
    return timingSafeEqual(Buffer$4.from(signature), Buffer$4.from(computedSig));
  };
}
function createKeySigner(bits) {
  return function sign3(thing, privateKey) {
    checkIsPrivateKey(privateKey);
    thing = normalizeInput(thing);
    var signer = crypto$1.createSign("RSA-SHA" + bits);
    var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
    return fromBase64(sig);
  };
}
function createKeyVerifier(bits) {
  return function verify2(thing, signature, publicKey) {
    checkIsPublicKey(publicKey);
    thing = normalizeInput(thing);
    signature = toBase64(signature);
    var verifier = crypto$1.createVerify("RSA-SHA" + bits);
    verifier.update(thing);
    return verifier.verify(publicKey, signature, "base64");
  };
}
function createPSSKeySigner(bits) {
  return function sign3(thing, privateKey) {
    checkIsPrivateKey(privateKey);
    thing = normalizeInput(thing);
    var signer = crypto$1.createSign("RSA-SHA" + bits);
    var sig = (signer.update(thing), signer.sign({
      key: privateKey,
      padding: crypto$1.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto$1.constants.RSA_PSS_SALTLEN_DIGEST
    }, "base64"));
    return fromBase64(sig);
  };
}
function createPSSKeyVerifier(bits) {
  return function verify2(thing, signature, publicKey) {
    checkIsPublicKey(publicKey);
    thing = normalizeInput(thing);
    signature = toBase64(signature);
    var verifier = crypto$1.createVerify("RSA-SHA" + bits);
    verifier.update(thing);
    return verifier.verify({
      key: publicKey,
      padding: crypto$1.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto$1.constants.RSA_PSS_SALTLEN_DIGEST
    }, signature, "base64");
  };
}
function createECDSASigner(bits) {
  var inner = createKeySigner(bits);
  return function sign3() {
    var signature = inner.apply(null, arguments);
    signature = formatEcdsa.derToJose(signature, "ES" + bits);
    return signature;
  };
}
function createECDSAVerifer(bits) {
  var inner = createKeyVerifier(bits);
  return function verify2(thing, signature, publicKey) {
    signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
    var result = inner(thing, signature, publicKey);
    return result;
  };
}
function createNoneSigner() {
  return function sign3() {
    return "";
  };
}
function createNoneVerifier() {
  return function verify2(thing, signature) {
    return signature === "";
  };
}
var jwa$2 = function jwa(algorithm) {
  var signerFactories = {
    hs: createHmacSigner,
    rs: createKeySigner,
    ps: createPSSKeySigner,
    es: createECDSASigner,
    none: createNoneSigner
  };
  var verifierFactories = {
    hs: createHmacVerifier,
    rs: createKeyVerifier,
    ps: createPSSKeyVerifier,
    es: createECDSAVerifer,
    none: createNoneVerifier
  };
  var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
  if (!match)
    throw typeError(MSG_INVALID_ALGORITHM, algorithm);
  var algo = (match[1] || match[3]).toLowerCase();
  var bits = match[2];
  return {
    sign: signerFactories[algo](bits),
    verify: verifierFactories[algo](bits)
  };
};
var Buffer$3 = require$$0$4.Buffer;
var tostring = function toString(obj) {
  if (typeof obj === "string")
    return obj;
  if (typeof obj === "number" || Buffer$3.isBuffer(obj))
    return obj.toString();
  return JSON.stringify(obj);
};
var Buffer$2 = safeBufferExports.Buffer;
var DataStream$1 = dataStream;
var jwa$1 = jwa$2;
var Stream$1 = require$$3;
var toString$1 = tostring;
var util$1 = require$$2;
function base64url(string, encoding) {
  return Buffer$2.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function jwsSecuredInput(header, payload, encoding) {
  encoding = encoding || "utf8";
  var encodedHeader = base64url(toString$1(header), "binary");
  var encodedPayload = base64url(toString$1(payload), encoding);
  return util$1.format("%s.%s", encodedHeader, encodedPayload);
}
function jwsSign(opts) {
  var header = opts.header;
  var payload = opts.payload;
  var secretOrKey = opts.secret || opts.privateKey;
  var encoding = opts.encoding;
  var algo = jwa$1(header.alg);
  var securedInput = jwsSecuredInput(header, payload, encoding);
  var signature = algo.sign(securedInput, secretOrKey);
  return util$1.format("%s.%s", securedInput, signature);
}
function SignStream$1(opts) {
  var secret = opts.secret;
  secret = secret == null ? opts.privateKey : secret;
  secret = secret == null ? opts.key : secret;
  if (/^hs/i.test(opts.header.alg) === true && secret == null) {
    throw new TypeError("secret must be a string or buffer or a KeyObject");
  }
  var secretStream = new DataStream$1(secret);
  this.readable = true;
  this.header = opts.header;
  this.encoding = opts.encoding;
  this.secret = this.privateKey = this.key = secretStream;
  this.payload = new DataStream$1(opts.payload);
  this.secret.once("close", (function() {
    if (!this.payload.writable && this.readable)
      this.sign();
  }).bind(this));
  this.payload.once("close", (function() {
    if (!this.secret.writable && this.readable)
      this.sign();
  }).bind(this));
}
util$1.inherits(SignStream$1, Stream$1);
SignStream$1.prototype.sign = function sign() {
  try {
    var signature = jwsSign({
      header: this.header,
      payload: this.payload.buffer,
      secret: this.secret.buffer,
      encoding: this.encoding
    });
    this.emit("done", signature);
    this.emit("data", signature);
    this.emit("end");
    this.readable = false;
    return signature;
  } catch (e) {
    this.readable = false;
    this.emit("error", e);
    this.emit("close");
  }
};
SignStream$1.sign = jwsSign;
var signStream = SignStream$1;
var Buffer$1 = safeBufferExports.Buffer;
var DataStream = dataStream;
var jwa2 = jwa$2;
var Stream = require$$3;
var toString2 = tostring;
var util = require$$2;
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
function isObject(thing) {
  return Object.prototype.toString.call(thing) === "[object Object]";
}
function safeJsonParse(thing) {
  if (isObject(thing))
    return thing;
  try {
    return JSON.parse(thing);
  } catch (e) {
    return void 0;
  }
}
function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split(".", 1)[0];
  return safeJsonParse(Buffer$1.from(encodedHeader, "base64").toString("binary"));
}
function securedInputFromJWS(jwsSig) {
  return jwsSig.split(".", 2).join(".");
}
function signatureFromJWS(jwsSig) {
  return jwsSig.split(".")[2];
}
function payloadFromJWS(jwsSig, encoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[1];
  return Buffer$1.from(payload, "base64").toString(encoding);
}
function isValidJws(string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}
function jwsVerify(jwsSig, algorithm, secretOrKey) {
  if (!algorithm) {
    var err = new Error("Missing algorithm parameter for jws.verify");
    err.code = "MISSING_ALGORITHM";
    throw err;
  }
  jwsSig = toString2(jwsSig);
  var signature = signatureFromJWS(jwsSig);
  var securedInput = securedInputFromJWS(jwsSig);
  var algo = jwa2(algorithm);
  return algo.verify(securedInput, signature, secretOrKey);
}
function jwsDecode(jwsSig, opts) {
  opts = opts || {};
  jwsSig = toString2(jwsSig);
  if (!isValidJws(jwsSig))
    return null;
  var header = headerFromJWS(jwsSig);
  if (!header)
    return null;
  var payload = payloadFromJWS(jwsSig);
  if (header.typ === "JWT" || opts.json)
    payload = JSON.parse(payload, opts.encoding);
  return {
    header,
    payload,
    signature: signatureFromJWS(jwsSig)
  };
}
function VerifyStream$1(opts) {
  opts = opts || {};
  var secretOrKey = opts.secret;
  secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
  secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
  if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
    throw new TypeError("secret must be a string or buffer or a KeyObject");
  }
  var secretStream = new DataStream(secretOrKey);
  this.readable = true;
  this.algorithm = opts.algorithm;
  this.encoding = opts.encoding;
  this.secret = this.publicKey = this.key = secretStream;
  this.signature = new DataStream(opts.signature);
  this.secret.once("close", (function() {
    if (!this.signature.writable && this.readable)
      this.verify();
  }).bind(this));
  this.signature.once("close", (function() {
    if (!this.secret.writable && this.readable)
      this.verify();
  }).bind(this));
}
util.inherits(VerifyStream$1, Stream);
VerifyStream$1.prototype.verify = function verify() {
  try {
    var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
    var obj = jwsDecode(this.signature.buffer, this.encoding);
    this.emit("done", valid, obj);
    this.emit("data", valid);
    this.emit("end");
    this.readable = false;
    return valid;
  } catch (e) {
    this.readable = false;
    this.emit("error", e);
    this.emit("close");
  }
};
VerifyStream$1.decode = jwsDecode;
VerifyStream$1.isValid = isValidJws;
VerifyStream$1.verify = jwsVerify;
var verifyStream = VerifyStream$1;
var SignStream = signStream;
var VerifyStream = verifyStream;
var ALGORITHMS = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512"
];
jws$2.ALGORITHMS = ALGORITHMS;
jws$2.sign = SignStream.sign;
jws$2.verify = VerifyStream.verify;
jws$2.decode = VerifyStream.decode;
jws$2.isValid = VerifyStream.isValid;
jws$2.createSign = function createSign(opts) {
  return new SignStream(opts);
};
jws$2.createVerify = function createVerify(opts) {
  return new VerifyStream(opts);
};
Object.defineProperty(src, "__esModule", {
  value: true
});
src.GoogleToken = void 0;
var fs$2 = _interopRequireWildcard(fs$4);
var _gaxios = src$3;
var jws$1 = _interopRequireWildcard(jws$2);
var path = _interopRequireWildcard(path$2);
var _util = require$$2;
function _interopRequireWildcard(e, t) {
  if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
    if (!t2 && e2 && e2.__esModule) return e2;
    var o, i, f = { __proto__: null, "default": e2 };
    if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
    if (o = t2 ? n : r) {
      if (o.has(e2)) return o.get(e2);
      o.set(e2, f);
    }
    for (var _t3 in e2) "default" !== _t3 && {}.hasOwnProperty.call(e2, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e2[_t3]);
    return f;
  })(e, t);
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _classPrivateMethodInitSpec(e, a) {
  _checkPrivateRedeclaration(e, a), a.add(e);
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldSet(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _classPrivateFieldGet(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", { writable: false }), e;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: true, configurable: true } }), Object.defineProperty(t, "prototype", { writable: false }), e && _setPrototypeOf(t, e);
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return _wrapNativeSuper = function _wrapNativeSuper2(t2) {
    if (null === t2 || !_isNativeFunction(t2)) return t2;
    if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t2)) return r.get(t2);
      r.set(t2, Wrapper);
    }
    function Wrapper() {
      return _construct(t2, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }), _setPrototypeOf(Wrapper, t2);
  }, _wrapNativeSuper(t);
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
  function i(r2, n2, o2, i2) {
    var c2 = n2 && n2.prototype instanceof Generator ? n2 : Generator, u2 = Object.create(c2.prototype);
    return _regeneratorDefine2(u2, "_invoke", function(r3, n3, o3) {
      var i3, c3, u3, f2 = 0, p = o3 || [], y = false, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d2(t2, r4) {
        return i3 = t2, c3 = 0, u3 = e, G.n = r4, a;
      } };
      function d(r4, n4) {
        for (c3 = r4, u3 = n4, t = 0; !y && f2 && !o4 && t < p.length; t++) {
          var o4, i4 = p[t], d2 = G.p, l = i4[2];
          r4 > 3 ? (o4 = l === n4) && (u3 = i4[(c3 = i4[4]) ? 5 : (c3 = 3, 3)], i4[4] = i4[5] = e) : i4[0] <= d2 && ((o4 = r4 < 2 && d2 < i4[1]) ? (c3 = 0, G.v = n4, G.n = i4[1]) : d2 < l && (o4 = r4 < 3 || i4[0] > n4 || n4 > l) && (i4[4] = r4, i4[5] = n4, G.n = l, c3 = 0));
        }
        if (o4 || r4 > 1) return a;
        throw y = true, n4;
      }
      return function(o4, p2, l) {
        if (f2 > 1) throw TypeError("Generator is already running");
        for (y && 1 === p2 && d(p2, l), c3 = p2, u3 = l; (t = c3 < 2 ? e : u3) || !y; ) {
          i3 || (c3 ? c3 < 3 ? (c3 > 1 && (G.n = -1), d(c3, u3)) : G.n = u3 : G.v = u3);
          try {
            if (f2 = 2, i3) {
              if (c3 || (o4 = "next"), t = i3[o4]) {
                if (!(t = t.call(i3, u3))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u3 = t.value, c3 < 2 && (c3 = 0);
              } else 1 === c3 && (t = i3["return"]) && t.call(i3), c3 < 2 && (u3 = TypeError("The iterator does not provide a '" + o4 + "' method"), c3 = 1);
              i3 = e;
            } else if ((t = (y = G.n < 0) ? u3 : r3.call(n3, G)) !== a) break;
          } catch (t2) {
            i3 = e, c3 = 1, u3 = t2;
          } finally {
            f2 = 1;
          }
        }
        return { value: t, done: y };
      };
    }(r2, o2, i2), true), u2;
  }
  var a = {};
  function Generator() {
  }
  function GeneratorFunction() {
  }
  function GeneratorFunctionPrototype() {
  }
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function() {
    return this;
  }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e2) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e2, GeneratorFunctionPrototype) : (e2.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e2, o, "GeneratorFunction")), e2.prototype = Object.create(u), e2;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function() {
    return this;
  }), _regeneratorDefine2(u, "toString", function() {
    return "[object Generator]";
  }), (_regenerator = function _regenerator2() {
    return { w: i, m: f };
  })();
}
function _regeneratorDefine2(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e2) {
    i = 0;
  }
  _regeneratorDefine2 = function _regeneratorDefine(e2, r2, n2, t2) {
    if (r2) i ? i(e2, r2, { value: n2, enumerable: !t2, configurable: !t2, writable: !t2 }) : e2[r2] = n2;
    else {
      var o = function o2(r3, n3) {
        _regeneratorDefine2(e2, r3, function(e3) {
          return this._invoke(r3, n3, e3);
        });
      };
      o("next", 0), o("throw", 1), o("return", 2);
    }
  }, _regeneratorDefine2(e, r, n, t);
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c), u = i.value;
  } catch (n2) {
    return void e(n2);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function() {
    var t = this, e = arguments;
    return new Promise(function(r, o) {
      var a = n.apply(t, e);
      function _next(n2) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n2);
      }
      function _throw(n2) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n2);
      }
      _next(void 0);
    });
  };
}
var readFile$1 = fs$2.readFile ? (0, _util.promisify)(fs$2.readFile) : /* @__PURE__ */ _asyncToGenerator(/* @__PURE__ */ _regenerator().m(function _callee() {
  return _regenerator().w(function(_context) {
    while (1) switch (_context.n) {
      case 0:
        throw new ErrorWithCode("use key rather than keyFile.", "MISSING_CREDENTIALS");
      case 1:
        return _context.a(2);
    }
  }, _callee);
}));
var GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
var GOOGLE_REVOKE_TOKEN_URL = "https://oauth2.googleapis.com/revoke?token=";
var ErrorWithCode = /* @__PURE__ */ function(_Error) {
  function ErrorWithCode2(message, code2) {
    var _this;
    _classCallCheck(this, ErrorWithCode2);
    _this = _callSuper(this, ErrorWithCode2, [message]);
    _defineProperty(_this, "code", void 0);
    _this.code = code2;
    return _this;
  }
  _inherits(ErrorWithCode2, _Error);
  return _createClass(ErrorWithCode2);
}(/* @__PURE__ */ _wrapNativeSuper(Error));
var _inFlightRequest = /* @__PURE__ */ new WeakMap();
var _GoogleToken_brand = /* @__PURE__ */ new WeakSet();
src.GoogleToken = /* @__PURE__ */ function() {
  function GoogleToken(_options) {
    _classCallCheck(this, GoogleToken);
    _classPrivateMethodInitSpec(this, _GoogleToken_brand);
    _defineProperty(this, "expiresAt", void 0);
    _defineProperty(this, "key", void 0);
    _defineProperty(this, "keyFile", void 0);
    _defineProperty(this, "iss", void 0);
    _defineProperty(this, "sub", void 0);
    _defineProperty(this, "scope", void 0);
    _defineProperty(this, "rawToken", void 0);
    _defineProperty(this, "tokenExpires", void 0);
    _defineProperty(this, "email", void 0);
    _defineProperty(this, "additionalClaims", void 0);
    _defineProperty(this, "eagerRefreshThresholdMillis", void 0);
    _defineProperty(this, "transporter", {
      request: function request(opts) {
        return (0, _gaxios.request)(opts);
      }
    });
    _classPrivateFieldInitSpec(this, _inFlightRequest, void 0);
    _assertClassBrand(_GoogleToken_brand, this, _configure).call(this, _options);
  }
  return _createClass(GoogleToken, [{
    key: "accessToken",
    get: function get() {
      return this.rawToken ? this.rawToken.access_token : void 0;
    }
  }, {
    key: "idToken",
    get: function get() {
      return this.rawToken ? this.rawToken.id_token : void 0;
    }
  }, {
    key: "tokenType",
    get: function get() {
      return this.rawToken ? this.rawToken.token_type : void 0;
    }
  }, {
    key: "refreshToken",
    get: function get() {
      return this.rawToken ? this.rawToken.refresh_token : void 0;
    }
  }, {
    key: "hasExpired",
    value: function hasExpired() {
      var now = (/* @__PURE__ */ new Date()).getTime();
      if (this.rawToken && this.expiresAt) {
        return now >= this.expiresAt;
      } else {
        return true;
      }
    }
    /**
     * Returns whether the token will expire within eagerRefreshThresholdMillis
     *
     * @return true if the token will be expired within eagerRefreshThresholdMillis, false otherwise.
     */
  }, {
    key: "isTokenExpiring",
    value: function isTokenExpiring() {
      var _this$eagerRefreshThr;
      var now = (/* @__PURE__ */ new Date()).getTime();
      var eagerRefreshThresholdMillis = (_this$eagerRefreshThr = this.eagerRefreshThresholdMillis) !== null && _this$eagerRefreshThr !== void 0 ? _this$eagerRefreshThr : 0;
      if (this.rawToken && this.expiresAt) {
        return this.expiresAt <= now + eagerRefreshThresholdMillis;
      } else {
        return true;
      }
    }
    /**
     * Returns a cached token or retrieves a new one from Google.
     *
     * @param callback The callback function.
     */
  }, {
    key: "getToken",
    value: function getToken(callback) {
      var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (_typeof(callback) === "object") {
        opts = callback;
        callback = void 0;
      }
      opts = Object.assign({
        forceRefresh: false
      }, opts);
      if (callback) {
        var cb = callback;
        _assertClassBrand(_GoogleToken_brand, this, _getTokenAsync).call(this, opts).then(function(t) {
          return cb(null, t);
        }, callback);
        return;
      }
      return _assertClassBrand(_GoogleToken_brand, this, _getTokenAsync).call(this, opts);
    }
    /**
     * Given a keyFile, extract the key and client email if available
     * @param keyFile Path to a json, pem, or p12 file that contains the key.
     * @returns an object with privateKey and clientEmail properties
     */
  }, {
    key: "getCredentials",
    value: function() {
      var _getCredentials = _asyncToGenerator(/* @__PURE__ */ _regenerator().m(function _callee2(keyFile) {
        var ext, key, body, privateKey, clientEmail, _privateKey, _t;
        return _regenerator().w(function(_context2) {
          while (1) switch (_context2.n) {
            case 0:
              ext = path.extname(keyFile);
              _t = ext;
              _context2.n = _t === ".json" ? 1 : _t === ".der" ? 4 : _t === ".crt" ? 4 : _t === ".pem" ? 4 : _t === ".p12" ? 6 : _t === ".pfx" ? 6 : 7;
              break;
            case 1:
              _context2.n = 2;
              return readFile$1(keyFile, "utf8");
            case 2:
              key = _context2.v;
              body = JSON.parse(key);
              privateKey = body.private_key;
              clientEmail = body.client_email;
              if (!(!privateKey || !clientEmail)) {
                _context2.n = 3;
                break;
              }
              throw new ErrorWithCode("private_key and client_email are required.", "MISSING_CREDENTIALS");
            case 3:
              return _context2.a(2, {
                privateKey,
                clientEmail
              });
            case 4:
              _context2.n = 5;
              return readFile$1(keyFile, "utf8");
            case 5:
              _privateKey = _context2.v;
              return _context2.a(2, {
                privateKey: _privateKey
              });
            case 6:
              throw new ErrorWithCode("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
            case 7:
              throw new ErrorWithCode("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE");
            case 8:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function getCredentials(_x) {
        return _getCredentials.apply(this, arguments);
      }
      return getCredentials;
    }()
  }, {
    key: "revokeToken",
    value: function revokeToken(callback) {
      if (callback) {
        _assertClassBrand(_GoogleToken_brand, this, _revokeTokenAsync).call(this).then(function() {
          return callback();
        }, callback);
        return;
      }
      return _assertClassBrand(_GoogleToken_brand, this, _revokeTokenAsync).call(this);
    }
  }]);
}();
function _getTokenAsync(_x2) {
  return _getTokenAsync2.apply(this, arguments);
}
function _getTokenAsync2() {
  _getTokenAsync2 = _asyncToGenerator(/* @__PURE__ */ _regenerator().m(function _callee3(opts) {
    return _regenerator().w(function(_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (!(_classPrivateFieldGet(_inFlightRequest, this) && !opts.forceRefresh)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, _classPrivateFieldGet(_inFlightRequest, this));
        case 1:
          _context3.p = 1;
          _context3.n = 2;
          return _classPrivateFieldSet(_inFlightRequest, this, _assertClassBrand(_GoogleToken_brand, this, _getTokenAsyncInner).call(this, opts));
        case 2:
          return _context3.a(2, _context3.v);
        case 3:
          _context3.p = 3;
          _classPrivateFieldSet(_inFlightRequest, this, void 0);
          return _context3.f(3);
        case 4:
          return _context3.a(2);
      }
    }, _callee3, this, [[1, , 3, 4]]);
  }));
  return _getTokenAsync2.apply(this, arguments);
}
function _getTokenAsyncInner(_x3) {
  return _getTokenAsyncInner2.apply(this, arguments);
}
function _getTokenAsyncInner2() {
  _getTokenAsyncInner2 = _asyncToGenerator(/* @__PURE__ */ _regenerator().m(function _callee4(opts) {
    var creds;
    return _regenerator().w(function(_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (!(this.isTokenExpiring() === false && opts.forceRefresh === false)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, Promise.resolve(this.rawToken));
        case 1:
          if (!(!this.key && !this.keyFile)) {
            _context4.n = 2;
            break;
          }
          throw new Error("No key or keyFile set.");
        case 2:
          if (!(!this.key && this.keyFile)) {
            _context4.n = 4;
            break;
          }
          _context4.n = 3;
          return this.getCredentials(this.keyFile);
        case 3:
          creds = _context4.v;
          this.key = creds.privateKey;
          this.iss = creds.clientEmail || this.iss;
          if (!creds.clientEmail) {
            _assertClassBrand(_GoogleToken_brand, this, _ensureEmail).call(this);
          }
        case 4:
          return _context4.a(2, _assertClassBrand(_GoogleToken_brand, this, _requestToken).call(this));
      }
    }, _callee4, this);
  }));
  return _getTokenAsyncInner2.apply(this, arguments);
}
function _ensureEmail() {
  if (!this.iss) {
    throw new ErrorWithCode("email is required.", "MISSING_CREDENTIALS");
  }
}
function _revokeTokenAsync() {
  return _revokeTokenAsync2.apply(this, arguments);
}
function _revokeTokenAsync2() {
  _revokeTokenAsync2 = _asyncToGenerator(/* @__PURE__ */ _regenerator().m(function _callee5() {
    var url2;
    return _regenerator().w(function(_context5) {
      while (1) switch (_context5.n) {
        case 0:
          if (this.accessToken) {
            _context5.n = 1;
            break;
          }
          throw new Error("No token to revoke.");
        case 1:
          url2 = GOOGLE_REVOKE_TOKEN_URL + this.accessToken;
          _context5.n = 2;
          return this.transporter.request({
            url: url2,
            retry: true
          });
        case 2:
          _assertClassBrand(_GoogleToken_brand, this, _configure).call(this, {
            email: this.iss,
            sub: this.sub,
            key: this.key,
            keyFile: this.keyFile,
            scope: this.scope,
            additionalClaims: this.additionalClaims
          });
        case 3:
          return _context5.a(2);
      }
    }, _callee5, this);
  }));
  return _revokeTokenAsync2.apply(this, arguments);
}
function _configure() {
  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  this.keyFile = options.keyFile;
  this.key = options.key;
  this.rawToken = void 0;
  this.iss = options.email || options.iss;
  this.sub = options.sub;
  this.additionalClaims = options.additionalClaims;
  if (_typeof(options.scope) === "object") {
    this.scope = options.scope.join(" ");
  } else {
    this.scope = options.scope;
  }
  this.eagerRefreshThresholdMillis = options.eagerRefreshThresholdMillis;
  if (options.transporter) {
    this.transporter = options.transporter;
  }
}
function _requestToken() {
  return _requestToken2.apply(this, arguments);
}
function _requestToken2() {
  _requestToken2 = _asyncToGenerator(/* @__PURE__ */ _regenerator().m(function _callee6() {
    var iat, additionalClaims, payload, signedJWT, r, _response, _response2, body, desc, _t2;
    return _regenerator().w(function(_context6) {
      while (1) switch (_context6.n) {
        case 0:
          iat = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
          additionalClaims = this.additionalClaims || {};
          payload = Object.assign({
            iss: this.iss,
            scope: this.scope,
            aud: GOOGLE_TOKEN_URL,
            exp: iat + 3600,
            iat,
            sub: this.sub
          }, additionalClaims);
          signedJWT = jws$1.sign({
            header: {
              alg: "RS256"
            },
            payload,
            secret: this.key
          });
          _context6.p = 1;
          _context6.n = 2;
          return this.transporter.request({
            method: "POST",
            url: GOOGLE_TOKEN_URL,
            data: new URLSearchParams({
              grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
              assertion: signedJWT
            }),
            responseType: "json",
            retryConfig: {
              httpMethodsToRetry: ["POST"]
            }
          });
        case 2:
          r = _context6.v;
          this.rawToken = r.data;
          this.expiresAt = r.data.expires_in === null || r.data.expires_in === void 0 ? void 0 : (iat + r.data.expires_in) * 1e3;
          return _context6.a(2, this.rawToken);
        case 3:
          _context6.p = 3;
          _t2 = _context6.v;
          this.rawToken = void 0;
          this.tokenExpires = void 0;
          body = _t2.response && (_response = _t2.response) !== null && _response !== void 0 && _response.data ? (_response2 = _t2.response) === null || _response2 === void 0 ? void 0 : _response2.data : {};
          if (body.error) {
            desc = body.error_description ? ": ".concat(body.error_description) : "";
            _t2.message = "".concat(body.error).concat(desc);
          }
          throw _t2;
        case 4:
          return _context6.a(2);
      }
    }, _callee6, this, [[1, 3]]);
  }));
  return _requestToken2.apply(this, arguments);
}
var jwtaccess = {};
Object.defineProperty(jwtaccess, "__esModule", { value: true });
jwtaccess.JWTAccess = void 0;
const jws = jws$2;
const util_1$5 = util$4;
const DEFAULT_HEADER = {
  alg: "RS256",
  typ: "JWT"
};
class JWTAccess {
  /**
   * JWTAccess service account credentials.
   *
   * Create a new access token by using the credential to create a new JWT token
   * that's recognized as the access token.
   *
   * @param email the service account email address.
   * @param key the private key that will be used to sign the token.
   * @param keyId the ID of the private key used to sign the token.
   */
  constructor(email, key, keyId, eagerRefreshThresholdMillis) {
    __publicField(this, "email");
    __publicField(this, "key");
    __publicField(this, "keyId");
    __publicField(this, "projectId");
    __publicField(this, "eagerRefreshThresholdMillis");
    __publicField(this, "cache", new util_1$5.LRUCache({
      capacity: 500,
      maxAge: 60 * 60 * 1e3
    }));
    this.email = email;
    this.key = key;
    this.keyId = keyId;
    this.eagerRefreshThresholdMillis = eagerRefreshThresholdMillis ?? 5 * 60 * 1e3;
  }
  /**
   * Ensures that we're caching a key appropriately, giving precedence to scopes vs. url
   *
   * @param url The URI being authorized.
   * @param scopes The scope or scopes being authorized
   * @returns A string that returns the cached key.
   */
  getCachedKey(url2, scopes) {
    let cacheKey = url2;
    if (scopes && Array.isArray(scopes) && scopes.length) {
      cacheKey = url2 ? `${url2}_${scopes.join("_")}` : `${scopes.join("_")}`;
    } else if (typeof scopes === "string") {
      cacheKey = url2 ? `${url2}_${scopes}` : scopes;
    }
    if (!cacheKey) {
      throw Error("Scopes or url must be provided");
    }
    return cacheKey;
  }
  /**
   * Get a non-expired access token, after refreshing if necessary.
   *
   * @param url The URI being authorized.
   * @param additionalClaims An object with a set of additional claims to
   * include in the payload.
   * @returns An object that includes the authorization header.
   */
  getRequestHeaders(url2, additionalClaims, scopes) {
    const key = this.getCachedKey(url2, scopes);
    const cachedToken = this.cache.get(key);
    const now = Date.now();
    if (cachedToken && cachedToken.expiration - now > this.eagerRefreshThresholdMillis) {
      return new Headers(cachedToken.headers);
    }
    const iat = Math.floor(Date.now() / 1e3);
    const exp = JWTAccess.getExpirationTime(iat);
    let defaultClaims;
    if (Array.isArray(scopes)) {
      scopes = scopes.join(" ");
    }
    if (scopes) {
      defaultClaims = {
        iss: this.email,
        sub: this.email,
        scope: scopes,
        exp,
        iat
      };
    } else {
      defaultClaims = {
        iss: this.email,
        sub: this.email,
        aud: url2,
        exp,
        iat
      };
    }
    if (additionalClaims) {
      for (const claim in defaultClaims) {
        if (additionalClaims[claim]) {
          throw new Error(`The '${claim}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`);
        }
      }
    }
    const header = this.keyId ? { ...DEFAULT_HEADER, kid: this.keyId } : DEFAULT_HEADER;
    const payload = Object.assign(defaultClaims, additionalClaims);
    const signedJWT = jws.sign({ header, payload, secret: this.key });
    const headers = new Headers({ authorization: `Bearer ${signedJWT}` });
    this.cache.set(key, {
      expiration: exp * 1e3,
      headers
    });
    return headers;
  }
  /**
   * Returns an expiration time for the JWT token.
   *
   * @param iat The issued at time for the JWT.
   * @returns An expiration time for the JWT.
   */
  static getExpirationTime(iat) {
    const exp = iat + 3600;
    return exp;
  }
  /**
   * Create a JWTAccess credentials instance using the given input options.
   * @param json The input object.
   */
  fromJSON(json) {
    if (!json) {
      throw new Error("Must pass in a JSON object containing the service account auth settings.");
    }
    if (!json.client_email) {
      throw new Error("The incoming JSON object does not contain a client_email field");
    }
    if (!json.private_key) {
      throw new Error("The incoming JSON object does not contain a private_key field");
    }
    this.email = json.client_email;
    this.key = json.private_key;
    this.keyId = json.private_key_id;
    this.projectId = json.project_id;
  }
  fromStream(inputStream, callback) {
    if (callback) {
      this.fromStreamAsync(inputStream).then(() => callback(), callback);
    } else {
      return this.fromStreamAsync(inputStream);
    }
  }
  fromStreamAsync(inputStream) {
    return new Promise((resolve, reject) => {
      if (!inputStream) {
        reject(new Error("Must pass in a stream containing the service account auth settings."));
      }
      let s = "";
      inputStream.setEncoding("utf8").on("data", (chunk) => s += chunk).on("error", reject).on("end", () => {
        try {
          const data = JSON.parse(s);
          this.fromJSON(data);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}
jwtaccess.JWTAccess = JWTAccess;
Object.defineProperty(jwtclient, "__esModule", { value: true });
jwtclient.JWT = void 0;
const gtoken_1 = src;
const jwtaccess_1 = jwtaccess;
const oauth2client_1$2 = oauth2client;
const authclient_1$6 = authclient;
class JWT extends oauth2client_1$2.OAuth2Client {
  /**
   * JWT service account credentials.
   *
   * Retrieve access token using gtoken.
   *
   * @param options the
   */
  constructor(options = {}) {
    super(options);
    __publicField(this, "email");
    __publicField(this, "keyFile");
    __publicField(this, "key");
    __publicField(this, "keyId");
    __publicField(this, "defaultScopes");
    __publicField(this, "scopes");
    __publicField(this, "scope");
    __publicField(this, "subject");
    __publicField(this, "gtoken");
    __publicField(this, "additionalClaims");
    __publicField(this, "useJWTAccessWithScope");
    __publicField(this, "defaultServicePath");
    __publicField(this, "access");
    this.email = options.email;
    this.keyFile = options.keyFile;
    this.key = options.key;
    this.keyId = options.keyId;
    this.scopes = options.scopes;
    this.subject = options.subject;
    this.additionalClaims = options.additionalClaims;
    this.credentials = { refresh_token: "jwt-placeholder", expiry_date: 1 };
  }
  /**
   * Creates a copy of the credential with the specified scopes.
   * @param scopes List of requested scopes or a single scope.
   * @return The cloned instance.
   */
  createScoped(scopes) {
    const jwt = new JWT(this);
    jwt.scopes = scopes;
    return jwt;
  }
  /**
   * Obtains the metadata to be sent with the request.
   *
   * @param url the URI being authorized.
   */
  async getRequestMetadataAsync(url2) {
    url2 = this.defaultServicePath ? `https://${this.defaultServicePath}/` : url2;
    const useSelfSignedJWT = !this.hasUserScopes() && url2 || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== authclient_1$6.DEFAULT_UNIVERSE;
    if (this.subject && this.universeDomain !== authclient_1$6.DEFAULT_UNIVERSE) {
      throw new RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${authclient_1$6.DEFAULT_UNIVERSE}`);
    }
    if (!this.apiKey && useSelfSignedJWT) {
      if (this.additionalClaims && this.additionalClaims.target_audience) {
        const { tokens } = await this.refreshToken();
        return {
          headers: this.addSharedMetadataHeaders(new Headers({
            authorization: `Bearer ${tokens.id_token}`
          }))
        };
      } else {
        if (!this.access) {
          this.access = new jwtaccess_1.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
        }
        let scopes;
        if (this.hasUserScopes()) {
          scopes = this.scopes;
        } else if (!url2) {
          scopes = this.defaultScopes;
        }
        const useScopes = this.useJWTAccessWithScope || this.universeDomain !== authclient_1$6.DEFAULT_UNIVERSE;
        const headers = await this.access.getRequestHeaders(
          url2 ?? void 0,
          this.additionalClaims,
          // Scopes take precedent over audience for signing,
          // so we only provide them if `useJWTAccessWithScope` is on or
          // if we are in a non-default universe
          useScopes ? scopes : void 0
        );
        return { headers: this.addSharedMetadataHeaders(headers) };
      }
    } else if (this.hasAnyScopes() || this.apiKey) {
      return super.getRequestMetadataAsync(url2);
    } else {
      return { headers: new Headers() };
    }
  }
  /**
   * Fetches an ID token.
   * @param targetAudience the audience for the fetched ID token.
   */
  async fetchIdToken(targetAudience) {
    const gtoken = new gtoken_1.GoogleToken({
      iss: this.email,
      sub: this.subject,
      scope: this.scopes || this.defaultScopes,
      keyFile: this.keyFile,
      key: this.key,
      additionalClaims: { target_audience: targetAudience },
      transporter: this.transporter
    });
    await gtoken.getToken({
      forceRefresh: true
    });
    if (!gtoken.idToken) {
      throw new Error("Unknown error: Failed to fetch ID token");
    }
    return gtoken.idToken;
  }
  /**
   * Determine if there are currently scopes available.
   */
  hasUserScopes() {
    if (!this.scopes) {
      return false;
    }
    return this.scopes.length > 0;
  }
  /**
   * Are there any default or user scopes defined.
   */
  hasAnyScopes() {
    if (this.scopes && this.scopes.length > 0)
      return true;
    if (this.defaultScopes && this.defaultScopes.length > 0)
      return true;
    return false;
  }
  authorize(callback) {
    if (callback) {
      this.authorizeAsync().then((r) => callback(null, r), callback);
    } else {
      return this.authorizeAsync();
    }
  }
  async authorizeAsync() {
    const result = await this.refreshToken();
    if (!result) {
      throw new Error("No result returned");
    }
    this.credentials = result.tokens;
    this.credentials.refresh_token = "jwt-placeholder";
    this.key = this.gtoken.key;
    this.email = this.gtoken.iss;
    return result.tokens;
  }
  /**
   * Refreshes the access token.
   * @param refreshToken ignored
   * @private
   */
  async refreshTokenNoCache() {
    const gtoken = this.createGToken();
    const token = await gtoken.getToken({
      forceRefresh: this.isTokenExpiring()
    });
    const tokens = {
      access_token: token.access_token,
      token_type: "Bearer",
      expiry_date: gtoken.expiresAt,
      id_token: gtoken.idToken
    };
    this.emit("tokens", tokens);
    return { res: null, tokens };
  }
  /**
   * Create a gToken if it doesn't already exist.
   */
  createGToken() {
    if (!this.gtoken) {
      this.gtoken = new gtoken_1.GoogleToken({
        iss: this.email,
        sub: this.subject,
        scope: this.scopes || this.defaultScopes,
        keyFile: this.keyFile,
        key: this.key,
        additionalClaims: this.additionalClaims,
        transporter: this.transporter
      });
    }
    return this.gtoken;
  }
  /**
   * Create a JWT credentials instance using the given input options.
   * @param json The input object.
   *
   * @remarks
   *
   * **Important**: If you accept a credential configuration (credential JSON/File/Stream) from an external source for authentication to Google Cloud, you must validate it before providing it to any Google API or library. Providing an unvalidated credential configuration to Google APIs can compromise the security of your systems and data. For more information, refer to {@link https://cloud.google.com/docs/authentication/external/externally-sourced-credentials Validate credential configurations from external sources}.
   */
  fromJSON(json) {
    if (!json) {
      throw new Error("Must pass in a JSON object containing the service account auth settings.");
    }
    if (!json.client_email) {
      throw new Error("The incoming JSON object does not contain a client_email field");
    }
    if (!json.private_key) {
      throw new Error("The incoming JSON object does not contain a private_key field");
    }
    this.email = json.client_email;
    this.key = json.private_key;
    this.keyId = json.private_key_id;
    this.projectId = json.project_id;
    this.quotaProjectId = json.quota_project_id;
    this.universeDomain = json.universe_domain || this.universeDomain;
  }
  fromStream(inputStream, callback) {
    if (callback) {
      this.fromStreamAsync(inputStream).then(() => callback(), callback);
    } else {
      return this.fromStreamAsync(inputStream);
    }
  }
  fromStreamAsync(inputStream) {
    return new Promise((resolve, reject) => {
      if (!inputStream) {
        throw new Error("Must pass in a stream containing the service account auth settings.");
      }
      let s = "";
      inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => s += chunk).on("end", () => {
        try {
          const data = JSON.parse(s);
          this.fromJSON(data);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  /**
   * Creates a JWT credentials instance using an API Key for authentication.
   * @param apiKey The API Key in string form.
   */
  fromAPIKey(apiKey) {
    if (typeof apiKey !== "string") {
      throw new Error("Must provide an API Key string.");
    }
    this.apiKey = apiKey;
  }
  /**
   * Using the key or keyFile on the JWT client, obtain an object that contains
   * the key and the client email.
   */
  async getCredentials() {
    if (this.key) {
      return { private_key: this.key, client_email: this.email };
    } else if (this.keyFile) {
      const gtoken = this.createGToken();
      const creds = await gtoken.getCredentials(this.keyFile);
      return { private_key: creds.privateKey, client_email: creds.clientEmail };
    }
    throw new Error("A key or a keyFile must be provided to getCredentials.");
  }
}
jwtclient.JWT = JWT;
var refreshclient = {};
Object.defineProperty(refreshclient, "__esModule", { value: true });
refreshclient.UserRefreshClient = refreshclient.USER_REFRESH_ACCOUNT_TYPE = void 0;
const oauth2client_1$1 = oauth2client;
const authclient_1$5 = authclient;
refreshclient.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
class UserRefreshClient extends oauth2client_1$1.OAuth2Client {
  /**
   * The User Refresh Token client.
   *
   * @param optionsOrClientId The User Refresh Token client options. Passing an `clientId` directly is **@DEPRECATED**.
   * @param clientSecret **@DEPRECATED**. Provide a {@link UserRefreshClientOptions `UserRefreshClientOptions`} object in the first parameter instead.
   * @param refreshToken **@DEPRECATED**. Provide a {@link UserRefreshClientOptions `UserRefreshClientOptions`} object in the first parameter instead.
   * @param eagerRefreshThresholdMillis **@DEPRECATED**. Provide a {@link UserRefreshClientOptions `UserRefreshClientOptions`} object in the first parameter instead.
   * @param forceRefreshOnFailure **@DEPRECATED**. Provide a {@link UserRefreshClientOptions `UserRefreshClientOptions`} object in the first parameter instead.
   */
  constructor(optionsOrClientId, clientSecret, refreshToken, eagerRefreshThresholdMillis, forceRefreshOnFailure) {
    const opts = optionsOrClientId && typeof optionsOrClientId === "object" ? optionsOrClientId : {
      clientId: optionsOrClientId,
      clientSecret,
      refreshToken,
      eagerRefreshThresholdMillis,
      forceRefreshOnFailure
    };
    super(opts);
    // TODO: refactor tests to make this private
    // In a future gts release, the _propertyName rule will be lifted.
    // This is also a hard one because `this.refreshToken` is a function.
    __publicField(this, "_refreshToken");
    this._refreshToken = opts.refreshToken;
    this.credentials.refresh_token = opts.refreshToken;
  }
  /**
   * Refreshes the access token.
   * @param refreshToken An ignored refreshToken..
   * @param callback Optional callback.
   */
  async refreshTokenNoCache() {
    return super.refreshTokenNoCache(this._refreshToken);
  }
  async fetchIdToken(targetAudience) {
    const opts = {
      ...UserRefreshClient.RETRY_CONFIG,
      url: this.endpoints.oauth2TokenUrl,
      method: "POST",
      data: new URLSearchParams({
        client_id: this._clientId,
        client_secret: this._clientSecret,
        grant_type: "refresh_token",
        refresh_token: this._refreshToken,
        target_audience: targetAudience
      })
    };
    authclient_1$5.AuthClient.setMethodName(opts, "fetchIdToken");
    const res = await this.transporter.request(opts);
    return res.data.id_token;
  }
  /**
   * Create a UserRefreshClient credentials instance using the given input
   * options.
   * @param json The input object.
   */
  fromJSON(json) {
    if (!json) {
      throw new Error("Must pass in a JSON object containing the user refresh token");
    }
    if (json.type !== "authorized_user") {
      throw new Error('The incoming JSON object does not have the "authorized_user" type');
    }
    if (!json.client_id) {
      throw new Error("The incoming JSON object does not contain a client_id field");
    }
    if (!json.client_secret) {
      throw new Error("The incoming JSON object does not contain a client_secret field");
    }
    if (!json.refresh_token) {
      throw new Error("The incoming JSON object does not contain a refresh_token field");
    }
    this._clientId = json.client_id;
    this._clientSecret = json.client_secret;
    this._refreshToken = json.refresh_token;
    this.credentials.refresh_token = json.refresh_token;
    this.quotaProjectId = json.quota_project_id;
    this.universeDomain = json.universe_domain || this.universeDomain;
  }
  fromStream(inputStream, callback) {
    if (callback) {
      this.fromStreamAsync(inputStream).then(() => callback(), callback);
    } else {
      return this.fromStreamAsync(inputStream);
    }
  }
  async fromStreamAsync(inputStream) {
    return new Promise((resolve, reject) => {
      if (!inputStream) {
        return reject(new Error("Must pass in a stream containing the user refresh token."));
      }
      let s = "";
      inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => s += chunk).on("end", () => {
        try {
          const data = JSON.parse(s);
          this.fromJSON(data);
          return resolve();
        } catch (err) {
          return reject(err);
        }
      });
    });
  }
  /**
   * Create a UserRefreshClient credentials instance using the given input
   * options.
   * @param json The input object.
   */
  static fromJSON(json) {
    const client = new UserRefreshClient();
    client.fromJSON(json);
    return client;
  }
}
refreshclient.UserRefreshClient = UserRefreshClient;
var impersonated = {};
Object.defineProperty(impersonated, "__esModule", { value: true });
impersonated.Impersonated = impersonated.IMPERSONATED_ACCOUNT_TYPE = void 0;
const oauth2client_1 = oauth2client;
const gaxios_1$6 = src$3;
const util_1$4 = util$4;
impersonated.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
class Impersonated extends oauth2client_1.OAuth2Client {
  /**
   * Impersonated service account credentials.
   *
   * Create a new access token by impersonating another service account.
   *
   * Impersonated Credentials allowing credentials issued to a user or
   * service account to impersonate another. The source project using
   * Impersonated Credentials must enable the "IAMCredentials" API.
   * Also, the target service account must grant the orginating principal
   * the "Service Account Token Creator" IAM role.
   *
   * **IMPORTANT**: This method does not validate the credential configuration.
   * A security risk occurs when a credential configuration configured with
   * malicious URLs is used. When the credential configuration is accepted from
   * an untrusted source, you should validate it before using it with this
   * method. For more details, see
   * https://cloud.google.com/docs/authentication/external/externally-sourced-credentials.
   *
   * @param {object} options - The configuration object.
   * @param {object} [options.sourceClient] the source credential used as to
   * acquire the impersonated credentials.
   * @param {string} [options.targetPrincipal] the service account to
   * impersonate.
   * @param {string[]} [options.delegates] the chained list of delegates
   * required to grant the final access_token. If set, the sequence of
   * identities must have "Service Account Token Creator" capability granted to
   * the preceding identity. For example, if set to [serviceAccountB,
   * serviceAccountC], the sourceCredential must have the Token Creator role on
   * serviceAccountB. serviceAccountB must have the Token Creator on
   * serviceAccountC. Finally, C must have Token Creator on target_principal.
   * If left unset, sourceCredential must have that role on targetPrincipal.
   * @param {string[]} [options.targetScopes] scopes to request during the
   * authorization grant.
   * @param {number} [options.lifetime] number of seconds the delegated
   * credential should be valid for up to 3600 seconds by default, or 43,200
   * seconds by extending the token's lifetime, see:
   * https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials#sa-credentials-oauth
   * @param {string} [options.endpoint] api endpoint override.
   */
  constructor(options = {}) {
    super(options);
    __publicField(this, "sourceClient");
    __publicField(this, "targetPrincipal");
    __publicField(this, "targetScopes");
    __publicField(this, "delegates");
    __publicField(this, "lifetime");
    __publicField(this, "endpoint");
    this.credentials = {
      expiry_date: 1,
      refresh_token: "impersonated-placeholder"
    };
    this.sourceClient = options.sourceClient ?? new oauth2client_1.OAuth2Client();
    this.targetPrincipal = options.targetPrincipal ?? "";
    this.delegates = options.delegates ?? [];
    this.targetScopes = options.targetScopes ?? [];
    this.lifetime = options.lifetime ?? 3600;
    const usingExplicitUniverseDomain = !!(0, util_1$4.originalOrCamelOptions)(options).get("universe_domain");
    if (!usingExplicitUniverseDomain) {
      this.universeDomain = this.sourceClient.universeDomain;
    } else if (this.sourceClient.universeDomain !== this.universeDomain) {
      throw new RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
    }
    this.endpoint = options.endpoint ?? `https://iamcredentials.${this.universeDomain}`;
  }
  /**
   * Signs some bytes.
   *
   * {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/signBlob Reference Documentation}
   * @param blobToSign String to sign.
   *
   * @returns A {@link SignBlobResponse} denoting the keyID and signedBlob in base64 string
   */
  async sign(blobToSign) {
    await this.sourceClient.getAccessToken();
    const name2 = `projects/-/serviceAccounts/${this.targetPrincipal}`;
    const u = `${this.endpoint}/v1/${name2}:signBlob`;
    const body = {
      delegates: this.delegates,
      payload: Buffer.from(blobToSign).toString("base64")
    };
    const res = await this.sourceClient.request({
      ...Impersonated.RETRY_CONFIG,
      url: u,
      data: body,
      method: "POST"
    });
    return res.data;
  }
  /** The service account email to be impersonated. */
  getTargetPrincipal() {
    return this.targetPrincipal;
  }
  /**
   * Refreshes the access token.
   */
  async refreshToken() {
    var _a2, _b, _c, _d, _e, _f;
    try {
      await this.sourceClient.getAccessToken();
      const name2 = "projects/-/serviceAccounts/" + this.targetPrincipal;
      const u = `${this.endpoint}/v1/${name2}:generateAccessToken`;
      const body = {
        delegates: this.delegates,
        scope: this.targetScopes,
        lifetime: this.lifetime + "s"
      };
      const res = await this.sourceClient.request({
        ...Impersonated.RETRY_CONFIG,
        url: u,
        data: body,
        method: "POST"
      });
      const tokenResponse = res.data;
      this.credentials.access_token = tokenResponse.accessToken;
      this.credentials.expiry_date = Date.parse(tokenResponse.expireTime);
      return {
        tokens: this.credentials,
        res
      };
    } catch (error) {
      if (!(error instanceof Error))
        throw error;
      let status = 0;
      let message = "";
      if (error instanceof gaxios_1$6.GaxiosError) {
        status = (_c = (_b = (_a2 = error == null ? void 0 : error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.error) == null ? void 0 : _c.status;
        message = (_f = (_e = (_d = error == null ? void 0 : error.response) == null ? void 0 : _d.data) == null ? void 0 : _e.error) == null ? void 0 : _f.message;
      }
      if (status && message) {
        error.message = `${status}: unable to impersonate: ${message}`;
        throw error;
      } else {
        error.message = `unable to impersonate: ${error}`;
        throw error;
      }
    }
  }
  /**
   * Generates an OpenID Connect ID token for a service account.
   *
   * {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/generateIdToken Reference Documentation}
   *
   * @param targetAudience the audience for the fetched ID token.
   * @param options the for the request
   * @return an OpenID Connect ID token
   */
  async fetchIdToken(targetAudience, options) {
    await this.sourceClient.getAccessToken();
    const name2 = `projects/-/serviceAccounts/${this.targetPrincipal}`;
    const u = `${this.endpoint}/v1/${name2}:generateIdToken`;
    const body = {
      delegates: this.delegates,
      audience: targetAudience,
      includeEmail: (options == null ? void 0 : options.includeEmail) ?? true,
      useEmailAzp: (options == null ? void 0 : options.includeEmail) ?? true
    };
    const res = await this.sourceClient.request({
      ...Impersonated.RETRY_CONFIG,
      url: u,
      data: body,
      method: "POST"
    });
    return res.data.token;
  }
}
impersonated.Impersonated = Impersonated;
var externalclient = {};
var baseexternalclient = {};
var stscredentials = {};
var oauth2common = {};
Object.defineProperty(oauth2common, "__esModule", { value: true });
oauth2common.OAuthClientAuthHandler = void 0;
oauth2common.getErrorFromOAuthErrorResponse = getErrorFromOAuthErrorResponse;
const gaxios_1$5 = src$3;
const crypto_1$1 = crypto$5;
const METHODS_SUPPORTING_REQUEST_BODY = ["PUT", "POST", "PATCH"];
class OAuthClientAuthHandler {
  /**
   * Instantiates an OAuth client authentication handler.
   * @param options The OAuth Client Auth Handler instance options. Passing an `ClientAuthentication` directly is **@DEPRECATED**.
   */
  constructor(options) {
    __privateAdd(this, _crypto, (0, crypto_1$1.createCrypto)());
    __privateAdd(this, _clientAuthentication);
    __publicField(this, "transporter");
    if (options && "clientId" in options) {
      __privateSet(this, _clientAuthentication, options);
      this.transporter = new gaxios_1$5.Gaxios();
    } else {
      __privateSet(this, _clientAuthentication, options == null ? void 0 : options.clientAuthentication);
      this.transporter = (options == null ? void 0 : options.transporter) || new gaxios_1$5.Gaxios();
    }
  }
  /**
   * Applies client authentication on the OAuth request's headers or POST
   * body but does not process the request.
   * @param opts The GaxiosOptions whose headers or data are to be modified
   *   depending on the client authentication mechanism to be used.
   * @param bearerToken The optional bearer token to use for authentication.
   *   When this is used, no client authentication credentials are needed.
   */
  applyClientAuthenticationOptions(opts, bearerToken) {
    opts.headers = gaxios_1$5.Gaxios.mergeHeaders(opts.headers);
    this.injectAuthenticatedHeaders(opts, bearerToken);
    if (!bearerToken) {
      this.injectAuthenticatedRequestBody(opts);
    }
  }
  /**
   * Applies client authentication on the request's header if either
   * basic authentication or bearer token authentication is selected.
   *
   * @param opts The GaxiosOptions whose headers or data are to be modified
   *   depending on the client authentication mechanism to be used.
   * @param bearerToken The optional bearer token to use for authentication.
   *   When this is used, no client authentication credentials are needed.
   */
  injectAuthenticatedHeaders(opts, bearerToken) {
    var _a2;
    if (bearerToken) {
      opts.headers = gaxios_1$5.Gaxios.mergeHeaders(opts.headers, {
        authorization: `Bearer ${bearerToken}`
      });
    } else if (((_a2 = __privateGet(this, _clientAuthentication)) == null ? void 0 : _a2.confidentialClientType) === "basic") {
      opts.headers = gaxios_1$5.Gaxios.mergeHeaders(opts.headers);
      const clientId = __privateGet(this, _clientAuthentication).clientId;
      const clientSecret = __privateGet(this, _clientAuthentication).clientSecret || "";
      const base64EncodedCreds = __privateGet(this, _crypto).encodeBase64StringUtf8(`${clientId}:${clientSecret}`);
      gaxios_1$5.Gaxios.mergeHeaders(opts.headers, {
        authorization: `Basic ${base64EncodedCreds}`
      });
    }
  }
  /**
   * Applies client authentication on the request's body if request-body
   * client authentication is selected.
   *
   * @param opts The GaxiosOptions whose headers or data are to be modified
   *   depending on the client authentication mechanism to be used.
   */
  injectAuthenticatedRequestBody(opts) {
    var _a2;
    if (((_a2 = __privateGet(this, _clientAuthentication)) == null ? void 0 : _a2.confidentialClientType) === "request-body") {
      const method = (opts.method || "GET").toUpperCase();
      if (!METHODS_SUPPORTING_REQUEST_BODY.includes(method)) {
        throw new Error(`${method} HTTP method does not support ${__privateGet(this, _clientAuthentication).confidentialClientType} client authentication`);
      }
      const headers = new Headers(opts.headers);
      const contentType = headers.get("content-type");
      if ((contentType == null ? void 0 : contentType.startsWith("application/x-www-form-urlencoded")) || opts.data instanceof URLSearchParams) {
        const data = new URLSearchParams(opts.data ?? "");
        data.append("client_id", __privateGet(this, _clientAuthentication).clientId);
        data.append("client_secret", __privateGet(this, _clientAuthentication).clientSecret || "");
        opts.data = data;
      } else if (contentType == null ? void 0 : contentType.startsWith("application/json")) {
        opts.data = opts.data || {};
        Object.assign(opts.data, {
          client_id: __privateGet(this, _clientAuthentication).clientId,
          client_secret: __privateGet(this, _clientAuthentication).clientSecret || ""
        });
      } else {
        throw new Error(`${contentType} content-types are not supported with ${__privateGet(this, _clientAuthentication).confidentialClientType} client authentication`);
      }
    }
  }
  /**
   * Retry config for Auth-related requests.
   *
   * @remarks
   *
   * This is not a part of the default {@link AuthClient.transporter transporter/gaxios}
   * config as some downstream APIs would prefer if customers explicitly enable retries,
   * such as GCS.
   */
  static get RETRY_CONFIG() {
    return {
      retry: true,
      retryConfig: {
        httpMethodsToRetry: ["GET", "PUT", "POST", "HEAD", "OPTIONS", "DELETE"]
      }
    };
  }
}
_crypto = new WeakMap();
_clientAuthentication = new WeakMap();
oauth2common.OAuthClientAuthHandler = OAuthClientAuthHandler;
function getErrorFromOAuthErrorResponse(resp, err) {
  const errorCode = resp.error;
  const errorDescription = resp.error_description;
  const errorUri = resp.error_uri;
  let message = `Error code ${errorCode}`;
  if (typeof errorDescription !== "undefined") {
    message += `: ${errorDescription}`;
  }
  if (typeof errorUri !== "undefined") {
    message += ` - ${errorUri}`;
  }
  const newError = new Error(message);
  if (err) {
    const keys = Object.keys(err);
    if (err.stack) {
      keys.push("stack");
    }
    keys.forEach((key) => {
      if (key !== "message") {
        Object.defineProperty(newError, key, {
          value: err[key],
          writable: false,
          enumerable: true
        });
      }
    });
  }
  return newError;
}
Object.defineProperty(stscredentials, "__esModule", { value: true });
stscredentials.StsCredentials = void 0;
const gaxios_1$4 = src$3;
const authclient_1$4 = authclient;
const oauth2common_1$1 = oauth2common;
const util_1$3 = util$4;
const _StsCredentials = class _StsCredentials extends oauth2common_1$1.OAuthClientAuthHandler {
  /**
   * Initializes an STS credentials instance.
   *
   * @param options The STS credentials instance options. Passing an `tokenExchangeEndpoint` directly is **@DEPRECATED**.
   * @param clientAuthentication **@DEPRECATED**. Provide a {@link StsCredentialsConstructionOptions `StsCredentialsConstructionOptions`} object in the first parameter instead.
   */
  constructor(options = {
    tokenExchangeEndpoint: ""
  }, clientAuthentication) {
    if (typeof options !== "object" || options instanceof URL) {
      options = {
        tokenExchangeEndpoint: options,
        clientAuthentication
      };
    }
    super(options);
    __privateAdd(this, _tokenExchangeEndpoint);
    __privateSet(this, _tokenExchangeEndpoint, options.tokenExchangeEndpoint);
  }
  /**
   * Exchanges the provided token for another type of token based on the
   * rfc8693 spec.
   * @param stsCredentialsOptions The token exchange options used to populate
   *   the token exchange request.
   * @param additionalHeaders Optional additional headers to pass along the
   *   request.
   * @param options Optional additional GCP-specific non-spec defined options
   *   to send with the request.
   *   Example: `&options=${encodeUriComponent(JSON.stringified(options))}`
   * @return A promise that resolves with the token exchange response containing
   *   the requested token and its expiration time.
   */
  async exchangeToken(stsCredentialsOptions, headers, options) {
    var _a2, _b, _c;
    const values = {
      grant_type: stsCredentialsOptions.grantType,
      resource: stsCredentialsOptions.resource,
      audience: stsCredentialsOptions.audience,
      scope: (_a2 = stsCredentialsOptions.scope) == null ? void 0 : _a2.join(" "),
      requested_token_type: stsCredentialsOptions.requestedTokenType,
      subject_token: stsCredentialsOptions.subjectToken,
      subject_token_type: stsCredentialsOptions.subjectTokenType,
      actor_token: (_b = stsCredentialsOptions.actingParty) == null ? void 0 : _b.actorToken,
      actor_token_type: (_c = stsCredentialsOptions.actingParty) == null ? void 0 : _c.actorTokenType,
      // Non-standard GCP-specific options.
      options: options && JSON.stringify(options)
    };
    const opts = {
      ..._StsCredentials.RETRY_CONFIG,
      url: __privateGet(this, _tokenExchangeEndpoint).toString(),
      method: "POST",
      headers,
      data: new URLSearchParams((0, util_1$3.removeUndefinedValuesInObject)(values))
    };
    authclient_1$4.AuthClient.setMethodName(opts, "exchangeToken");
    this.applyClientAuthenticationOptions(opts);
    try {
      const response = await this.transporter.request(opts);
      const stsSuccessfulResponse = response.data;
      stsSuccessfulResponse.res = response;
      return stsSuccessfulResponse;
    } catch (error) {
      if (error instanceof gaxios_1$4.GaxiosError && error.response) {
        throw (0, oauth2common_1$1.getErrorFromOAuthErrorResponse)(
          error.response.data,
          // Preserve other fields from the original error.
          error
        );
      }
      throw error;
    }
  }
};
_tokenExchangeEndpoint = new WeakMap();
let StsCredentials = _StsCredentials;
stscredentials.StsCredentials = StsCredentials;
(function(exports$12) {
  var _pendingAccessToken, _BaseExternalAccountClient_instances, internalRefreshAccessTokenAsync_fn;
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.BaseExternalAccountClient = exports$12.CLOUD_RESOURCE_MANAGER = exports$12.EXTERNAL_ACCOUNT_TYPE = exports$12.EXPIRATION_TIME_OFFSET = void 0;
  const gaxios_12 = src$3;
  const stream2 = require$$3;
  const authclient_12 = authclient;
  const sts = stscredentials;
  const util_12 = util$4;
  const shared_cjs_1 = shared;
  const STS_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
  const STS_REQUEST_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
  const DEFAULT_OAUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
  const DEFAULT_TOKEN_LIFESPAN = 3600;
  exports$12.EXPIRATION_TIME_OFFSET = 5 * 60 * 1e3;
  exports$12.EXTERNAL_ACCOUNT_TYPE = "external_account";
  exports$12.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
  const WORKFORCE_AUDIENCE_PATTERN = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+";
  const DEFAULT_TOKEN_URL2 = "https://sts.{universeDomain}/v1/token";
  const _BaseExternalAccountClient = class _BaseExternalAccountClient extends authclient_12.AuthClient {
    /**
     * Instantiate a BaseExternalAccountClient instance using the provided JSON
     * object loaded from an external account credentials file.
     * @param options The external account options object typically loaded
     *   from the external account JSON credential file. The camelCased options
     *   are aliases for the snake_cased options.
     */
    constructor(options) {
      super(options);
      __privateAdd(this, _BaseExternalAccountClient_instances);
      /**
       * OAuth scopes for the GCP access token to use. When not provided,
       * the default https://www.googleapis.com/auth/cloud-platform is
       * used.
       */
      __publicField(this, "scopes");
      __publicField(this, "projectNumber");
      __publicField(this, "audience");
      __publicField(this, "subjectTokenType");
      __publicField(this, "stsCredential");
      __publicField(this, "clientAuth");
      __publicField(this, "credentialSourceType");
      __publicField(this, "cachedAccessToken");
      __publicField(this, "serviceAccountImpersonationUrl");
      __publicField(this, "serviceAccountImpersonationLifetime");
      __publicField(this, "workforcePoolUserProject");
      __publicField(this, "configLifetimeRequested");
      __publicField(this, "tokenUrl");
      /**
       * @example
       * ```ts
       * new URL('https://cloudresourcemanager.googleapis.com/v1/projects/');
       * ```
       */
      __publicField(this, "cloudResourceManagerURL");
      __publicField(this, "supplierContext");
      /**
       * A pending access token request. Used for concurrent calls.
       */
      __privateAdd(this, _pendingAccessToken, null);
      const opts = (0, util_12.originalOrCamelOptions)(options);
      const type = opts.get("type");
      if (type && type !== exports$12.EXTERNAL_ACCOUNT_TYPE) {
        throw new Error(`Expected "${exports$12.EXTERNAL_ACCOUNT_TYPE}" type but received "${options.type}"`);
      }
      const clientId = opts.get("client_id");
      const clientSecret = opts.get("client_secret");
      this.tokenUrl = opts.get("token_url") ?? DEFAULT_TOKEN_URL2.replace("{universeDomain}", this.universeDomain);
      const subjectTokenType = opts.get("subject_token_type");
      const workforcePoolUserProject = opts.get("workforce_pool_user_project");
      const serviceAccountImpersonationUrl = opts.get("service_account_impersonation_url");
      const serviceAccountImpersonation = opts.get("service_account_impersonation");
      const serviceAccountImpersonationLifetime = (0, util_12.originalOrCamelOptions)(serviceAccountImpersonation).get("token_lifetime_seconds");
      this.cloudResourceManagerURL = new URL(opts.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`);
      if (clientId) {
        this.clientAuth = {
          confidentialClientType: "basic",
          clientId,
          clientSecret
        };
      }
      this.stsCredential = new sts.StsCredentials({
        tokenExchangeEndpoint: this.tokenUrl,
        clientAuthentication: this.clientAuth
      });
      this.scopes = opts.get("scopes") || [DEFAULT_OAUTH_SCOPE];
      this.cachedAccessToken = null;
      this.audience = opts.get("audience");
      this.subjectTokenType = subjectTokenType;
      this.workforcePoolUserProject = workforcePoolUserProject;
      const workforceAudiencePattern = new RegExp(WORKFORCE_AUDIENCE_PATTERN);
      if (this.workforcePoolUserProject && !this.audience.match(workforceAudiencePattern)) {
        throw new Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
      }
      this.serviceAccountImpersonationUrl = serviceAccountImpersonationUrl;
      this.serviceAccountImpersonationLifetime = serviceAccountImpersonationLifetime;
      if (this.serviceAccountImpersonationLifetime) {
        this.configLifetimeRequested = true;
      } else {
        this.configLifetimeRequested = false;
        this.serviceAccountImpersonationLifetime = DEFAULT_TOKEN_LIFESPAN;
      }
      this.projectNumber = this.getProjectNumber(this.audience);
      this.supplierContext = {
        audience: this.audience,
        subjectTokenType: this.subjectTokenType,
        transporter: this.transporter
      };
    }
    /** The service account email to be impersonated, if available. */
    getServiceAccountEmail() {
      var _a2;
      if (this.serviceAccountImpersonationUrl) {
        if (this.serviceAccountImpersonationUrl.length > 256) {
          throw new RangeError(`URL is too long: ${this.serviceAccountImpersonationUrl}`);
        }
        const re = /serviceAccounts\/(?<email>[^:]+):generateAccessToken$/;
        const result = re.exec(this.serviceAccountImpersonationUrl);
        return ((_a2 = result == null ? void 0 : result.groups) == null ? void 0 : _a2.email) || null;
      }
      return null;
    }
    /**
     * Provides a mechanism to inject GCP access tokens directly.
     * When the provided credential expires, a new credential, using the
     * external account options, is retrieved.
     * @param credentials The Credentials object to set on the current client.
     */
    setCredentials(credentials) {
      super.setCredentials(credentials);
      this.cachedAccessToken = credentials;
    }
    /**
     * @return A promise that resolves with the current GCP access token
     *   response. If the current credential is expired, a new one is retrieved.
     */
    async getAccessToken() {
      if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) {
        await this.refreshAccessTokenAsync();
      }
      return {
        token: this.cachedAccessToken.access_token,
        res: this.cachedAccessToken.res
      };
    }
    /**
     * The main authentication interface. It takes an optional url which when
     * present is the endpoint being accessed, and returns a Promise which
     * resolves with authorization header fields.
     *
     * The result has the form:
     * { authorization: 'Bearer <access_token_value>' }
     */
    async getRequestHeaders() {
      const accessTokenResponse = await this.getAccessToken();
      const headers = new Headers({
        authorization: `Bearer ${accessTokenResponse.token}`
      });
      return this.addSharedMetadataHeaders(headers);
    }
    request(opts, callback) {
      if (callback) {
        this.requestAsync(opts).then((r) => callback(null, r), (e) => {
          return callback(e, e.response);
        });
      } else {
        return this.requestAsync(opts);
      }
    }
    /**
     * @return A promise that resolves with the project ID corresponding to the
     *   current workload identity pool or current workforce pool if
     *   determinable. For workforce pool credential, it returns the project ID
     *   corresponding to the workforcePoolUserProject.
     *   This is introduced to match the current pattern of using the Auth
     *   library:
     *   const projectId = await auth.getProjectId();
     *   const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
     *   const res = await client.request({ url });
     *   The resource may not have permission
     *   (resourcemanager.projects.get) to call this API or the required
     *   scopes may not be selected:
     *   https://cloud.google.com/resource-manager/reference/rest/v1/projects/get#authorization-scopes
     */
    async getProjectId() {
      const projectNumber = this.projectNumber || this.workforcePoolUserProject;
      if (this.projectId) {
        return this.projectId;
      } else if (projectNumber) {
        const headers = await this.getRequestHeaders();
        const opts = {
          ..._BaseExternalAccountClient.RETRY_CONFIG,
          headers,
          url: `${this.cloudResourceManagerURL.toString()}${projectNumber}`
        };
        authclient_12.AuthClient.setMethodName(opts, "getProjectId");
        const response = await this.transporter.request(opts);
        this.projectId = response.data.projectId;
        return this.projectId;
      }
      return null;
    }
    /**
     * Authenticates the provided HTTP request, processes it and resolves with the
     * returned response.
     * @param opts The HTTP request options.
     * @param reAuthRetried Whether the current attempt is a retry after a failed attempt due to an auth failure.
     * @return A promise that resolves with the successful response.
     */
    async requestAsync(opts, reAuthRetried = false) {
      let response;
      try {
        const requestHeaders = await this.getRequestHeaders();
        opts.headers = gaxios_12.Gaxios.mergeHeaders(opts.headers);
        this.addUserProjectAndAuthHeaders(opts.headers, requestHeaders);
        response = await this.transporter.request(opts);
      } catch (e) {
        const res = e.response;
        if (res) {
          const statusCode = res.status;
          const isReadableStream = res.config.data instanceof stream2.Readable;
          const isAuthErr = statusCode === 401 || statusCode === 403;
          if (!reAuthRetried && isAuthErr && !isReadableStream && this.forceRefreshOnFailure) {
            await this.refreshAccessTokenAsync();
            return await this.requestAsync(opts, true);
          }
        }
        throw e;
      }
      return response;
    }
    /**
     * Forces token refresh, even if unexpired tokens are currently cached.
     * External credentials are exchanged for GCP access tokens via the token
     * exchange endpoint and other settings provided in the client options
     * object.
     * If the service_account_impersonation_url is provided, an additional
     * step to exchange the external account GCP access token for a service
     * account impersonated token is performed.
     * @return A promise that resolves with the fresh GCP access tokens.
     */
    async refreshAccessTokenAsync() {
      __privateSet(this, _pendingAccessToken, __privateGet(this, _pendingAccessToken) || __privateMethod(this, _BaseExternalAccountClient_instances, internalRefreshAccessTokenAsync_fn).call(this));
      try {
        return await __privateGet(this, _pendingAccessToken);
      } finally {
        __privateSet(this, _pendingAccessToken, null);
      }
    }
    /**
     * Returns the workload identity pool project number if it is determinable
     * from the audience resource name.
     * @param audience The STS audience used to determine the project number.
     * @return The project number associated with the workload identity pool, if
     *   this can be determined from the STS audience field. Otherwise, null is
     *   returned.
     */
    getProjectNumber(audience) {
      const match = audience.match(/\/projects\/([^/]+)/);
      if (!match) {
        return null;
      }
      return match[1];
    }
    /**
     * Exchanges an external account GCP access token for a service
     * account impersonated access token using iamcredentials
     * GenerateAccessToken API.
     * @param token The access token to exchange for a service account access
     *   token.
     * @return A promise that resolves with the service account impersonated
     *   credentials response.
     */
    async getImpersonatedAccessToken(token) {
      const opts = {
        ..._BaseExternalAccountClient.RETRY_CONFIG,
        url: this.serviceAccountImpersonationUrl,
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        data: {
          scope: this.getScopesArray(),
          lifetime: this.serviceAccountImpersonationLifetime + "s"
        }
      };
      authclient_12.AuthClient.setMethodName(opts, "getImpersonatedAccessToken");
      const response = await this.transporter.request(opts);
      const successResponse = response.data;
      return {
        access_token: successResponse.accessToken,
        // Convert from ISO format to timestamp.
        expiry_date: new Date(successResponse.expireTime).getTime(),
        res: response
      };
    }
    /**
     * Returns whether the provided credentials are expired or not.
     * If there is no expiry time, assumes the token is not expired or expiring.
     * @param accessToken The credentials to check for expiration.
     * @return Whether the credentials are expired or not.
     */
    isExpired(accessToken) {
      const now = (/* @__PURE__ */ new Date()).getTime();
      return accessToken.expiry_date ? now >= accessToken.expiry_date - this.eagerRefreshThresholdMillis : false;
    }
    /**
     * @return The list of scopes for the requested GCP access token.
     */
    getScopesArray() {
      if (typeof this.scopes === "string") {
        return [this.scopes];
      }
      return this.scopes || [DEFAULT_OAUTH_SCOPE];
    }
    getMetricsHeaderValue() {
      const nodeVersion = process.version.replace(/^v/, "");
      const saImpersonation = this.serviceAccountImpersonationUrl !== void 0;
      const credentialSourceType = this.credentialSourceType ? this.credentialSourceType : "unknown";
      return `gl-node/${nodeVersion} auth/${shared_cjs_1.pkg.version} google-byoid-sdk source/${credentialSourceType} sa-impersonation/${saImpersonation} config-lifetime/${this.configLifetimeRequested}`;
    }
    getTokenUrl() {
      return this.tokenUrl;
    }
  };
  _pendingAccessToken = new WeakMap();
  _BaseExternalAccountClient_instances = new WeakSet();
  internalRefreshAccessTokenAsync_fn = async function() {
    const subjectToken = await this.retrieveSubjectToken();
    const stsCredentialsOptions = {
      grantType: STS_GRANT_TYPE,
      audience: this.audience,
      requestedTokenType: STS_REQUEST_TOKEN_TYPE,
      subjectToken,
      subjectTokenType: this.subjectTokenType,
      // generateAccessToken requires the provided access token to have
      // scopes:
      // https://www.googleapis.com/auth/iam or
      // https://www.googleapis.com/auth/cloud-platform
      // The new service account access token scopes will match the user
      // provided ones.
      scope: this.serviceAccountImpersonationUrl ? [DEFAULT_OAUTH_SCOPE] : this.getScopesArray()
    };
    const additionalOptions = !this.clientAuth && this.workforcePoolUserProject ? { userProject: this.workforcePoolUserProject } : void 0;
    const additionalHeaders = new Headers({
      "x-goog-api-client": this.getMetricsHeaderValue()
    });
    const stsResponse = await this.stsCredential.exchangeToken(stsCredentialsOptions, additionalHeaders, additionalOptions);
    if (this.serviceAccountImpersonationUrl) {
      this.cachedAccessToken = await this.getImpersonatedAccessToken(stsResponse.access_token);
    } else if (stsResponse.expires_in) {
      this.cachedAccessToken = {
        access_token: stsResponse.access_token,
        expiry_date: (/* @__PURE__ */ new Date()).getTime() + stsResponse.expires_in * 1e3,
        res: stsResponse.res
      };
    } else {
      this.cachedAccessToken = {
        access_token: stsResponse.access_token,
        res: stsResponse.res
      };
    }
    this.credentials = {};
    Object.assign(this.credentials, this.cachedAccessToken);
    delete this.credentials.res;
    this.emit("tokens", {
      refresh_token: null,
      expiry_date: this.cachedAccessToken.expiry_date,
      access_token: this.cachedAccessToken.access_token,
      token_type: "Bearer",
      id_token: null
    });
    return this.cachedAccessToken;
  };
  let BaseExternalAccountClient = _BaseExternalAccountClient;
  exports$12.BaseExternalAccountClient = BaseExternalAccountClient;
})(baseexternalclient);
var identitypoolclient = {};
var filesubjecttokensupplier = {};
Object.defineProperty(filesubjecttokensupplier, "__esModule", { value: true });
filesubjecttokensupplier.FileSubjectTokenSupplier = void 0;
const util_1$2 = require$$2;
const fs$1 = fs$4;
const readFile = (0, util_1$2.promisify)(fs$1.readFile ?? (() => {
}));
const realpath = (0, util_1$2.promisify)(fs$1.realpath ?? (() => {
}));
const lstat = (0, util_1$2.promisify)(fs$1.lstat ?? (() => {
}));
class FileSubjectTokenSupplier {
  /**
   * Instantiates a new file based subject token supplier.
   * @param opts The file subject token supplier options to build the supplier
   *   with.
   */
  constructor(opts) {
    __publicField(this, "filePath");
    __publicField(this, "formatType");
    __publicField(this, "subjectTokenFieldName");
    this.filePath = opts.filePath;
    this.formatType = opts.formatType;
    this.subjectTokenFieldName = opts.subjectTokenFieldName;
  }
  /**
   * Returns the subject token stored at the file specified in the constructor.
   * @param context {@link ExternalAccountSupplierContext} from the calling
   *   {@link IdentityPoolClient}, contains the requested audience and subject
   *   token type for the external account identity. Not used.
   */
  async getSubjectToken() {
    let parsedFilePath = this.filePath;
    try {
      parsedFilePath = await realpath(parsedFilePath);
      if (!(await lstat(parsedFilePath)).isFile()) {
        throw new Error();
      }
    } catch (err) {
      if (err instanceof Error) {
        err.message = `The file at ${parsedFilePath} does not exist, or it is not a file. ${err.message}`;
      }
      throw err;
    }
    let subjectToken;
    const rawText = await readFile(parsedFilePath, { encoding: "utf8" });
    if (this.formatType === "text") {
      subjectToken = rawText;
    } else if (this.formatType === "json" && this.subjectTokenFieldName) {
      const json = JSON.parse(rawText);
      subjectToken = json[this.subjectTokenFieldName];
    }
    if (!subjectToken) {
      throw new Error("Unable to parse the subject_token from the credential_source file");
    }
    return subjectToken;
  }
}
filesubjecttokensupplier.FileSubjectTokenSupplier = FileSubjectTokenSupplier;
var urlsubjecttokensupplier = {};
Object.defineProperty(urlsubjecttokensupplier, "__esModule", { value: true });
urlsubjecttokensupplier.UrlSubjectTokenSupplier = void 0;
const authclient_1$3 = authclient;
class UrlSubjectTokenSupplier {
  /**
   * Instantiates a URL subject token supplier.
   * @param opts The URL subject token supplier options to build the supplier with.
   */
  constructor(opts) {
    __publicField(this, "url");
    __publicField(this, "headers");
    __publicField(this, "formatType");
    __publicField(this, "subjectTokenFieldName");
    __publicField(this, "additionalGaxiosOptions");
    this.url = opts.url;
    this.formatType = opts.formatType;
    this.subjectTokenFieldName = opts.subjectTokenFieldName;
    this.headers = opts.headers;
    this.additionalGaxiosOptions = opts.additionalGaxiosOptions;
  }
  /**
   * Sends a GET request to the URL provided in the constructor and resolves
   * with the returned external subject token.
   * @param context {@link ExternalAccountSupplierContext} from the calling
   *   {@link IdentityPoolClient}, contains the requested audience and subject
   *   token type for the external account identity. Not used.
   */
  async getSubjectToken(context) {
    const opts = {
      ...this.additionalGaxiosOptions,
      url: this.url,
      method: "GET",
      headers: this.headers
    };
    authclient_1$3.AuthClient.setMethodName(opts, "getSubjectToken");
    let subjectToken;
    if (this.formatType === "text") {
      const response = await context.transporter.request(opts);
      subjectToken = response.data;
    } else if (this.formatType === "json" && this.subjectTokenFieldName) {
      const response = await context.transporter.request(opts);
      subjectToken = response.data[this.subjectTokenFieldName];
    }
    if (!subjectToken) {
      throw new Error("Unable to parse the subject_token from the credential_source URL");
    }
    return subjectToken;
  }
}
urlsubjecttokensupplier.UrlSubjectTokenSupplier = UrlSubjectTokenSupplier;
var certificatesubjecttokensupplier = {};
(function(exports$12) {
  var _CertificateSubjectTokenSupplier_instances, resolveCertificateConfigFilePath_fn, getCertAndKeyPaths_fn, getKeyAndCert_fn, processChainFromPaths_fn;
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.CertificateSubjectTokenSupplier = exports$12.InvalidConfigurationError = exports$12.CertificateSourceUnavailableError = exports$12.CERTIFICATE_CONFIGURATION_ENV_VARIABLE = void 0;
  const util_12 = util$4;
  const fs2 = fs$4;
  const crypto_12 = require$$0$3;
  const https = require$$1;
  exports$12.CERTIFICATE_CONFIGURATION_ENV_VARIABLE = "GOOGLE_API_CERTIFICATE_CONFIG";
  class CertificateSourceUnavailableError extends Error {
    constructor(message) {
      super(message);
      this.name = "CertificateSourceUnavailableError";
    }
  }
  exports$12.CertificateSourceUnavailableError = CertificateSourceUnavailableError;
  class InvalidConfigurationError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidConfigurationError";
    }
  }
  exports$12.InvalidConfigurationError = InvalidConfigurationError;
  class CertificateSubjectTokenSupplier {
    /**
     * Initializes a new instance of the CertificateSubjectTokenSupplier.
     * @param opts The configuration options for the supplier.
     */
    constructor(opts) {
      __privateAdd(this, _CertificateSubjectTokenSupplier_instances);
      __publicField(this, "certificateConfigPath");
      __publicField(this, "trustChainPath");
      __publicField(this, "cert");
      __publicField(this, "key");
      if (!opts.useDefaultCertificateConfig && !opts.certificateConfigLocation) {
        throw new InvalidConfigurationError("Either `useDefaultCertificateConfig` must be true or a `certificateConfigLocation` must be provided.");
      }
      if (opts.useDefaultCertificateConfig && opts.certificateConfigLocation) {
        throw new InvalidConfigurationError("Both `useDefaultCertificateConfig` and `certificateConfigLocation` cannot be provided.");
      }
      this.trustChainPath = opts.trustChainPath;
      this.certificateConfigPath = opts.certificateConfigLocation ?? "";
    }
    /**
     * Creates an HTTPS agent configured with the client certificate and private key for mTLS.
     * @returns An mTLS-configured https.Agent.
     */
    async createMtlsHttpsAgent() {
      if (!this.key || !this.cert) {
        throw new InvalidConfigurationError("Cannot create mTLS Agent with missing certificate or key");
      }
      return new https.Agent({ key: this.key, cert: this.cert });
    }
    /**
     * Constructs the subject token, which is the base64-encoded certificate chain.
     * @returns A promise that resolves with the subject token.
     */
    async getSubjectToken() {
      this.certificateConfigPath = await __privateMethod(this, _CertificateSubjectTokenSupplier_instances, resolveCertificateConfigFilePath_fn).call(this);
      const { certPath, keyPath } = await __privateMethod(this, _CertificateSubjectTokenSupplier_instances, getCertAndKeyPaths_fn).call(this);
      ({ cert: this.cert, key: this.key } = await __privateMethod(this, _CertificateSubjectTokenSupplier_instances, getKeyAndCert_fn).call(this, certPath, keyPath));
      return await __privateMethod(this, _CertificateSubjectTokenSupplier_instances, processChainFromPaths_fn).call(this, this.cert);
    }
  }
  _CertificateSubjectTokenSupplier_instances = new WeakSet();
  resolveCertificateConfigFilePath_fn = async function() {
    const overridePath = this.certificateConfigPath;
    if (overridePath) {
      if (await (0, util_12.isValidFile)(overridePath)) {
        return overridePath;
      }
      throw new CertificateSourceUnavailableError(`Provided certificate config path is invalid: ${overridePath}`);
    }
    const envPath = process.env[exports$12.CERTIFICATE_CONFIGURATION_ENV_VARIABLE];
    if (envPath) {
      if (await (0, util_12.isValidFile)(envPath)) {
        return envPath;
      }
      throw new CertificateSourceUnavailableError(`Path from environment variable "${exports$12.CERTIFICATE_CONFIGURATION_ENV_VARIABLE}" is invalid: ${envPath}`);
    }
    const wellKnownPath = (0, util_12.getWellKnownCertificateConfigFileLocation)();
    if (await (0, util_12.isValidFile)(wellKnownPath)) {
      return wellKnownPath;
    }
    throw new CertificateSourceUnavailableError(`Could not find certificate configuration file. Searched override path, the "${exports$12.CERTIFICATE_CONFIGURATION_ENV_VARIABLE}" env var, and the gcloud path (${wellKnownPath}).`);
  };
  getCertAndKeyPaths_fn = async function() {
    var _a2, _b, _c, _d;
    const configPath = this.certificateConfigPath;
    let fileContents;
    try {
      fileContents = await fs2.promises.readFile(configPath, "utf8");
    } catch (err) {
      throw new CertificateSourceUnavailableError(`Failed to read certificate config file at: ${configPath}`);
    }
    try {
      const config = JSON.parse(fileContents);
      const certPath = (_b = (_a2 = config == null ? void 0 : config.cert_configs) == null ? void 0 : _a2.workload) == null ? void 0 : _b.cert_path;
      const keyPath = (_d = (_c = config == null ? void 0 : config.cert_configs) == null ? void 0 : _c.workload) == null ? void 0 : _d.key_path;
      if (!certPath || !keyPath) {
        throw new InvalidConfigurationError(`Certificate config file (${configPath}) is missing required "cert_path" or "key_path" in the workload config.`);
      }
      return { certPath, keyPath };
    } catch (e) {
      if (e instanceof InvalidConfigurationError)
        throw e;
      throw new InvalidConfigurationError(`Failed to parse certificate config from ${configPath}: ${e.message}`);
    }
  };
  getKeyAndCert_fn = async function(certPath, keyPath) {
    let cert, key;
    try {
      cert = await fs2.promises.readFile(certPath);
      new crypto_12.X509Certificate(cert);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new CertificateSourceUnavailableError(`Failed to read certificate file at ${certPath}: ${message}`);
    }
    try {
      key = await fs2.promises.readFile(keyPath);
      (0, crypto_12.createPrivateKey)(key);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new CertificateSourceUnavailableError(`Failed to read private key file at ${keyPath}: ${message}`);
    }
    return { cert, key };
  };
  processChainFromPaths_fn = async function(leafCertBuffer) {
    const leafCert = new crypto_12.X509Certificate(leafCertBuffer);
    if (!this.trustChainPath) {
      return JSON.stringify([leafCert.raw.toString("base64")]);
    }
    try {
      const chainPems = await fs2.promises.readFile(this.trustChainPath, "utf8");
      const pemBlocks = chainPems.match(/-----BEGIN CERTIFICATE-----[^-]+-----END CERTIFICATE-----/g) ?? [];
      const chainCerts = pemBlocks.map((pem, index) => {
        try {
          return new crypto_12.X509Certificate(pem);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          throw new InvalidConfigurationError(`Failed to parse certificate at index ${index} in trust chain file ${this.trustChainPath}: ${message}`);
        }
      });
      const leafIndex = chainCerts.findIndex((chainCert) => leafCert.raw.equals(chainCert.raw));
      let finalChain;
      if (leafIndex === -1) {
        finalChain = [leafCert, ...chainCerts];
      } else if (leafIndex === 0) {
        finalChain = chainCerts;
      } else {
        throw new InvalidConfigurationError(`Leaf certificate exists in the trust chain but is not the first entry (found at index ${leafIndex}).`);
      }
      return JSON.stringify(finalChain.map((cert) => cert.raw.toString("base64")));
    } catch (err) {
      if (err instanceof InvalidConfigurationError)
        throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new CertificateSourceUnavailableError(`Failed to process certificate chain from ${this.trustChainPath}: ${message}`);
    }
  };
  exports$12.CertificateSubjectTokenSupplier = CertificateSubjectTokenSupplier;
})(certificatesubjecttokensupplier);
Object.defineProperty(identitypoolclient, "__esModule", { value: true });
identitypoolclient.IdentityPoolClient = void 0;
const baseexternalclient_1$3 = baseexternalclient;
const util_1$1 = util$4;
const filesubjecttokensupplier_1 = filesubjecttokensupplier;
const urlsubjecttokensupplier_1 = urlsubjecttokensupplier;
const certificatesubjecttokensupplier_1 = certificatesubjecttokensupplier;
const stscredentials_1 = stscredentials;
const gaxios_1$3 = src$3;
class IdentityPoolClient extends baseexternalclient_1$3.BaseExternalAccountClient {
  /**
   * Instantiate an IdentityPoolClient instance using the provided JSON
   * object loaded from an external account credentials file.
   * An error is thrown if the credential is not a valid file-sourced or
   * url-sourced credential or a workforce pool user project is provided
   * with a non workforce audience.
   * @param options The external account options object typically loaded
   *   from the external account JSON credential file. The camelCased options
   *   are aliases for the snake_cased options.
   */
  constructor(options) {
    super(options);
    __publicField(this, "subjectTokenSupplier");
    const opts = (0, util_1$1.originalOrCamelOptions)(options);
    const credentialSource = opts.get("credential_source");
    const subjectTokenSupplier = opts.get("subject_token_supplier");
    if (!credentialSource && !subjectTokenSupplier) {
      throw new Error("A credential source or subject token supplier must be specified.");
    }
    if (credentialSource && subjectTokenSupplier) {
      throw new Error("Only one of credential source or subject token supplier can be specified.");
    }
    if (subjectTokenSupplier) {
      this.subjectTokenSupplier = subjectTokenSupplier;
      this.credentialSourceType = "programmatic";
    } else {
      const credentialSourceOpts = (0, util_1$1.originalOrCamelOptions)(credentialSource);
      const formatOpts = (0, util_1$1.originalOrCamelOptions)(credentialSourceOpts.get("format"));
      const formatType = formatOpts.get("type") || "text";
      const formatSubjectTokenFieldName = formatOpts.get("subject_token_field_name");
      if (formatType !== "json" && formatType !== "text") {
        throw new Error(`Invalid credential_source format "${formatType}"`);
      }
      if (formatType === "json" && !formatSubjectTokenFieldName) {
        throw new Error("Missing subject_token_field_name for JSON credential_source format");
      }
      const file = credentialSourceOpts.get("file");
      const url2 = credentialSourceOpts.get("url");
      const certificate = credentialSourceOpts.get("certificate");
      const headers = credentialSourceOpts.get("headers");
      if (file && url2 || url2 && certificate || file && certificate) {
        throw new Error('No valid Identity Pool "credential_source" provided, must be either file, url, or certificate.');
      } else if (file) {
        this.credentialSourceType = "file";
        this.subjectTokenSupplier = new filesubjecttokensupplier_1.FileSubjectTokenSupplier({
          filePath: file,
          formatType,
          subjectTokenFieldName: formatSubjectTokenFieldName
        });
      } else if (url2) {
        this.credentialSourceType = "url";
        this.subjectTokenSupplier = new urlsubjecttokensupplier_1.UrlSubjectTokenSupplier({
          url: url2,
          formatType,
          subjectTokenFieldName: formatSubjectTokenFieldName,
          headers,
          additionalGaxiosOptions: IdentityPoolClient.RETRY_CONFIG
        });
      } else if (certificate) {
        this.credentialSourceType = "certificate";
        const certificateSubjecttokensupplier = new certificatesubjecttokensupplier_1.CertificateSubjectTokenSupplier({
          useDefaultCertificateConfig: certificate.use_default_certificate_config,
          certificateConfigLocation: certificate.certificate_config_location,
          trustChainPath: certificate.trust_chain_path
        });
        this.subjectTokenSupplier = certificateSubjecttokensupplier;
      } else {
        throw new Error('No valid Identity Pool "credential_source" provided, must be either file, url, or certificate.');
      }
    }
  }
  /**
   * Triggered when a external subject token is needed to be exchanged for a GCP
   * access token via GCP STS endpoint. Gets a subject token by calling
   * the configured {@link SubjectTokenSupplier}
   * @return A promise that resolves with the external subject token.
   */
  async retrieveSubjectToken() {
    const subjectToken = await this.subjectTokenSupplier.getSubjectToken(this.supplierContext);
    if (this.subjectTokenSupplier instanceof certificatesubjecttokensupplier_1.CertificateSubjectTokenSupplier) {
      const mtlsAgent = await this.subjectTokenSupplier.createMtlsHttpsAgent();
      this.stsCredential = new stscredentials_1.StsCredentials({
        tokenExchangeEndpoint: this.getTokenUrl(),
        clientAuthentication: this.clientAuth,
        transporter: new gaxios_1$3.Gaxios({ agent: mtlsAgent })
      });
      this.transporter = new gaxios_1$3.Gaxios({
        ...this.transporter.defaults || {},
        agent: mtlsAgent
      });
    }
    return subjectToken;
  }
}
identitypoolclient.IdentityPoolClient = IdentityPoolClient;
var awsclient = {};
var awsrequestsigner = {};
Object.defineProperty(awsrequestsigner, "__esModule", { value: true });
awsrequestsigner.AwsRequestSigner = void 0;
const gaxios_1$2 = src$3;
const crypto_1 = crypto$5;
const AWS_ALGORITHM = "AWS4-HMAC-SHA256";
const AWS_REQUEST_TYPE = "aws4_request";
class AwsRequestSigner {
  /**
   * Instantiates an AWS API request signer used to send authenticated signed
   * requests to AWS APIs based on the AWS Signature Version 4 signing process.
   * This also provides a mechanism to generate the signed request without
   * sending it.
   * @param getCredentials A mechanism to retrieve AWS security credentials
   *   when needed.
   * @param region The AWS region to use.
   */
  constructor(getCredentials, region) {
    __publicField(this, "getCredentials");
    __publicField(this, "region");
    __publicField(this, "crypto");
    this.getCredentials = getCredentials;
    this.region = region;
    this.crypto = (0, crypto_1.createCrypto)();
  }
  /**
   * Generates the signed request for the provided HTTP request for calling
   * an AWS API. This follows the steps described at:
   * https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
   * @param amzOptions The AWS request options that need to be signed.
   * @return A promise that resolves with the GaxiosOptions containing the
   *   signed HTTP request parameters.
   */
  async getRequestOptions(amzOptions) {
    if (!amzOptions.url) {
      throw new RangeError('"url" is required in "amzOptions"');
    }
    const requestPayloadData = typeof amzOptions.data === "object" ? JSON.stringify(amzOptions.data) : amzOptions.data;
    const url2 = amzOptions.url;
    const method = amzOptions.method || "GET";
    const requestPayload = amzOptions.body || requestPayloadData;
    const additionalAmzHeaders = amzOptions.headers;
    const awsSecurityCredentials = await this.getCredentials();
    const uri = new URL(url2);
    if (typeof requestPayload !== "string" && requestPayload !== void 0) {
      throw new TypeError(`'requestPayload' is expected to be a string if provided. Got: ${requestPayload}`);
    }
    const headerMap = await generateAuthenticationHeaderMap({
      crypto: this.crypto,
      host: uri.host,
      canonicalUri: uri.pathname,
      canonicalQuerystring: uri.search.slice(1),
      method,
      region: this.region,
      securityCredentials: awsSecurityCredentials,
      requestPayload,
      additionalAmzHeaders
    });
    const headers = gaxios_1$2.Gaxios.mergeHeaders(
      // Add x-amz-date if available.
      headerMap.amzDate ? { "x-amz-date": headerMap.amzDate } : {},
      {
        authorization: headerMap.authorizationHeader,
        host: uri.host
      },
      additionalAmzHeaders || {}
    );
    if (awsSecurityCredentials.token) {
      gaxios_1$2.Gaxios.mergeHeaders(headers, {
        "x-amz-security-token": awsSecurityCredentials.token
      });
    }
    const awsSignedReq = {
      url: url2,
      method,
      headers
    };
    if (requestPayload !== void 0) {
      awsSignedReq.body = requestPayload;
    }
    return awsSignedReq;
  }
}
awsrequestsigner.AwsRequestSigner = AwsRequestSigner;
async function sign2(crypto2, key, msg) {
  return await crypto2.signWithHmacSha256(key, msg);
}
async function getSigningKey(crypto2, key, dateStamp, region, serviceName) {
  const kDate = await sign2(crypto2, `AWS4${key}`, dateStamp);
  const kRegion = await sign2(crypto2, kDate, region);
  const kService = await sign2(crypto2, kRegion, serviceName);
  const kSigning = await sign2(crypto2, kService, "aws4_request");
  return kSigning;
}
async function generateAuthenticationHeaderMap(options) {
  const additionalAmzHeaders = gaxios_1$2.Gaxios.mergeHeaders(options.additionalAmzHeaders);
  const requestPayload = options.requestPayload || "";
  const serviceName = options.host.split(".")[0];
  const now = /* @__PURE__ */ new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, "");
  const dateStamp = now.toISOString().replace(/[-]/g, "").replace(/T.*/, "");
  if (options.securityCredentials.token) {
    additionalAmzHeaders.set("x-amz-security-token", options.securityCredentials.token);
  }
  const amzHeaders = gaxios_1$2.Gaxios.mergeHeaders(
    {
      host: options.host
    },
    // Previously the date was not fixed with x-amz- and could be provided manually.
    // https://github.com/boto/botocore/blob/879f8440a4e9ace5d3cf145ce8b3d5e5ffb892ef/tests/unit/auth/aws4_testsuite/get-header-value-trim.req
    additionalAmzHeaders.has("date") ? {} : { "x-amz-date": amzDate },
    additionalAmzHeaders
  );
  let canonicalHeaders = "";
  const signedHeadersList = [
    ...amzHeaders.keys()
  ].sort();
  signedHeadersList.forEach((key) => {
    canonicalHeaders += `${key}:${amzHeaders.get(key)}
`;
  });
  const signedHeaders = signedHeadersList.join(";");
  const payloadHash = await options.crypto.sha256DigestHex(requestPayload);
  const canonicalRequest = `${options.method.toUpperCase()}
${options.canonicalUri}
${options.canonicalQuerystring}
${canonicalHeaders}
${signedHeaders}
${payloadHash}`;
  const credentialScope = `${dateStamp}/${options.region}/${serviceName}/${AWS_REQUEST_TYPE}`;
  const stringToSign = `${AWS_ALGORITHM}
${amzDate}
${credentialScope}
` + await options.crypto.sha256DigestHex(canonicalRequest);
  const signingKey = await getSigningKey(options.crypto, options.securityCredentials.secretAccessKey, dateStamp, options.region, serviceName);
  const signature = await sign2(options.crypto, signingKey, stringToSign);
  const authorizationHeader = `${AWS_ALGORITHM} Credential=${options.securityCredentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${(0, crypto_1.fromArrayBufferToHex)(signature)}`;
  return {
    // Do not return x-amz-date if date is available.
    amzDate: additionalAmzHeaders.has("date") ? void 0 : amzDate,
    authorizationHeader,
    canonicalQuerystring: options.canonicalQuerystring
  };
}
var defaultawssecuritycredentialssupplier = {};
Object.defineProperty(defaultawssecuritycredentialssupplier, "__esModule", { value: true });
defaultawssecuritycredentialssupplier.DefaultAwsSecurityCredentialsSupplier = void 0;
const authclient_1$2 = authclient;
class DefaultAwsSecurityCredentialsSupplier {
  /**
   * Instantiates a new DefaultAwsSecurityCredentialsSupplier using information
   * from the credential_source stored in the ADC file.
   * @param opts The default aws security credentials supplier options object to
   *   build the supplier with.
   */
  constructor(opts) {
    __privateAdd(this, _DefaultAwsSecurityCredentialsSupplier_instances);
    __publicField(this, "regionUrl");
    __publicField(this, "securityCredentialsUrl");
    __publicField(this, "imdsV2SessionTokenUrl");
    __publicField(this, "additionalGaxiosOptions");
    this.regionUrl = opts.regionUrl;
    this.securityCredentialsUrl = opts.securityCredentialsUrl;
    this.imdsV2SessionTokenUrl = opts.imdsV2SessionTokenUrl;
    this.additionalGaxiosOptions = opts.additionalGaxiosOptions;
  }
  /**
   * Returns the active AWS region. This first checks to see if the region
   * is available as an environment variable. If it is not, then the supplier
   * will call the region URL.
   * @param context {@link ExternalAccountSupplierContext} from the calling
   *   {@link AwsClient}, contains the requested audience and subject token type
   *   for the external account identity.
   * @return A promise that resolves with the AWS region string.
   */
  async getAwsRegion(context) {
    if (__privateGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, regionFromEnv_get)) {
      return __privateGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, regionFromEnv_get);
    }
    const metadataHeaders = new Headers();
    if (!__privateGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, regionFromEnv_get) && this.imdsV2SessionTokenUrl) {
      metadataHeaders.set("x-aws-ec2-metadata-token", await __privateMethod(this, _DefaultAwsSecurityCredentialsSupplier_instances, getImdsV2SessionToken_fn).call(this, context.transporter));
    }
    if (!this.regionUrl) {
      throw new RangeError('Unable to determine AWS region due to missing "options.credential_source.region_url"');
    }
    const opts = {
      ...this.additionalGaxiosOptions,
      url: this.regionUrl,
      method: "GET",
      headers: metadataHeaders
    };
    authclient_1$2.AuthClient.setMethodName(opts, "getAwsRegion");
    const response = await context.transporter.request(opts);
    return response.data.substr(0, response.data.length - 1);
  }
  /**
   * Returns AWS security credentials. This first checks to see if the credentials
   * is available as environment variables. If it is not, then the supplier
   * will call the security credentials URL.
   * @param context {@link ExternalAccountSupplierContext} from the calling
   *   {@link AwsClient}, contains the requested audience and subject token type
   *   for the external account identity.
   * @return A promise that resolves with the AWS security credentials.
   */
  async getAwsSecurityCredentials(context) {
    if (__privateGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, securityCredentialsFromEnv_get)) {
      return __privateGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, securityCredentialsFromEnv_get);
    }
    const metadataHeaders = new Headers();
    if (this.imdsV2SessionTokenUrl) {
      metadataHeaders.set("x-aws-ec2-metadata-token", await __privateMethod(this, _DefaultAwsSecurityCredentialsSupplier_instances, getImdsV2SessionToken_fn).call(this, context.transporter));
    }
    const roleName = await __privateMethod(this, _DefaultAwsSecurityCredentialsSupplier_instances, getAwsRoleName_fn).call(this, metadataHeaders, context.transporter);
    const awsCreds = await __privateMethod(this, _DefaultAwsSecurityCredentialsSupplier_instances, retrieveAwsSecurityCredentials_fn).call(this, roleName, metadataHeaders, context.transporter);
    return {
      accessKeyId: awsCreds.AccessKeyId,
      secretAccessKey: awsCreds.SecretAccessKey,
      token: awsCreds.Token
    };
  }
}
_DefaultAwsSecurityCredentialsSupplier_instances = new WeakSet();
getImdsV2SessionToken_fn = async function(transporter) {
  const opts = {
    ...this.additionalGaxiosOptions,
    url: this.imdsV2SessionTokenUrl,
    method: "PUT",
    headers: { "x-aws-ec2-metadata-token-ttl-seconds": "300" }
  };
  authclient_1$2.AuthClient.setMethodName(opts, "#getImdsV2SessionToken");
  const response = await transporter.request(opts);
  return response.data;
};
getAwsRoleName_fn = async function(headers, transporter) {
  if (!this.securityCredentialsUrl) {
    throw new Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
  }
  const opts = {
    ...this.additionalGaxiosOptions,
    url: this.securityCredentialsUrl,
    method: "GET",
    headers
  };
  authclient_1$2.AuthClient.setMethodName(opts, "#getAwsRoleName");
  const response = await transporter.request(opts);
  return response.data;
};
retrieveAwsSecurityCredentials_fn = async function(roleName, headers, transporter) {
  const opts = {
    ...this.additionalGaxiosOptions,
    url: `${this.securityCredentialsUrl}/${roleName}`,
    headers
  };
  authclient_1$2.AuthClient.setMethodName(opts, "#retrieveAwsSecurityCredentials");
  const response = await transporter.request(opts);
  return response.data;
};
regionFromEnv_get = function() {
  return process.env["AWS_REGION"] || process.env["AWS_DEFAULT_REGION"] || null;
};
securityCredentialsFromEnv_get = function() {
  if (process.env["AWS_ACCESS_KEY_ID"] && process.env["AWS_SECRET_ACCESS_KEY"]) {
    return {
      accessKeyId: process.env["AWS_ACCESS_KEY_ID"],
      secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
      token: process.env["AWS_SESSION_TOKEN"]
    };
  }
  return null;
};
defaultawssecuritycredentialssupplier.DefaultAwsSecurityCredentialsSupplier = DefaultAwsSecurityCredentialsSupplier;
Object.defineProperty(awsclient, "__esModule", { value: true });
awsclient.AwsClient = void 0;
const awsrequestsigner_1 = awsrequestsigner;
const baseexternalclient_1$2 = baseexternalclient;
const defaultawssecuritycredentialssupplier_1 = defaultawssecuritycredentialssupplier;
const util_1 = util$4;
const gaxios_1$1 = src$3;
const _AwsClient = class _AwsClient extends baseexternalclient_1$2.BaseExternalAccountClient {
  /**
   * Instantiates an AwsClient instance using the provided JSON
   * object loaded from an external account credentials file.
   * An error is thrown if the credential is not a valid AWS credential.
   * @param options The external account options object typically loaded
   *   from the external account JSON credential file.
   */
  constructor(options) {
    super(options);
    __publicField(this, "environmentId");
    __publicField(this, "awsSecurityCredentialsSupplier");
    __publicField(this, "regionalCredVerificationUrl");
    __publicField(this, "awsRequestSigner");
    __publicField(this, "region");
    const opts = (0, util_1.originalOrCamelOptions)(options);
    const credentialSource = opts.get("credential_source");
    const awsSecurityCredentialsSupplier = opts.get("aws_security_credentials_supplier");
    if (!credentialSource && !awsSecurityCredentialsSupplier) {
      throw new Error("A credential source or AWS security credentials supplier must be specified.");
    }
    if (credentialSource && awsSecurityCredentialsSupplier) {
      throw new Error("Only one of credential source or AWS security credentials supplier can be specified.");
    }
    if (awsSecurityCredentialsSupplier) {
      this.awsSecurityCredentialsSupplier = awsSecurityCredentialsSupplier;
      this.regionalCredVerificationUrl = __privateGet(_AwsClient, _DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL);
      this.credentialSourceType = "programmatic";
    } else {
      const credentialSourceOpts = (0, util_1.originalOrCamelOptions)(credentialSource);
      this.environmentId = credentialSourceOpts.get("environment_id");
      const regionUrl = credentialSourceOpts.get("region_url");
      const securityCredentialsUrl = credentialSourceOpts.get("url");
      const imdsV2SessionTokenUrl = credentialSourceOpts.get("imdsv2_session_token_url");
      this.awsSecurityCredentialsSupplier = new defaultawssecuritycredentialssupplier_1.DefaultAwsSecurityCredentialsSupplier({
        regionUrl,
        securityCredentialsUrl,
        imdsV2SessionTokenUrl
      });
      this.regionalCredVerificationUrl = credentialSourceOpts.get("regional_cred_verification_url");
      this.credentialSourceType = "aws";
      this.validateEnvironmentId();
    }
    this.awsRequestSigner = null;
    this.region = "";
  }
  validateEnvironmentId() {
    var _a2;
    const match = (_a2 = this.environmentId) == null ? void 0 : _a2.match(/^(aws)(\d+)$/);
    if (!match || !this.regionalCredVerificationUrl) {
      throw new Error('No valid AWS "credential_source" provided');
    } else if (parseInt(match[2], 10) !== 1) {
      throw new Error(`aws version "${match[2]}" is not supported in the current build.`);
    }
  }
  /**
   * Triggered when an external subject token is needed to be exchanged for a
   * GCP access token via GCP STS endpoint. This will call the
   * {@link AwsSecurityCredentialsSupplier} to retrieve an AWS region and AWS
   * Security Credentials, then use them to create a signed AWS STS request that
   * can be exchanged for a GCP access token.
   * @return A promise that resolves with the external subject token.
   */
  async retrieveSubjectToken() {
    if (!this.awsRequestSigner) {
      this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext);
      this.awsRequestSigner = new awsrequestsigner_1.AwsRequestSigner(async () => {
        return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext);
      }, this.region);
    }
    const options = await this.awsRequestSigner.getRequestOptions({
      ..._AwsClient.RETRY_CONFIG,
      url: this.regionalCredVerificationUrl.replace("{region}", this.region),
      method: "POST"
    });
    const reformattedHeader = [];
    const extendedHeaders = gaxios_1$1.Gaxios.mergeHeaders({
      // The full, canonical resource name of the workload identity pool
      // provider, with or without the HTTPS prefix.
      // Including this header as part of the signature is recommended to
      // ensure data integrity.
      "x-goog-cloud-target-resource": this.audience
    }, options.headers);
    extendedHeaders.forEach((value, key) => reformattedHeader.push({ key, value }));
    return encodeURIComponent(JSON.stringify({
      url: options.url,
      method: options.method,
      headers: reformattedHeader
    }));
  }
};
_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL = new WeakMap();
__privateAdd(_AwsClient, _DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL, "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15");
/**
 * @deprecated AWS client no validates the EC2 metadata address.
 **/
__publicField(_AwsClient, "AWS_EC2_METADATA_IPV4_ADDRESS", "169.254.169.254");
/**
 * @deprecated AWS client no validates the EC2 metadata address.
 **/
__publicField(_AwsClient, "AWS_EC2_METADATA_IPV6_ADDRESS", "fd00:ec2::254");
let AwsClient = _AwsClient;
awsclient.AwsClient = AwsClient;
var pluggableAuthClient = {};
var executableResponse = {};
Object.defineProperty(executableResponse, "__esModule", { value: true });
executableResponse.InvalidSubjectTokenError = executableResponse.InvalidMessageFieldError = executableResponse.InvalidCodeFieldError = executableResponse.InvalidTokenTypeFieldError = executableResponse.InvalidExpirationTimeFieldError = executableResponse.InvalidSuccessFieldError = executableResponse.InvalidVersionFieldError = executableResponse.ExecutableResponseError = executableResponse.ExecutableResponse = void 0;
const SAML_SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:saml2";
const OIDC_SUBJECT_TOKEN_TYPE1 = "urn:ietf:params:oauth:token-type:id_token";
const OIDC_SUBJECT_TOKEN_TYPE2 = "urn:ietf:params:oauth:token-type:jwt";
class ExecutableResponse {
  /**
   * Instantiates an ExecutableResponse instance using the provided JSON object
   * from the output of the executable.
   * @param responseJson Response from a 3rd party executable, loaded from a
   * run of the executable or a cached output file.
   */
  constructor(responseJson) {
    /**
     * The version of the Executable response. Only version 1 is currently supported.
     */
    __publicField(this, "version");
    /**
     * Whether the executable ran successfully.
     */
    __publicField(this, "success");
    /**
     * The epoch time for expiration of the token in seconds.
     */
    __publicField(this, "expirationTime");
    /**
     * The type of subject token in the response, currently supported values are:
     * urn:ietf:params:oauth:token-type:saml2
     * urn:ietf:params:oauth:token-type:id_token
     * urn:ietf:params:oauth:token-type:jwt
     */
    __publicField(this, "tokenType");
    /**
     * The error code from the executable.
     */
    __publicField(this, "errorCode");
    /**
     * The error message from the executable.
     */
    __publicField(this, "errorMessage");
    /**
     * The subject token from the executable, format depends on tokenType.
     */
    __publicField(this, "subjectToken");
    if (!responseJson.version) {
      throw new InvalidVersionFieldError("Executable response must contain a 'version' field.");
    }
    if (responseJson.success === void 0) {
      throw new InvalidSuccessFieldError("Executable response must contain a 'success' field.");
    }
    this.version = responseJson.version;
    this.success = responseJson.success;
    if (this.success) {
      this.expirationTime = responseJson.expiration_time;
      this.tokenType = responseJson.token_type;
      if (this.tokenType !== SAML_SUBJECT_TOKEN_TYPE && this.tokenType !== OIDC_SUBJECT_TOKEN_TYPE1 && this.tokenType !== OIDC_SUBJECT_TOKEN_TYPE2) {
        throw new InvalidTokenTypeFieldError(`Executable response must contain a 'token_type' field when successful and it must be one of ${OIDC_SUBJECT_TOKEN_TYPE1}, ${OIDC_SUBJECT_TOKEN_TYPE2}, or ${SAML_SUBJECT_TOKEN_TYPE}.`);
      }
      if (this.tokenType === SAML_SUBJECT_TOKEN_TYPE) {
        if (!responseJson.saml_response) {
          throw new InvalidSubjectTokenError(`Executable response must contain a 'saml_response' field when token_type=${SAML_SUBJECT_TOKEN_TYPE}.`);
        }
        this.subjectToken = responseJson.saml_response;
      } else {
        if (!responseJson.id_token) {
          throw new InvalidSubjectTokenError(`Executable response must contain a 'id_token' field when token_type=${OIDC_SUBJECT_TOKEN_TYPE1} or ${OIDC_SUBJECT_TOKEN_TYPE2}.`);
        }
        this.subjectToken = responseJson.id_token;
      }
    } else {
      if (!responseJson.code) {
        throw new InvalidCodeFieldError("Executable response must contain a 'code' field when unsuccessful.");
      }
      if (!responseJson.message) {
        throw new InvalidMessageFieldError("Executable response must contain a 'message' field when unsuccessful.");
      }
      this.errorCode = responseJson.code;
      this.errorMessage = responseJson.message;
    }
  }
  /**
   * @return A boolean representing if the response has a valid token. Returns
   * true when the response was successful and the token is not expired.
   */
  isValid() {
    return !this.isExpired() && this.success;
  }
  /**
   * @return A boolean representing if the response is expired. Returns true if the
   * provided timeout has passed.
   */
  isExpired() {
    return this.expirationTime !== void 0 && this.expirationTime < Math.round(Date.now() / 1e3);
  }
}
executableResponse.ExecutableResponse = ExecutableResponse;
class ExecutableResponseError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
executableResponse.ExecutableResponseError = ExecutableResponseError;
class InvalidVersionFieldError extends ExecutableResponseError {
}
executableResponse.InvalidVersionFieldError = InvalidVersionFieldError;
class InvalidSuccessFieldError extends ExecutableResponseError {
}
executableResponse.InvalidSuccessFieldError = InvalidSuccessFieldError;
class InvalidExpirationTimeFieldError extends ExecutableResponseError {
}
executableResponse.InvalidExpirationTimeFieldError = InvalidExpirationTimeFieldError;
class InvalidTokenTypeFieldError extends ExecutableResponseError {
}
executableResponse.InvalidTokenTypeFieldError = InvalidTokenTypeFieldError;
class InvalidCodeFieldError extends ExecutableResponseError {
}
executableResponse.InvalidCodeFieldError = InvalidCodeFieldError;
class InvalidMessageFieldError extends ExecutableResponseError {
}
executableResponse.InvalidMessageFieldError = InvalidMessageFieldError;
class InvalidSubjectTokenError extends ExecutableResponseError {
}
executableResponse.InvalidSubjectTokenError = InvalidSubjectTokenError;
var pluggableAuthHandler = {};
Object.defineProperty(pluggableAuthHandler, "__esModule", { value: true });
pluggableAuthHandler.PluggableAuthHandler = pluggableAuthHandler.ExecutableError = void 0;
const executable_response_1 = executableResponse;
const childProcess = require$$1$4;
const fs = fs$4;
class ExecutableError extends Error {
  constructor(message, code2) {
    super(`The executable failed with exit code: ${code2} and error message: ${message}.`);
    /**
     * The exit code returned by the executable.
     */
    __publicField(this, "code");
    this.code = code2;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
pluggableAuthHandler.ExecutableError = ExecutableError;
class PluggableAuthHandler {
  /**
   * Instantiates a PluggableAuthHandler instance using the provided
   * PluggableAuthHandlerOptions object.
   */
  constructor(options) {
    __publicField(this, "commandComponents");
    __publicField(this, "timeoutMillis");
    __publicField(this, "outputFile");
    if (!options.command) {
      throw new Error("No command provided.");
    }
    this.commandComponents = PluggableAuthHandler.parseCommand(options.command);
    this.timeoutMillis = options.timeoutMillis;
    if (!this.timeoutMillis) {
      throw new Error("No timeoutMillis provided.");
    }
    this.outputFile = options.outputFile;
  }
  /**
   * Calls user provided executable to get a 3rd party subject token and
   * returns the response.
   * @param envMap a Map of additional Environment Variables required for
   *   the executable.
   * @return A promise that resolves with the executable response.
   */
  retrieveResponseFromExecutable(envMap) {
    return new Promise((resolve, reject) => {
      const child = childProcess.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
        env: { ...process.env, ...Object.fromEntries(envMap) }
      });
      let output = "";
      child.stdout.on("data", (data) => {
        output += data;
      });
      child.stderr.on("data", (err) => {
        output += err;
      });
      const timeout = setTimeout(() => {
        child.removeAllListeners();
        child.kill();
        return reject(new Error("The executable failed to finish within the timeout specified."));
      }, this.timeoutMillis);
      child.on("close", (code2) => {
        clearTimeout(timeout);
        if (code2 === 0) {
          try {
            const responseJson = JSON.parse(output);
            const response = new executable_response_1.ExecutableResponse(responseJson);
            return resolve(response);
          } catch (error) {
            if (error instanceof executable_response_1.ExecutableResponseError) {
              return reject(error);
            }
            return reject(new executable_response_1.ExecutableResponseError(`The executable returned an invalid response: ${output}`));
          }
        } else {
          return reject(new ExecutableError(output, code2.toString()));
        }
      });
    });
  }
  /**
   * Checks user provided output file for response from previous run of
   * executable and return the response if it exists, is formatted correctly, and is not expired.
   */
  async retrieveCachedResponse() {
    if (!this.outputFile || this.outputFile.length === 0) {
      return void 0;
    }
    let filePath;
    try {
      filePath = await fs.promises.realpath(this.outputFile);
    } catch {
      return void 0;
    }
    if (!(await fs.promises.lstat(filePath)).isFile()) {
      return void 0;
    }
    const responseString = await fs.promises.readFile(filePath, {
      encoding: "utf8"
    });
    if (responseString === "") {
      return void 0;
    }
    try {
      const responseJson = JSON.parse(responseString);
      const response = new executable_response_1.ExecutableResponse(responseJson);
      if (response.isValid()) {
        return new executable_response_1.ExecutableResponse(responseJson);
      }
      return void 0;
    } catch (error) {
      if (error instanceof executable_response_1.ExecutableResponseError) {
        throw error;
      }
      throw new executable_response_1.ExecutableResponseError(`The output file contained an invalid response: ${responseString}`);
    }
  }
  /**
   * Parses given command string into component array, splitting on spaces unless
   * spaces are between quotation marks.
   */
  static parseCommand(command) {
    const components = command.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!components) {
      throw new Error(`Provided command: "${command}" could not be parsed.`);
    }
    for (let i = 0; i < components.length; i++) {
      if (components[i][0] === '"' && components[i].slice(-1) === '"') {
        components[i] = components[i].slice(1, -1);
      }
    }
    return components;
  }
}
pluggableAuthHandler.PluggableAuthHandler = PluggableAuthHandler;
(function(exports$12) {
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.PluggableAuthClient = exports$12.ExecutableError = void 0;
  const baseexternalclient_12 = baseexternalclient;
  const executable_response_12 = executableResponse;
  const pluggable_auth_handler_1 = pluggableAuthHandler;
  var pluggable_auth_handler_2 = pluggableAuthHandler;
  Object.defineProperty(exports$12, "ExecutableError", { enumerable: true, get: function() {
    return pluggable_auth_handler_2.ExecutableError;
  } });
  const DEFAULT_EXECUTABLE_TIMEOUT_MILLIS = 30 * 1e3;
  const MINIMUM_EXECUTABLE_TIMEOUT_MILLIS = 5 * 1e3;
  const MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS = 120 * 1e3;
  const GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES";
  const MAXIMUM_EXECUTABLE_VERSION = 1;
  class PluggableAuthClient extends baseexternalclient_12.BaseExternalAccountClient {
    /**
     * Instantiates a PluggableAuthClient instance using the provided JSON
     * object loaded from an external account credentials file.
     * An error is thrown if the credential is not a valid pluggable auth credential.
     * @param options The external account options object typically loaded from
     *   the external account JSON credential file.
     */
    constructor(options) {
      super(options);
      /**
       * The command used to retrieve the third party token.
       */
      __publicField(this, "command");
      /**
       * The timeout in milliseconds for running executable,
       * set to default if none provided.
       */
      __publicField(this, "timeoutMillis");
      /**
       * The path to file to check for cached executable response.
       */
      __publicField(this, "outputFile");
      /**
       * Executable and output file handler.
       */
      __publicField(this, "handler");
      if (!options.credential_source.executable) {
        throw new Error('No valid Pluggable Auth "credential_source" provided.');
      }
      this.command = options.credential_source.executable.command;
      if (!this.command) {
        throw new Error('No valid Pluggable Auth "credential_source" provided.');
      }
      if (options.credential_source.executable.timeout_millis === void 0) {
        this.timeoutMillis = DEFAULT_EXECUTABLE_TIMEOUT_MILLIS;
      } else {
        this.timeoutMillis = options.credential_source.executable.timeout_millis;
        if (this.timeoutMillis < MINIMUM_EXECUTABLE_TIMEOUT_MILLIS || this.timeoutMillis > MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS) {
          throw new Error(`Timeout must be between ${MINIMUM_EXECUTABLE_TIMEOUT_MILLIS} and ${MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS} milliseconds.`);
        }
      }
      this.outputFile = options.credential_source.executable.output_file;
      this.handler = new pluggable_auth_handler_1.PluggableAuthHandler({
        command: this.command,
        timeoutMillis: this.timeoutMillis,
        outputFile: this.outputFile
      });
      this.credentialSourceType = "executable";
    }
    /**
     * Triggered when an external subject token is needed to be exchanged for a
     * GCP access token via GCP STS endpoint.
     * This uses the `options.credential_source` object to figure out how
     * to retrieve the token using the current environment. In this case,
     * this calls a user provided executable which returns the subject token.
     * The logic is summarized as:
     * 1. Validated that the executable is allowed to run. The
     *    GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment must be set to
     *    1 for security reasons.
     * 2. If an output file is specified by the user, check the file location
     *    for a response. If the file exists and contains a valid response,
     *    return the subject token from the file.
     * 3. Call the provided executable and return response.
     * @return A promise that resolves with the external subject token.
     */
    async retrieveSubjectToken() {
      if (process.env[GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES] !== "1") {
        throw new Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
      }
      let executableResponse2 = void 0;
      if (this.outputFile) {
        executableResponse2 = await this.handler.retrieveCachedResponse();
      }
      if (!executableResponse2) {
        const envMap = /* @__PURE__ */ new Map();
        envMap.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience);
        envMap.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType);
        envMap.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0");
        if (this.outputFile) {
          envMap.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
        }
        const serviceAccountEmail = this.getServiceAccountEmail();
        if (serviceAccountEmail) {
          envMap.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", serviceAccountEmail);
        }
        executableResponse2 = await this.handler.retrieveResponseFromExecutable(envMap);
      }
      if (executableResponse2.version > MAXIMUM_EXECUTABLE_VERSION) {
        throw new Error(`Version of executable is not currently supported, maximum supported version is ${MAXIMUM_EXECUTABLE_VERSION}.`);
      }
      if (!executableResponse2.success) {
        throw new pluggable_auth_handler_1.ExecutableError(executableResponse2.errorMessage, executableResponse2.errorCode);
      }
      if (this.outputFile) {
        if (!executableResponse2.expirationTime) {
          throw new executable_response_12.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.");
        }
      }
      if (executableResponse2.isExpired()) {
        throw new Error("Executable response is expired.");
      }
      return executableResponse2.subjectToken;
    }
  }
  exports$12.PluggableAuthClient = PluggableAuthClient;
})(pluggableAuthClient);
Object.defineProperty(externalclient, "__esModule", { value: true });
externalclient.ExternalAccountClient = void 0;
const baseexternalclient_1$1 = baseexternalclient;
const identitypoolclient_1 = identitypoolclient;
const awsclient_1 = awsclient;
const pluggable_auth_client_1 = pluggableAuthClient;
class ExternalAccountClient {
  constructor() {
    throw new Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()");
  }
  /**
   * This static method will instantiate the
   * corresponding type of external account credential depending on the
   * underlying credential source.
   *
   * **IMPORTANT**: This method does not validate the credential configuration.
   * A security risk occurs when a credential configuration configured with
   * malicious URLs is used. When the credential configuration is accepted from
   * an untrusted source, you should validate it before using it with this
   * method. For more details, see
   * https://cloud.google.com/docs/authentication/external/externally-sourced-credentials.
   *
   * @param options The external account options object typically loaded
   *   from the external account JSON credential file.
   * @return A BaseExternalAccountClient instance or null if the options
   *   provided do not correspond to an external account credential.
   */
  static fromJSON(options) {
    var _a2, _b;
    if (options && options.type === baseexternalclient_1$1.EXTERNAL_ACCOUNT_TYPE) {
      if ((_a2 = options.credential_source) == null ? void 0 : _a2.environment_id) {
        return new awsclient_1.AwsClient(options);
      } else if ((_b = options.credential_source) == null ? void 0 : _b.executable) {
        return new pluggable_auth_client_1.PluggableAuthClient(options);
      } else {
        return new identitypoolclient_1.IdentityPoolClient(options);
      }
    } else {
      return null;
    }
  }
}
externalclient.ExternalAccountClient = ExternalAccountClient;
var externalAccountAuthorizedUserClient = {};
Object.defineProperty(externalAccountAuthorizedUserClient, "__esModule", { value: true });
externalAccountAuthorizedUserClient.ExternalAccountAuthorizedUserClient = externalAccountAuthorizedUserClient.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
const authclient_1$1 = authclient;
const oauth2common_1 = oauth2common;
const gaxios_1 = src$3;
const stream = require$$3;
const baseexternalclient_1 = baseexternalclient;
externalAccountAuthorizedUserClient.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
const DEFAULT_TOKEN_URL = "https://sts.{universeDomain}/v1/oauthtoken";
const _ExternalAccountAuthorizedUserHandler = class _ExternalAccountAuthorizedUserHandler extends oauth2common_1.OAuthClientAuthHandler {
  /**
   * Initializes an ExternalAccountAuthorizedUserHandler instance.
   * @param url The URL of the token refresh endpoint.
   * @param transporter The transporter to use for the refresh request.
   * @param clientAuthentication The client authentication credentials to use
   *   for the refresh request.
   */
  constructor(options) {
    super(options);
    __privateAdd(this, _tokenRefreshEndpoint);
    __privateSet(this, _tokenRefreshEndpoint, options.tokenRefreshEndpoint);
  }
  /**
   * Requests a new access token from the token_url endpoint using the provided
   *   refresh token.
   * @param refreshToken The refresh token to use to generate a new access token.
   * @param additionalHeaders Optional additional headers to pass along the
   *   request.
   * @return A promise that resolves with the token refresh response containing
   *   the requested access token and its expiration time.
   */
  async refreshToken(refreshToken, headers) {
    const opts = {
      ..._ExternalAccountAuthorizedUserHandler.RETRY_CONFIG,
      url: __privateGet(this, _tokenRefreshEndpoint),
      method: "POST",
      headers,
      data: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    };
    authclient_1$1.AuthClient.setMethodName(opts, "refreshToken");
    this.applyClientAuthenticationOptions(opts);
    try {
      const response = await this.transporter.request(opts);
      const tokenRefreshResponse = response.data;
      tokenRefreshResponse.res = response;
      return tokenRefreshResponse;
    } catch (error) {
      if (error instanceof gaxios_1.GaxiosError && error.response) {
        throw (0, oauth2common_1.getErrorFromOAuthErrorResponse)(
          error.response.data,
          // Preserve other fields from the original error.
          error
        );
      }
      throw error;
    }
  }
};
_tokenRefreshEndpoint = new WeakMap();
let ExternalAccountAuthorizedUserHandler = _ExternalAccountAuthorizedUserHandler;
class ExternalAccountAuthorizedUserClient extends authclient_1$1.AuthClient {
  /**
   * Instantiates an ExternalAccountAuthorizedUserClient instances using the
   * provided JSON object loaded from a credentials files.
   * An error is throws if the credential is not valid.
   * @param options The external account authorized user option object typically
   *   from the external accoutn authorized user JSON credential file.
   */
  constructor(options) {
    super(options);
    __publicField(this, "cachedAccessToken");
    __publicField(this, "externalAccountAuthorizedUserHandler");
    __publicField(this, "refreshToken");
    if (options.universe_domain) {
      this.universeDomain = options.universe_domain;
    }
    this.refreshToken = options.refresh_token;
    const clientAuthentication = {
      confidentialClientType: "basic",
      clientId: options.client_id,
      clientSecret: options.client_secret
    };
    this.externalAccountAuthorizedUserHandler = new ExternalAccountAuthorizedUserHandler({
      tokenRefreshEndpoint: options.token_url ?? DEFAULT_TOKEN_URL.replace("{universeDomain}", this.universeDomain),
      transporter: this.transporter,
      clientAuthentication
    });
    this.cachedAccessToken = null;
    this.quotaProjectId = options.quota_project_id;
    if (typeof (options == null ? void 0 : options.eagerRefreshThresholdMillis) !== "number") {
      this.eagerRefreshThresholdMillis = baseexternalclient_1.EXPIRATION_TIME_OFFSET;
    } else {
      this.eagerRefreshThresholdMillis = options.eagerRefreshThresholdMillis;
    }
    this.forceRefreshOnFailure = !!(options == null ? void 0 : options.forceRefreshOnFailure);
  }
  async getAccessToken() {
    if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) {
      await this.refreshAccessTokenAsync();
    }
    return {
      token: this.cachedAccessToken.access_token,
      res: this.cachedAccessToken.res
    };
  }
  async getRequestHeaders() {
    const accessTokenResponse = await this.getAccessToken();
    const headers = new Headers({
      authorization: `Bearer ${accessTokenResponse.token}`
    });
    return this.addSharedMetadataHeaders(headers);
  }
  request(opts, callback) {
    if (callback) {
      this.requestAsync(opts).then((r) => callback(null, r), (e) => {
        return callback(e, e.response);
      });
    } else {
      return this.requestAsync(opts);
    }
  }
  /**
   * Authenticates the provided HTTP request, processes it and resolves with the
   * returned response.
   * @param opts The HTTP request options.
   * @param reAuthRetried Whether the current attempt is a retry after a failed attempt due to an auth failure.
   * @return A promise that resolves with the successful response.
   */
  async requestAsync(opts, reAuthRetried = false) {
    let response;
    try {
      const requestHeaders = await this.getRequestHeaders();
      opts.headers = gaxios_1.Gaxios.mergeHeaders(opts.headers);
      this.addUserProjectAndAuthHeaders(opts.headers, requestHeaders);
      response = await this.transporter.request(opts);
    } catch (e) {
      const res = e.response;
      if (res) {
        const statusCode = res.status;
        const isReadableStream = res.config.data instanceof stream.Readable;
        const isAuthErr = statusCode === 401 || statusCode === 403;
        if (!reAuthRetried && isAuthErr && !isReadableStream && this.forceRefreshOnFailure) {
          await this.refreshAccessTokenAsync();
          return await this.requestAsync(opts, true);
        }
      }
      throw e;
    }
    return response;
  }
  /**
   * Forces token refresh, even if unexpired tokens are currently cached.
   * @return A promise that resolves with the refreshed credential.
   */
  async refreshAccessTokenAsync() {
    const refreshResponse = await this.externalAccountAuthorizedUserHandler.refreshToken(this.refreshToken);
    this.cachedAccessToken = {
      access_token: refreshResponse.access_token,
      expiry_date: (/* @__PURE__ */ new Date()).getTime() + refreshResponse.expires_in * 1e3,
      res: refreshResponse.res
    };
    if (refreshResponse.refresh_token !== void 0) {
      this.refreshToken = refreshResponse.refresh_token;
    }
    return this.cachedAccessToken;
  }
  /**
   * Returns whether the provided credentials are expired or not.
   * If there is no expiry time, assumes the token is not expired or expiring.
   * @param credentials The credentials to check for expiration.
   * @return Whether the credentials are expired or not.
   */
  isExpired(credentials) {
    const now = (/* @__PURE__ */ new Date()).getTime();
    return credentials.expiry_date ? now >= credentials.expiry_date - this.eagerRefreshThresholdMillis : false;
  }
}
externalAccountAuthorizedUserClient.ExternalAccountAuthorizedUserClient = ExternalAccountAuthorizedUserClient;
(function(exports$12) {
  var _pendingAuthClient, _GoogleAuth_instances, prepareAndCacheClient_fn, determineClient_fn;
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.GoogleAuth = exports$12.GoogleAuthExceptionMessages = void 0;
  const child_process_1 = require$$1$4;
  const fs2 = fs$4;
  const gaxios_12 = src$3;
  const gcpMetadata2 = src$2;
  const os2 = require$$1$1;
  const path2 = path$2;
  const crypto_12 = crypto$5;
  const computeclient_1 = computeclient;
  const idtokenclient_1 = idtokenclient;
  const envDetect_1 = envDetect;
  const jwtclient_1 = jwtclient;
  const refreshclient_1 = refreshclient;
  const impersonated_1 = impersonated;
  const externalclient_1 = externalclient;
  const baseexternalclient_12 = baseexternalclient;
  const authclient_12 = authclient;
  const externalAccountAuthorizedUserClient_1 = externalAccountAuthorizedUserClient;
  const util_12 = util$4;
  exports$12.GoogleAuthExceptionMessages = {
    API_KEY_WITH_CREDENTIALS: "API Keys and Credentials are mutually exclusive authentication methods and cannot be used together.",
    NO_PROJECT_ID_FOUND: "Unable to detect a Project Id in the current environment. \nTo learn more about authentication and Google APIs, visit: \nhttps://cloud.google.com/docs/authentication/getting-started",
    NO_CREDENTIALS_FOUND: "Unable to find credentials in current environment. \nTo learn more about authentication and Google APIs, visit: \nhttps://cloud.google.com/docs/authentication/getting-started",
    NO_ADC_FOUND: "Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.",
    NO_UNIVERSE_DOMAIN_FOUND: "Unable to detect a Universe Domain in the current environment.\nTo learn more about Universe Domain retrieval, visit: \nhttps://cloud.google.com/compute/docs/metadata/predefined-metadata-keys"
  };
  class GoogleAuth {
    /**
     * Configuration is resolved in the following order of precedence:
     * - {@link GoogleAuthOptions.credentials `credentials`}
     * - {@link GoogleAuthOptions.keyFilename `keyFilename`}
     * - {@link GoogleAuthOptions.keyFile `keyFile`}
     *
     * {@link GoogleAuthOptions.clientOptions `clientOptions`} are passed to the
     * {@link AuthClient `AuthClient`s}.
     *
     * @param opts
     */
    constructor(opts = {}) {
      __privateAdd(this, _GoogleAuth_instances);
      /**
       * Caches a value indicating whether the auth layer is running on Google
       * Compute Engine.
       * @private
       */
      __publicField(this, "checkIsGCE");
      __publicField(this, "useJWTAccessWithScope");
      __publicField(this, "defaultServicePath");
      __publicField(this, "_findProjectIdPromise");
      __publicField(this, "_cachedProjectId");
      // To save the contents of the JSON credential file
      __publicField(this, "jsonContent", null);
      __publicField(this, "apiKey");
      __publicField(this, "cachedCredential", null);
      /**
       * A pending {@link AuthClient}. Used for concurrent {@link GoogleAuth.getClient} calls.
       */
      __privateAdd(this, _pendingAuthClient, null);
      /**
       * Scopes populated by the client library by default. We differentiate between
       * these and user defined scopes when deciding whether to use a self-signed JWT.
       */
      __publicField(this, "defaultScopes");
      __publicField(this, "keyFilename");
      __publicField(this, "scopes");
      __publicField(this, "clientOptions", {});
      this._cachedProjectId = opts.projectId || null;
      this.cachedCredential = opts.authClient || null;
      this.keyFilename = opts.keyFilename || opts.keyFile;
      this.scopes = opts.scopes;
      this.clientOptions = opts.clientOptions || {};
      this.jsonContent = opts.credentials || null;
      this.apiKey = opts.apiKey || this.clientOptions.apiKey || null;
      if (this.apiKey && (this.jsonContent || this.clientOptions.credentials)) {
        throw new RangeError(exports$12.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
      }
      if (opts.universeDomain) {
        this.clientOptions.universeDomain = opts.universeDomain;
      }
    }
    // Note:  this properly is only public to satisfy unit tests.
    // https://github.com/Microsoft/TypeScript/issues/5228
    get isGCE() {
      return this.checkIsGCE;
    }
    // GAPIC client libraries should always use self-signed JWTs. The following
    // variables are set on the JWT client in order to indicate the type of library,
    // and sign the JWT with the correct audience and scopes (if not supplied).
    setGapicJWTValues(client) {
      client.defaultServicePath = this.defaultServicePath;
      client.useJWTAccessWithScope = this.useJWTAccessWithScope;
      client.defaultScopes = this.defaultScopes;
    }
    getProjectId(callback) {
      if (callback) {
        this.getProjectIdAsync().then((r) => callback(null, r), callback);
      } else {
        return this.getProjectIdAsync();
      }
    }
    /**
     * A temporary method for internal `getProjectId` usages where `null` is
     * acceptable. In a future major release, `getProjectId` should return `null`
     * (as the `Promise<string | null>` base signature describes) and this private
     * method should be removed.
     *
     * @returns Promise that resolves with project id (or `null`)
     */
    async getProjectIdOptional() {
      try {
        return await this.getProjectId();
      } catch (e) {
        if (e instanceof Error && e.message === exports$12.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) {
          return null;
        } else {
          throw e;
        }
      }
    }
    /**
     * A private method for finding and caching a projectId.
     *
     * Supports environments in order of precedence:
     * - GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variable
     * - GOOGLE_APPLICATION_CREDENTIALS JSON file
     * - Cloud SDK: `gcloud config config-helper --format json`
     * - GCE project ID from metadata server
     *
     * @returns projectId
     */
    async findAndCacheProjectId() {
      let projectId = null;
      projectId || (projectId = await this.getProductionProjectId());
      projectId || (projectId = await this.getFileProjectId());
      projectId || (projectId = await this.getDefaultServiceProjectId());
      projectId || (projectId = await this.getGCEProjectId());
      projectId || (projectId = await this.getExternalAccountClientProjectId());
      if (projectId) {
        this._cachedProjectId = projectId;
        return projectId;
      } else {
        throw new Error(exports$12.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND);
      }
    }
    async getProjectIdAsync() {
      if (this._cachedProjectId) {
        return this._cachedProjectId;
      }
      if (!this._findProjectIdPromise) {
        this._findProjectIdPromise = this.findAndCacheProjectId();
      }
      return this._findProjectIdPromise;
    }
    /**
     * Retrieves a universe domain from the metadata server via
     * {@link gcpMetadata.universe}.
     *
     * @returns a universe domain
     */
    async getUniverseDomainFromMetadataServer() {
      var _a2;
      let universeDomain;
      try {
        universeDomain = await gcpMetadata2.universe("universe-domain");
        universeDomain || (universeDomain = authclient_12.DEFAULT_UNIVERSE);
      } catch (e) {
        if (e && ((_a2 = e == null ? void 0 : e.response) == null ? void 0 : _a2.status) === 404) {
          universeDomain = authclient_12.DEFAULT_UNIVERSE;
        } else {
          throw e;
        }
      }
      return universeDomain;
    }
    /**
     * Retrieves, caches, and returns the universe domain in the following order
     * of precedence:
     * - The universe domain in {@link GoogleAuth.clientOptions}
     * - An existing or ADC {@link AuthClient}'s universe domain
     * - {@link gcpMetadata.universe}, if {@link Compute} client
     *
     * @returns The universe domain
     */
    async getUniverseDomain() {
      let universeDomain = (0, util_12.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
      try {
        universeDomain ?? (universeDomain = (await this.getClient()).universeDomain);
      } catch {
        universeDomain ?? (universeDomain = authclient_12.DEFAULT_UNIVERSE);
      }
      return universeDomain;
    }
    /**
     * @returns Any scopes (user-specified or default scopes specified by the
     *   client library) that need to be set on the current Auth client.
     */
    getAnyScopes() {
      return this.scopes || this.defaultScopes;
    }
    getApplicationDefault(optionsOrCallback = {}, callback) {
      let options;
      if (typeof optionsOrCallback === "function") {
        callback = optionsOrCallback;
      } else {
        options = optionsOrCallback;
      }
      if (callback) {
        this.getApplicationDefaultAsync(options).then((r) => callback(null, r.credential, r.projectId), callback);
      } else {
        return this.getApplicationDefaultAsync(options);
      }
    }
    async getApplicationDefaultAsync(options = {}) {
      if (this.cachedCredential) {
        return await __privateMethod(this, _GoogleAuth_instances, prepareAndCacheClient_fn).call(this, this.cachedCredential, null);
      }
      let credential;
      credential = await this._tryGetApplicationCredentialsFromEnvironmentVariable(options);
      if (credential) {
        if (credential instanceof jwtclient_1.JWT) {
          credential.scopes = this.scopes;
        } else if (credential instanceof baseexternalclient_12.BaseExternalAccountClient) {
          credential.scopes = this.getAnyScopes();
        }
        return await __privateMethod(this, _GoogleAuth_instances, prepareAndCacheClient_fn).call(this, credential);
      }
      credential = await this._tryGetApplicationCredentialsFromWellKnownFile(options);
      if (credential) {
        if (credential instanceof jwtclient_1.JWT) {
          credential.scopes = this.scopes;
        } else if (credential instanceof baseexternalclient_12.BaseExternalAccountClient) {
          credential.scopes = this.getAnyScopes();
        }
        return await __privateMethod(this, _GoogleAuth_instances, prepareAndCacheClient_fn).call(this, credential);
      }
      if (await this._checkIsGCE()) {
        options.scopes = this.getAnyScopes();
        return await __privateMethod(this, _GoogleAuth_instances, prepareAndCacheClient_fn).call(this, new computeclient_1.Compute(options));
      }
      throw new Error(exports$12.GoogleAuthExceptionMessages.NO_ADC_FOUND);
    }
    /**
     * Determines whether the auth layer is running on Google Compute Engine.
     * Checks for GCP Residency, then fallback to checking if metadata server
     * is available.
     *
     * @returns A promise that resolves with the boolean.
     * @api private
     */
    async _checkIsGCE() {
      if (this.checkIsGCE === void 0) {
        this.checkIsGCE = gcpMetadata2.getGCPResidency() || await gcpMetadata2.isAvailable();
      }
      return this.checkIsGCE;
    }
    /**
     * Attempts to load default credentials from the environment variable path..
     * @returns Promise that resolves with the OAuth2Client or null.
     * @api private
     */
    async _tryGetApplicationCredentialsFromEnvironmentVariable(options) {
      const credentialsPath = process.env["GOOGLE_APPLICATION_CREDENTIALS"] || process.env["google_application_credentials"];
      if (!credentialsPath || credentialsPath.length === 0) {
        return null;
      }
      try {
        return this._getApplicationCredentialsFromFilePath(credentialsPath, options);
      } catch (e) {
        if (e instanceof Error) {
          e.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${e.message}`;
        }
        throw e;
      }
    }
    /**
     * Attempts to load default credentials from a well-known file location
     * @return Promise that resolves with the OAuth2Client or null.
     * @api private
     */
    async _tryGetApplicationCredentialsFromWellKnownFile(options) {
      let location = null;
      if (this._isWindows()) {
        location = process.env["APPDATA"];
      } else {
        const home = process.env["HOME"];
        if (home) {
          location = path2.join(home, ".config");
        }
      }
      if (location) {
        location = path2.join(location, "gcloud", "application_default_credentials.json");
        if (!fs2.existsSync(location)) {
          location = null;
        }
      }
      if (!location) {
        return null;
      }
      const client = await this._getApplicationCredentialsFromFilePath(location, options);
      return client;
    }
    /**
     * Attempts to load default credentials from a file at the given path..
     * @param filePath The path to the file to read.
     * @returns Promise that resolves with the OAuth2Client
     * @api private
     */
    async _getApplicationCredentialsFromFilePath(filePath, options = {}) {
      if (!filePath || filePath.length === 0) {
        throw new Error("The file path is invalid.");
      }
      try {
        filePath = fs2.realpathSync(filePath);
        if (!fs2.lstatSync(filePath).isFile()) {
          throw new Error();
        }
      } catch (err) {
        if (err instanceof Error) {
          err.message = `The file at ${filePath} does not exist, or it is not a file. ${err.message}`;
        }
        throw err;
      }
      const readStream = fs2.createReadStream(filePath);
      return this.fromStream(readStream, options);
    }
    /**
     * Create a credentials instance using a given impersonated input options.
     * @param json The impersonated input object.
     * @returns JWT or UserRefresh Client with data
     */
    fromImpersonatedJSON(json) {
      var _a2, _b, _c;
      if (!json) {
        throw new Error("Must pass in a JSON object containing an  impersonated refresh token");
      }
      if (json.type !== impersonated_1.IMPERSONATED_ACCOUNT_TYPE) {
        throw new Error(`The incoming JSON object does not have the "${impersonated_1.IMPERSONATED_ACCOUNT_TYPE}" type`);
      }
      if (!json.source_credentials) {
        throw new Error("The incoming JSON object does not contain a source_credentials field");
      }
      if (!json.service_account_impersonation_url) {
        throw new Error("The incoming JSON object does not contain a service_account_impersonation_url field");
      }
      const sourceClient = this.fromJSON(json.source_credentials);
      if (((_a2 = json.service_account_impersonation_url) == null ? void 0 : _a2.length) > 256) {
        throw new RangeError(`Target principal is too long: ${json.service_account_impersonation_url}`);
      }
      const targetPrincipal = (_c = (_b = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(json.service_account_impersonation_url)) == null ? void 0 : _b.groups) == null ? void 0 : _c.target;
      if (!targetPrincipal) {
        throw new RangeError(`Cannot extract target principal from ${json.service_account_impersonation_url}`);
      }
      const targetScopes = (this.scopes || json.scopes || this.defaultScopes) ?? [];
      return new impersonated_1.Impersonated({
        ...json,
        sourceClient,
        targetPrincipal,
        targetScopes: Array.isArray(targetScopes) ? targetScopes : [targetScopes]
      });
    }
    /**
     * Create a credentials instance using the given input options.
     * This client is not cached.
     *
     * **Important**: If you accept a credential configuration (credential JSON/File/Stream) from an external source for authentication to Google Cloud, you must validate it before providing it to any Google API or library. Providing an unvalidated credential configuration to Google APIs can compromise the security of your systems and data. For more information, refer to {@link https://cloud.google.com/docs/authentication/external/externally-sourced-credentials Validate credential configurations from external sources}.
     *
     * @deprecated This method is being deprecated because of a potential security risk.
     *
     * This method does not validate the credential configuration. The security
     * risk occurs when a credential configuration is accepted from a source that
     * is not under your control and used without validation on your side.
     *
     * If you know that you will be loading credential configurations of a
     * specific type, it is recommended to use a credential-type-specific
     * constructor. This will ensure that an unexpected credential type with
     * potential for malicious intent is not loaded unintentionally. You might
     * still have to do validation for certain credential types. Please follow
     * the recommendation for that method. For example, if you want to load only
     * service accounts, you can use the `JWT` constructor:
     * ```
     * const {JWT} = require('google-auth-library');
     * const keys = require('/path/to/key.json');
     * const client = new JWT({
     *   email: keys.client_email,
     *   key: keys.private_key,
     *   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
     * });
     * ```
     *
     * If you are loading your credential configuration from an untrusted source and have
     * not mitigated the risks (e.g. by validating the configuration yourself), make
     * these changes as soon as possible to prevent security risks to your environment.
     *
     * Regardless of the method used, it is always your responsibility to validate
     * configurations received from external sources.
     *
     * For more details, see https://cloud.google.com/docs/authentication/external/externally-sourced-credentials.
     *
     * @param json The input object.
     * @param options The JWT or UserRefresh options for the client
     * @returns JWT or UserRefresh Client with data
     */
    fromJSON(json, options = {}) {
      let client;
      const preferredUniverseDomain = (0, util_12.originalOrCamelOptions)(options).get("universe_domain");
      if (json.type === refreshclient_1.USER_REFRESH_ACCOUNT_TYPE) {
        client = new refreshclient_1.UserRefreshClient(options);
        client.fromJSON(json);
      } else if (json.type === impersonated_1.IMPERSONATED_ACCOUNT_TYPE) {
        client = this.fromImpersonatedJSON(json);
      } else if (json.type === baseexternalclient_12.EXTERNAL_ACCOUNT_TYPE) {
        client = externalclient_1.ExternalAccountClient.fromJSON({
          ...json,
          ...options
        });
        client.scopes = this.getAnyScopes();
      } else if (json.type === externalAccountAuthorizedUserClient_1.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) {
        client = new externalAccountAuthorizedUserClient_1.ExternalAccountAuthorizedUserClient({
          ...json,
          ...options
        });
      } else {
        options.scopes = this.scopes;
        client = new jwtclient_1.JWT(options);
        this.setGapicJWTValues(client);
        client.fromJSON(json);
      }
      if (preferredUniverseDomain) {
        client.universeDomain = preferredUniverseDomain;
      }
      return client;
    }
    /**
     * Return a JWT or UserRefreshClient from JavaScript object, caching both the
     * object used to instantiate and the client.
     * @param json The input object.
     * @param options The JWT or UserRefresh options for the client
     * @returns JWT or UserRefresh Client with data
     */
    _cacheClientFromJSON(json, options) {
      const client = this.fromJSON(json, options);
      this.jsonContent = json;
      this.cachedCredential = client;
      return client;
    }
    fromStream(inputStream, optionsOrCallback = {}, callback) {
      let options = {};
      if (typeof optionsOrCallback === "function") {
        callback = optionsOrCallback;
      } else {
        options = optionsOrCallback;
      }
      if (callback) {
        this.fromStreamAsync(inputStream, options).then((r) => callback(null, r), callback);
      } else {
        return this.fromStreamAsync(inputStream, options);
      }
    }
    fromStreamAsync(inputStream, options) {
      return new Promise((resolve, reject) => {
        if (!inputStream) {
          throw new Error("Must pass in a stream containing the Google auth settings.");
        }
        const chunks = [];
        inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => chunks.push(chunk)).on("end", () => {
          try {
            try {
              const data = JSON.parse(chunks.join(""));
              const r = this._cacheClientFromJSON(data, options);
              return resolve(r);
            } catch (err) {
              if (!this.keyFilename)
                throw err;
              const client = new jwtclient_1.JWT({
                ...this.clientOptions,
                keyFile: this.keyFilename
              });
              this.cachedCredential = client;
              this.setGapicJWTValues(client);
              return resolve(client);
            }
          } catch (err) {
            return reject(err);
          }
        });
      });
    }
    /**
     * Create a credentials instance using the given API key string.
     * The created client is not cached. In order to create and cache it use the {@link GoogleAuth.getClient `getClient`} method after first providing an {@link GoogleAuth.apiKey `apiKey`}.
     *
     * @param apiKey The API key string
     * @param options An optional options object.
     * @returns A JWT loaded from the key
     */
    fromAPIKey(apiKey, options = {}) {
      return new jwtclient_1.JWT({ ...options, apiKey });
    }
    /**
     * Determines whether the current operating system is Windows.
     * @api private
     */
    _isWindows() {
      const sys = os2.platform();
      if (sys && sys.length >= 3) {
        if (sys.substring(0, 3).toLowerCase() === "win") {
          return true;
        }
      }
      return false;
    }
    /**
     * Run the Google Cloud SDK command that prints the default project ID
     */
    async getDefaultServiceProjectId() {
      return new Promise((resolve) => {
        (0, child_process_1.exec)("gcloud config config-helper --format json", (err, stdout) => {
          if (!err && stdout) {
            try {
              const projectId = JSON.parse(stdout).configuration.properties.core.project;
              resolve(projectId);
              return;
            } catch (e) {
            }
          }
          resolve(null);
        });
      });
    }
    /**
     * Loads the project id from environment variables.
     * @api private
     */
    getProductionProjectId() {
      return process.env["GCLOUD_PROJECT"] || process.env["GOOGLE_CLOUD_PROJECT"] || process.env["gcloud_project"] || process.env["google_cloud_project"];
    }
    /**
     * Loads the project id from the GOOGLE_APPLICATION_CREDENTIALS json file.
     * @api private
     */
    async getFileProjectId() {
      if (this.cachedCredential) {
        return this.cachedCredential.projectId;
      }
      if (this.keyFilename) {
        const creds = await this.getClient();
        if (creds && creds.projectId) {
          return creds.projectId;
        }
      }
      const r = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
      if (r) {
        return r.projectId;
      } else {
        return null;
      }
    }
    /**
     * Gets the project ID from external account client if available.
     */
    async getExternalAccountClientProjectId() {
      if (!this.jsonContent || this.jsonContent.type !== baseexternalclient_12.EXTERNAL_ACCOUNT_TYPE) {
        return null;
      }
      const creds = await this.getClient();
      return await creds.getProjectId();
    }
    /**
     * Gets the Compute Engine project ID if it can be inferred.
     */
    async getGCEProjectId() {
      try {
        const r = await gcpMetadata2.project("project-id");
        return r;
      } catch (e) {
        return null;
      }
    }
    getCredentials(callback) {
      if (callback) {
        this.getCredentialsAsync().then((r) => callback(null, r), callback);
      } else {
        return this.getCredentialsAsync();
      }
    }
    async getCredentialsAsync() {
      const client = await this.getClient();
      if (client instanceof impersonated_1.Impersonated) {
        return { client_email: client.getTargetPrincipal() };
      }
      if (client instanceof baseexternalclient_12.BaseExternalAccountClient) {
        const serviceAccountEmail = client.getServiceAccountEmail();
        if (serviceAccountEmail) {
          return {
            client_email: serviceAccountEmail,
            universe_domain: client.universeDomain
          };
        }
      }
      if (this.jsonContent) {
        return {
          client_email: this.jsonContent.client_email,
          private_key: this.jsonContent.private_key,
          universe_domain: this.jsonContent.universe_domain
        };
      }
      if (await this._checkIsGCE()) {
        const [client_email, universe_domain] = await Promise.all([
          gcpMetadata2.instance("service-accounts/default/email"),
          this.getUniverseDomain()
        ]);
        return { client_email, universe_domain };
      }
      throw new Error(exports$12.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND);
    }
    /**
     * Automatically obtain an {@link AuthClient `AuthClient`} based on the
     * provided configuration. If no options were passed, use Application
     * Default Credentials.
     */
    async getClient() {
      if (this.cachedCredential) {
        return this.cachedCredential;
      }
      __privateSet(this, _pendingAuthClient, __privateGet(this, _pendingAuthClient) || __privateMethod(this, _GoogleAuth_instances, determineClient_fn).call(this));
      try {
        return await __privateGet(this, _pendingAuthClient);
      } finally {
        __privateSet(this, _pendingAuthClient, null);
      }
    }
    /**
     * Creates a client which will fetch an ID token for authorization.
     * @param targetAudience the audience for the fetched ID token.
     * @returns IdTokenClient for making HTTP calls authenticated with ID tokens.
     */
    async getIdTokenClient(targetAudience) {
      const client = await this.getClient();
      if (!("fetchIdToken" in client)) {
        throw new Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
      }
      return new idtokenclient_1.IdTokenClient({ targetAudience, idTokenProvider: client });
    }
    /**
     * Automatically obtain application default credentials, and return
     * an access token for making requests.
     */
    async getAccessToken() {
      const client = await this.getClient();
      return (await client.getAccessToken()).token;
    }
    /**
     * Obtain the HTTP headers that will provide authorization for a given
     * request.
     */
    async getRequestHeaders(url2) {
      const client = await this.getClient();
      return client.getRequestHeaders(url2);
    }
    /**
     * Obtain credentials for a request, then attach the appropriate headers to
     * the request options.
     * @param opts Axios or Request options on which to attach the headers
     */
    async authorizeRequest(opts = {}) {
      const url2 = opts.url;
      const client = await this.getClient();
      const headers = await client.getRequestHeaders(url2);
      opts.headers = gaxios_12.Gaxios.mergeHeaders(opts.headers, headers);
      return opts;
    }
    /**
     * A {@link fetch `fetch`} compliant API for {@link GoogleAuth}.
     *
     * @see {@link GoogleAuth.request} for the classic method.
     *
     * @remarks
     *
     * This is useful as a drop-in replacement for `fetch` API usage.
     *
     * @example
     *
     * ```ts
     * const auth = new GoogleAuth();
     * const fetchWithAuth: typeof fetch = (...args) => auth.fetch(...args);
     * await fetchWithAuth('https://example.com');
     * ```
     *
     * @param args `fetch` API or {@link Gaxios.fetch `Gaxios#fetch`} parameters
     * @returns the {@link GaxiosResponse} with Gaxios-added properties
     */
    async fetch(...args) {
      const client = await this.getClient();
      return client.fetch(...args);
    }
    /**
     * Automatically obtain application default credentials, and make an
     * HTTP request using the given options.
     *
     * @see {@link GoogleAuth.fetch} for the modern method.
     *
     * @param opts Axios request options for the HTTP request.
     */
    async request(opts) {
      const client = await this.getClient();
      return client.request(opts);
    }
    /**
     * Determine the compute environment in which the code is running.
     */
    getEnv() {
      return (0, envDetect_1.getEnv)();
    }
    /**
     * Sign the given data with the current private key, or go out
     * to the IAM API to sign it.
     * @param data The data to be signed.
     * @param endpoint A custom endpoint to use.
     *
     * @example
     * ```
     * sign('data', 'https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/');
     * ```
     */
    async sign(data, endpoint) {
      const client = await this.getClient();
      const universe = await this.getUniverseDomain();
      endpoint = endpoint || `https://iamcredentials.${universe}/v1/projects/-/serviceAccounts/`;
      if (client instanceof impersonated_1.Impersonated) {
        const signed = await client.sign(data);
        return signed.signedBlob;
      }
      const crypto2 = (0, crypto_12.createCrypto)();
      if (client instanceof jwtclient_1.JWT && client.key) {
        const sign3 = await crypto2.sign(client.key, data);
        return sign3;
      }
      const creds = await this.getCredentials();
      if (!creds.client_email) {
        throw new Error("Cannot sign data without `client_email`.");
      }
      return this.signBlob(crypto2, creds.client_email, data, endpoint);
    }
    async signBlob(crypto2, emailOrUniqueId, data, endpoint) {
      const url2 = new URL(endpoint + `${emailOrUniqueId}:signBlob`);
      const res = await this.request({
        method: "POST",
        url: url2.href,
        data: {
          payload: crypto2.encodeBase64StringUtf8(data)
        },
        retry: true,
        retryConfig: {
          httpMethodsToRetry: ["POST"]
        }
      });
      return res.data.signedBlob;
    }
  }
  _pendingAuthClient = new WeakMap();
  _GoogleAuth_instances = new WeakSet();
  prepareAndCacheClient_fn = async function(credential, quotaProjectIdOverride = process.env["GOOGLE_CLOUD_QUOTA_PROJECT"] || null) {
    const projectId = await this.getProjectIdOptional();
    if (quotaProjectIdOverride) {
      credential.quotaProjectId = quotaProjectIdOverride;
    }
    this.cachedCredential = credential;
    return { credential, projectId };
  };
  determineClient_fn = async function() {
    if (this.jsonContent) {
      return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
    } else if (this.keyFilename) {
      const filePath = path2.resolve(this.keyFilename);
      const stream2 = fs2.createReadStream(filePath);
      return await this.fromStreamAsync(stream2, this.clientOptions);
    } else if (this.apiKey) {
      const client = await this.fromAPIKey(this.apiKey, this.clientOptions);
      client.scopes = this.scopes;
      const { credential } = await __privateMethod(this, _GoogleAuth_instances, prepareAndCacheClient_fn).call(this, client);
      return credential;
    } else {
      const { credential } = await this.getApplicationDefaultAsync(this.clientOptions);
      return credential;
    }
  };
  exports$12.GoogleAuth = GoogleAuth;
})(googleauth);
var iam = {};
Object.defineProperty(iam, "__esModule", { value: true });
iam.IAMAuth = void 0;
class IAMAuth {
  /**
   * IAM credentials.
   *
   * @param selector the iam authority selector
   * @param token the token
   * @constructor
   */
  constructor(selector, token) {
    __publicField(this, "selector");
    __publicField(this, "token");
    this.selector = selector;
    this.token = token;
    this.selector = selector;
    this.token = token;
  }
  /**
   * Acquire the HTTP headers required to make an authenticated request.
   */
  getRequestHeaders() {
    return {
      "x-goog-iam-authority-selector": this.selector,
      "x-goog-iam-authorization-token": this.token
    };
  }
}
iam.IAMAuth = IAMAuth;
var downscopedclient = {};
(function(exports$12) {
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.DownscopedClient = exports$12.EXPIRATION_TIME_OFFSET = exports$12.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
  const gaxios_12 = src$3;
  const stream2 = require$$3;
  const authclient_12 = authclient;
  const sts = stscredentials;
  const STS_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
  const STS_REQUEST_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
  const STS_SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
  exports$12.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
  exports$12.EXPIRATION_TIME_OFFSET = 5 * 60 * 1e3;
  class DownscopedClient extends authclient_12.AuthClient {
    /**
     * Instantiates a downscoped client object using the provided source
     * AuthClient and credential access boundary rules.
     * To downscope permissions of a source AuthClient, a Credential Access
     * Boundary that specifies which resources the new credential can access, as
     * well as an upper bound on the permissions that are available on each
     * resource, has to be defined. A downscoped client can then be instantiated
     * using the source AuthClient and the Credential Access Boundary.
     * @param options the {@link DownscopedClientOptions `DownscopedClientOptions`} to use. Passing an `AuthClient` directly is **@DEPRECATED**.
     * @param credentialAccessBoundary **@DEPRECATED**. Provide a {@link DownscopedClientOptions `DownscopedClientOptions`} object in the first parameter instead.
     */
    constructor(options, credentialAccessBoundary = {
      accessBoundary: {
        accessBoundaryRules: []
      }
    }) {
      super(options instanceof authclient_12.AuthClient ? {} : options);
      __publicField(this, "authClient");
      __publicField(this, "credentialAccessBoundary");
      __publicField(this, "cachedDownscopedAccessToken");
      __publicField(this, "stsCredential");
      if (options instanceof authclient_12.AuthClient) {
        this.authClient = options;
        this.credentialAccessBoundary = credentialAccessBoundary;
      } else {
        this.authClient = options.authClient;
        this.credentialAccessBoundary = options.credentialAccessBoundary;
      }
      if (this.credentialAccessBoundary.accessBoundary.accessBoundaryRules.length === 0) {
        throw new Error("At least one access boundary rule needs to be defined.");
      } else if (this.credentialAccessBoundary.accessBoundary.accessBoundaryRules.length > exports$12.MAX_ACCESS_BOUNDARY_RULES_COUNT) {
        throw new Error(`The provided access boundary has more than ${exports$12.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
      }
      for (const rule of this.credentialAccessBoundary.accessBoundary.accessBoundaryRules) {
        if (rule.availablePermissions.length === 0) {
          throw new Error("At least one permission should be defined in access boundary rules.");
        }
      }
      this.stsCredential = new sts.StsCredentials({
        tokenExchangeEndpoint: `https://sts.${this.universeDomain}/v1/token`
      });
      this.cachedDownscopedAccessToken = null;
    }
    /**
     * Provides a mechanism to inject Downscoped access tokens directly.
     * The expiry_date field is required to facilitate determination of the token
     * expiration which would make it easier for the token consumer to handle.
     * @param credentials The Credentials object to set on the current client.
     */
    setCredentials(credentials) {
      if (!credentials.expiry_date) {
        throw new Error("The access token expiry_date field is missing in the provided credentials.");
      }
      super.setCredentials(credentials);
      this.cachedDownscopedAccessToken = credentials;
    }
    async getAccessToken() {
      if (!this.cachedDownscopedAccessToken || this.isExpired(this.cachedDownscopedAccessToken)) {
        await this.refreshAccessTokenAsync();
      }
      return {
        token: this.cachedDownscopedAccessToken.access_token,
        expirationTime: this.cachedDownscopedAccessToken.expiry_date,
        res: this.cachedDownscopedAccessToken.res
      };
    }
    /**
     * The main authentication interface. It takes an optional url which when
     * present is the endpoint being accessed, and returns a Promise which
     * resolves with authorization header fields.
     *
     * The result has the form:
     * { authorization: 'Bearer <access_token_value>' }
     */
    async getRequestHeaders() {
      const accessTokenResponse = await this.getAccessToken();
      const headers = new Headers({
        authorization: `Bearer ${accessTokenResponse.token}`
      });
      return this.addSharedMetadataHeaders(headers);
    }
    request(opts, callback) {
      if (callback) {
        this.requestAsync(opts).then((r) => callback(null, r), (e) => {
          return callback(e, e.response);
        });
      } else {
        return this.requestAsync(opts);
      }
    }
    /**
     * Authenticates the provided HTTP request, processes it and resolves with the
     * returned response.
     * @param opts The HTTP request options.
     * @param reAuthRetried Whether the current attempt is a retry after a failed attempt due to an auth failure
     * @return A promise that resolves with the successful response.
     */
    async requestAsync(opts, reAuthRetried = false) {
      let response;
      try {
        const requestHeaders = await this.getRequestHeaders();
        opts.headers = gaxios_12.Gaxios.mergeHeaders(opts.headers);
        this.addUserProjectAndAuthHeaders(opts.headers, requestHeaders);
        response = await this.transporter.request(opts);
      } catch (e) {
        const res = e.response;
        if (res) {
          const statusCode = res.status;
          const isReadableStream = res.config.data instanceof stream2.Readable;
          const isAuthErr = statusCode === 401 || statusCode === 403;
          if (!reAuthRetried && isAuthErr && !isReadableStream && this.forceRefreshOnFailure) {
            await this.refreshAccessTokenAsync();
            return await this.requestAsync(opts, true);
          }
        }
        throw e;
      }
      return response;
    }
    /**
     * Forces token refresh, even if unexpired tokens are currently cached.
     * GCP access tokens are retrieved from authclient object/source credential.
     * Then GCP access tokens are exchanged for downscoped access tokens via the
     * token exchange endpoint.
     * @return A promise that resolves with the fresh downscoped access token.
     */
    async refreshAccessTokenAsync() {
      var _a2;
      const subjectToken = (await this.authClient.getAccessToken()).token;
      const stsCredentialsOptions = {
        grantType: STS_GRANT_TYPE,
        requestedTokenType: STS_REQUEST_TOKEN_TYPE,
        subjectToken,
        subjectTokenType: STS_SUBJECT_TOKEN_TYPE
      };
      const stsResponse = await this.stsCredential.exchangeToken(stsCredentialsOptions, void 0, this.credentialAccessBoundary);
      const sourceCredExpireDate = ((_a2 = this.authClient.credentials) == null ? void 0 : _a2.expiry_date) || null;
      const expiryDate = stsResponse.expires_in ? (/* @__PURE__ */ new Date()).getTime() + stsResponse.expires_in * 1e3 : sourceCredExpireDate;
      this.cachedDownscopedAccessToken = {
        access_token: stsResponse.access_token,
        expiry_date: expiryDate,
        res: stsResponse.res
      };
      this.credentials = {};
      Object.assign(this.credentials, this.cachedDownscopedAccessToken);
      delete this.credentials.res;
      this.emit("tokens", {
        refresh_token: null,
        expiry_date: this.cachedDownscopedAccessToken.expiry_date,
        access_token: this.cachedDownscopedAccessToken.access_token,
        token_type: "Bearer",
        id_token: null
      });
      return this.cachedDownscopedAccessToken;
    }
    /**
     * Returns whether the provided credentials are expired or not.
     * If there is no expiry time, assumes the token is not expired or expiring.
     * @param downscopedAccessToken The credentials to check for expiration.
     * @return Whether the credentials are expired or not.
     */
    isExpired(downscopedAccessToken) {
      const now = (/* @__PURE__ */ new Date()).getTime();
      return downscopedAccessToken.expiry_date ? now >= downscopedAccessToken.expiry_date - this.eagerRefreshThresholdMillis : false;
    }
  }
  exports$12.DownscopedClient = DownscopedClient;
})(downscopedclient);
var passthrough = {};
Object.defineProperty(passthrough, "__esModule", { value: true });
passthrough.PassThroughClient = void 0;
const authclient_1 = authclient;
class PassThroughClient extends authclient_1.AuthClient {
  /**
   * Creates a request without any authentication headers or checks.
   *
   * @remarks
   *
   * In testing environments it may be useful to change the provided
   * {@link AuthClient.transporter} for any desired request overrides/handling.
   *
   * @param opts
   * @returns The response of the request.
   */
  async request(opts) {
    return this.transporter.request(opts);
  }
  /**
   * A required method of the base class.
   * Always will return an empty object.
   *
   * @returns {}
   */
  async getAccessToken() {
    return {};
  }
  /**
   * A required method of the base class.
   * Always will return an empty object.
   *
   * @returns {}
   */
  async getRequestHeaders() {
    return new Headers();
  }
}
passthrough.PassThroughClient = PassThroughClient;
(function(exports$12) {
  Object.defineProperty(exports$12, "__esModule", { value: true });
  exports$12.GoogleAuth = exports$12.auth = exports$12.PassThroughClient = exports$12.ExternalAccountAuthorizedUserClient = exports$12.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = exports$12.ExecutableError = exports$12.PluggableAuthClient = exports$12.DownscopedClient = exports$12.BaseExternalAccountClient = exports$12.ExternalAccountClient = exports$12.IdentityPoolClient = exports$12.AwsRequestSigner = exports$12.AwsClient = exports$12.UserRefreshClient = exports$12.LoginTicket = exports$12.ClientAuthentication = exports$12.OAuth2Client = exports$12.CodeChallengeMethod = exports$12.Impersonated = exports$12.JWT = exports$12.JWTAccess = exports$12.IdTokenClient = exports$12.IAMAuth = exports$12.GCPEnv = exports$12.Compute = exports$12.DEFAULT_UNIVERSE = exports$12.AuthClient = exports$12.gaxios = exports$12.gcpMetadata = void 0;
  const googleauth_1 = googleauth;
  Object.defineProperty(exports$12, "GoogleAuth", { enumerable: true, get: function() {
    return googleauth_1.GoogleAuth;
  } });
  exports$12.gcpMetadata = src$2;
  exports$12.gaxios = src$3;
  var authclient_12 = authclient;
  Object.defineProperty(exports$12, "AuthClient", { enumerable: true, get: function() {
    return authclient_12.AuthClient;
  } });
  Object.defineProperty(exports$12, "DEFAULT_UNIVERSE", { enumerable: true, get: function() {
    return authclient_12.DEFAULT_UNIVERSE;
  } });
  var computeclient_1 = computeclient;
  Object.defineProperty(exports$12, "Compute", { enumerable: true, get: function() {
    return computeclient_1.Compute;
  } });
  var envDetect_1 = envDetect;
  Object.defineProperty(exports$12, "GCPEnv", { enumerable: true, get: function() {
    return envDetect_1.GCPEnv;
  } });
  var iam_1 = iam;
  Object.defineProperty(exports$12, "IAMAuth", { enumerable: true, get: function() {
    return iam_1.IAMAuth;
  } });
  var idtokenclient_1 = idtokenclient;
  Object.defineProperty(exports$12, "IdTokenClient", { enumerable: true, get: function() {
    return idtokenclient_1.IdTokenClient;
  } });
  var jwtaccess_12 = jwtaccess;
  Object.defineProperty(exports$12, "JWTAccess", { enumerable: true, get: function() {
    return jwtaccess_12.JWTAccess;
  } });
  var jwtclient_1 = jwtclient;
  Object.defineProperty(exports$12, "JWT", { enumerable: true, get: function() {
    return jwtclient_1.JWT;
  } });
  var impersonated_1 = impersonated;
  Object.defineProperty(exports$12, "Impersonated", { enumerable: true, get: function() {
    return impersonated_1.Impersonated;
  } });
  var oauth2client_12 = oauth2client;
  Object.defineProperty(exports$12, "CodeChallengeMethod", { enumerable: true, get: function() {
    return oauth2client_12.CodeChallengeMethod;
  } });
  Object.defineProperty(exports$12, "OAuth2Client", { enumerable: true, get: function() {
    return oauth2client_12.OAuth2Client;
  } });
  Object.defineProperty(exports$12, "ClientAuthentication", { enumerable: true, get: function() {
    return oauth2client_12.ClientAuthentication;
  } });
  var loginticket_12 = loginticket;
  Object.defineProperty(exports$12, "LoginTicket", { enumerable: true, get: function() {
    return loginticket_12.LoginTicket;
  } });
  var refreshclient_1 = refreshclient;
  Object.defineProperty(exports$12, "UserRefreshClient", { enumerable: true, get: function() {
    return refreshclient_1.UserRefreshClient;
  } });
  var awsclient_12 = awsclient;
  Object.defineProperty(exports$12, "AwsClient", { enumerable: true, get: function() {
    return awsclient_12.AwsClient;
  } });
  var awsrequestsigner_12 = awsrequestsigner;
  Object.defineProperty(exports$12, "AwsRequestSigner", { enumerable: true, get: function() {
    return awsrequestsigner_12.AwsRequestSigner;
  } });
  var identitypoolclient_12 = identitypoolclient;
  Object.defineProperty(exports$12, "IdentityPoolClient", { enumerable: true, get: function() {
    return identitypoolclient_12.IdentityPoolClient;
  } });
  var externalclient_1 = externalclient;
  Object.defineProperty(exports$12, "ExternalAccountClient", { enumerable: true, get: function() {
    return externalclient_1.ExternalAccountClient;
  } });
  var baseexternalclient_12 = baseexternalclient;
  Object.defineProperty(exports$12, "BaseExternalAccountClient", { enumerable: true, get: function() {
    return baseexternalclient_12.BaseExternalAccountClient;
  } });
  var downscopedclient_1 = downscopedclient;
  Object.defineProperty(exports$12, "DownscopedClient", { enumerable: true, get: function() {
    return downscopedclient_1.DownscopedClient;
  } });
  var pluggable_auth_client_12 = pluggableAuthClient;
  Object.defineProperty(exports$12, "PluggableAuthClient", { enumerable: true, get: function() {
    return pluggable_auth_client_12.PluggableAuthClient;
  } });
  Object.defineProperty(exports$12, "ExecutableError", { enumerable: true, get: function() {
    return pluggable_auth_client_12.ExecutableError;
  } });
  var externalAccountAuthorizedUserClient_1 = externalAccountAuthorizedUserClient;
  Object.defineProperty(exports$12, "EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE", { enumerable: true, get: function() {
    return externalAccountAuthorizedUserClient_1.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE;
  } });
  Object.defineProperty(exports$12, "ExternalAccountAuthorizedUserClient", { enumerable: true, get: function() {
    return externalAccountAuthorizedUserClient_1.ExternalAccountAuthorizedUserClient;
  } });
  var passthrough_1 = passthrough;
  Object.defineProperty(exports$12, "PassThroughClient", { enumerable: true, get: function() {
    return passthrough_1.PassThroughClient;
  } });
  const auth = new googleauth_1.GoogleAuth();
  exports$12.auth = auth;
})(src$4);
async function loginWithGoogle() {
  const credentialsPath = path$2.join(
    process.cwd(),
    "config",
    "client_secret.json"
  );
  const credentials = JSON.parse(
    fs$4.readFileSync(credentialsPath, "utf-8")
  );
  const { client_id, client_secret } = credentials.installed;
  const redirectUri = "http://localhost:3000";
  const oauth2Client = new src$4.OAuth2Client(
    client_id,
    client_secret,
    redirectUri
  );
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (!req.url) return;
        const query = url.parse(req.url, true).query;
        const code2 = query.code;
        if (!code2) {
          res.end();
          return;
        }
        res.end("Login successful. You can close this tab.");
        server.close();
        const { tokens } = await oauth2Client.getToken(code2);
        oauth2Client.setCredentials(tokens);
        const tokenPath = path$2.join(
          app.getPath("userData"),
          "token.json"
        );
        fs$4.writeFileSync(
          tokenPath,
          JSON.stringify(tokens)
        );
        console.log("TOKEN SAVED:", tokenPath);
        resolve({ success: true });
      } catch (err) {
        resolve({
          success: false,
          error: err.message
        });
      }
    });
    server.listen(3e3);
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/drive.appdata",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/userinfo.profile"
      ]
    });
    shell.openExternal(authUrl);
  });
}
async function getUserInfo() {
  const tokenPath = path$2.join(
    app.getPath("userData"),
    "token.json"
  );
  const tokens = JSON.parse(
    fs$4.readFileSync(tokenPath, "utf-8")
  );
  const credentialsPath = path$2.join(
    process.cwd(),
    "config",
    "client_secret.json"
  );
  const credentials = JSON.parse(
    fs$4.readFileSync(credentialsPath, "utf-8")
  );
  const { client_id, client_secret } = credentials.installed;
  const oauth2Client = new src$4.OAuth2Client(
    client_id,
    client_secret
  );
  oauth2Client.setCredentials(tokens);
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    }
  );
  const data = await res.json();
  return {
    name: data.name,
    picture: data.picture
  };
}
function isAlreadyLoggedIn() {
  const tokenPath = path$2.join(
    app.getPath("userData"),
    "token.json"
  );
  return fs$4.existsSync(tokenPath);
}
async function logoutGoogle() {
  try {
    const tokenPath = path$2.join(app.getPath("userData"), "token.json");
    if (!fs$4.existsSync(tokenPath))
      return { success: true };
    const tokens = JSON.parse(fs$4.readFileSync(tokenPath, "utf-8"));
    if (tokens.acces_token) {
      await fetch(
        `https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        }
      );
    }
    fs$4.unlinkSync(tokenPath);
    console.log("TOKEN DELETED:", tokenPath);
    return { success: true };
  } catch {
    return { success: false };
  }
}
function getStorePath() {
  return path$2.join(app.getPath("userData"), "serverPaths.json");
}
function readStore() {
  const storePath = getStorePath();
  if (!fs$4.existsSync(storePath)) {
    return {};
  }
  return JSON.parse(fs$4.readFileSync(storePath, "utf-8"));
}
function writeStore(data) {
  fs$4.writeFileSync(
    getStorePath(),
    JSON.stringify(data, null, 2)
  );
}
function setServerPath(serverId, localPath) {
  const store = readStore();
  store[serverId] = localPath;
  writeStore(store);
}
function getServerPath(serverId) {
  const store = readStore();
  return store[serverId] || null;
}
const DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3/files";
const ROOT_FOLDER_NAME = "Minecraft Shared Servers";
const MAX_SERVERS = 3;
function getTokenPath() {
  return path$2.join(app.getPath("userData"), "token.json");
}
function getCredentialsPath() {
  return path$2.join(process.cwd(), "config", "client_secret.json");
}
function getOAuthClient() {
  const tokens = JSON.parse(
    fs$4.readFileSync(getTokenPath(), "utf-8")
  );
  const credentials = JSON.parse(
    fs$4.readFileSync(getCredentialsPath(), "utf-8")
  );
  const { client_id, client_secret } = credentials.installed;
  const client = new src$4.OAuth2Client(client_id, client_secret);
  client.setCredentials(tokens);
  return client;
}
async function refreshIfNeeded(client) {
  const tokens = client.credentials;
  if (!tokens.expiry_date || tokens.expiry_date <= Date.now()) {
    const { credentials } = await client.refreshAccessToken();
    client.setCredentials(credentials);
    fs$4.writeFileSync(
      getTokenPath(),
      JSON.stringify(credentials, null, 2)
    );
  }
}
async function authorizedFetch(client, url2, options) {
  await refreshIfNeeded(client);
  const accessToken = client.credentials.access_token;
  const res = await fetch(url2, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers || {}
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  if (res.status === 204) {
    return null;
  }
  const text = await res.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}
async function findRootFolder(client) {
  const query = `name='${ROOT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const url2 = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name)`;
  const data = await authorizedFetch(client, url2, {
    method: "GET"
  });
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}
async function createFolder(client, name2, parentId) {
  const body = {
    name: name2,
    mimeType: "application/vnd.google-apps.folder"
  };
  if (parentId) {
    body.parents = [parentId];
  }
  const data = await authorizedFetch(client, DRIVE_BASE_URL, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return data.id;
}
async function countServerFolders(client, rootId) {
  const query = `'${rootId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const url2 = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name)`;
  const data = await authorizedFetch(client, url2, {
    method: "GET"
  });
  return data.files || [];
}
async function createServerFolder() {
  try {
    const client = getOAuthClient();
    let rootId = await findRootFolder(client);
    if (!rootId) {
      rootId = await createFolder(client, ROOT_FOLDER_NAME);
    }
    const servers = await countServerFolders(client, rootId);
    if (servers.length >= MAX_SERVERS) {
      return {
        success: false,
        error: "Maximum 3 servers reached"
      };
    }
    const newServerName = `Server-${servers.length + 1}`;
    await createFolder(client, newServerName, rootId);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
async function deleteServerFolder(folderId) {
  try {
    const client = getOAuthClient();
    const url2 = `https://www.googleapis.com/drive/v3/files/${folderId}`;
    await authorizedFetch(client, url2, {
      method: "DELETE"
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
async function listFolderContents(client, folderId) {
  const query = `'${folderId}' in parents and trashed=false`;
  const url2 = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`;
  const data = await authorizedFetch(client, url2, {
    method: "GET"
  });
  return data.files.filter(
    (f) => f.mimeType === "application/vnd.google-apps.folder"
  ).map((f) => ({
    id: f.id,
    name: f.name
  }));
}
async function getRootWithContents() {
  try {
    const client = getOAuthClient();
    const rootId = await findRootFolder(client);
    if (!rootId) {
      return {
        success: true,
        rootId: null,
        rootName: ROOT_FOLDER_NAME,
        servers: []
      };
    }
    const servers = await listFolderContents(client, rootId);
    return {
      success: true,
      rootId,
      rootName: ROOT_FOLDER_NAME,
      servers
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
async function downloadFile(client, fileId) {
  await refreshIfNeeded(client);
  const accessToken = client.credentials.access_token;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  if (!res.ok)
    throw new Error(await res.text());
  return Buffer.from(await res.arrayBuffer());
}
async function syncServer(serverId) {
  const client = getOAuthClient();
  const targetPath = getServerPath(serverId);
  if (!targetPath) {
    return { success: false, error: "No local path set." };
  }
  const files2 = await listFolderContents(client, serverId);
  for (const file of files2) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      continue;
    }
    const data = await downloadFile(client, file.id);
    const localFilePath = path$2.join(targetPath, file.name);
    fs$4.writeFileSync(localFilePath, data);
  }
  return { success: true };
}
createRequire(import.meta.url);
const __dirname$1 = path$3.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$3.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$3.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$3.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$3.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    resizable: false,
    width: 800,
    height: 600,
    icon: path$3.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$3.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$3.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("google-login", async () => {
  const result = await loginWithGoogle();
  return result;
});
ipcMain.handle("google-get-user", async () => {
  return await getUserInfo();
});
ipcMain.handle("google-is-logged-in", () => {
  return isAlreadyLoggedIn();
});
ipcMain.handle("google-logout", async () => {
  return await logoutGoogle();
});
ipcMain.handle("drive-create-server", async () => {
  return await createServerFolder();
});
ipcMain.handle("drive-delete-server", async (_event, folderId) => {
  return await deleteServerFolder(folderId);
});
ipcMain.handle("drive-get-root", async () => {
  return await getRootWithContents();
});
ipcMain.handle("choose-directory", async () => {
  const results = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (results.canceled || results.filePaths.length === 0) return null;
  return results.filePaths[0];
});
ipcMain.handle("set-server-path", async (_, serverId) => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (result.canceled) return null;
  setServerPath(serverId, result.filePaths[0]);
  return result.filePaths[0];
});
ipcMain.handle("get-server-path", async (_, serverId) => {
  return getServerPath(serverId);
});
ipcMain.handle("sync-server", async (_, serverId) => {
  return await syncServer(serverId);
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST as M,
  RENDERER_DIST as R,
  VITE_DEV_SERVER_URL as V,
  commonjsGlobal as c
};
