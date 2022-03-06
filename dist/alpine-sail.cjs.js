var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// builds/module.js
var module_exports = {};
__export(module_exports, {
  default: () => module_default
});

// src/index.js
function src_default(Alpine) {
  Alpine.magic("sail", () => (link) => _D == null ? void 0 : _D.sail(link));
  Alpine.directive("sail", (el, { modifiers, expression }, { effect, evaluateLater, cleanup }) => {
    const link = { path: null, state: null, replace: false, active: null };
    const evaluator = evaluateLater(expression);
    const active = [];
    const anchor = {};
    effect(() => {
      evaluator((evaluated) => {
        var _a;
        active.splice(0, active.length);
        active.push(...modifiers);
        if (typeof evaluated === "string" || typeof evaluated === "number") {
          link.path = evaluated.toString();
        } else if (!evaluated) {
          return unlink();
        } else if (Array.isArray(evaluated)) {
          link.path = evaluated.join("/");
        } else if (typeof evaluated === "object") {
          link.path = Array.isArray(evaluated.path) ? evaluated.path.join("/") : evaluated.path.toString();
          link.state = (_a = evaluated.state) != null ? _a : null;
          link.replace = !!evaluated.replace;
          if (evaluated.active) {
            active.push(...evaluated.active.split(" ").filter(Boolean));
          }
        }
        if (!link.path) {
          return unlink();
        }
        if (active.length || el.tagName === "A") {
          refresh();
          addEventListener("underscored:sailed", refresh);
        }
        el.addEventListener("click", click);
      });
    });
    cleanup(() => unlink());
    function click(event) {
      if (_D && !anchor.external) {
        event.preventDefault();
        _D.sail(link);
      }
    }
    function refresh() {
      var _a;
      if (!_D) {
        return;
      }
      const url = _D.url(link.path);
      if ((url == null ? void 0 : url.origin) === location.origin && (url == null ? void 0 : url.pathname) === location.pathname) {
        active.forEach((className) => el.classList.add(className));
      } else {
        active.forEach((className) => el.classList.remove(className));
      }
      if (el.tagName === "A") {
        if (!anchor.initial) {
          anchor.initial = {
            href: el.getAttribute("href"),
            target: el.getAttribute("target"),
            rel: el.getAttribute("rel")
          };
        }
        anchor.url = (_a = url == null ? void 0 : url.href) != null ? _a : "";
        anchor.external = !anchor.url.startsWith(location.origin + _D.base());
        el.setAttribute("href", anchor.url);
        if (anchor.external) {
          if (typeof anchor.initial.target !== "string") {
            el.setAttribute("target", "_blank");
          }
          if (typeof anchor.initial.rel !== "string") {
            el.setAttribute("rel", "noopener noreferrer");
          }
        } else {
          restoreAnchorAttributes(["target", "rel"]);
        }
      }
    }
    function restoreAnchorAttributes(atts = ["href", "target", "rel"]) {
      if (anchor.initial) {
        atts.forEach((att) => {
          if (typeof anchor.initial[att] === "string") {
            el.setAttribute(att, anchor.initial[att]);
          } else {
            el.removeAttribute(att, anchor.initial[att]);
          }
        });
      }
    }
    function unlink() {
      el.removeEventListener("click", click);
      removeEventListener("underscored:sailed", refresh);
      active.forEach((className) => el.classList.remove(className));
      restoreAnchorAttributes();
    }
  });
}

// builds/module.js
var module_default = src_default;
module.exports = __toCommonJS(module_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
