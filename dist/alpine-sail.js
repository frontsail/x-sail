(() => {
  // src/index.js
  function src_default(Alpine) {
    Alpine.magic("sail", () => (link) => _D?.sail(link));
    Alpine.directive("sail", (el, { modifiers, expression }, { effect, evaluateLater, cleanup }) => {
      const link = { path: null, state: null, replace: false, active: null };
      const evaluator = evaluateLater(expression);
      const active = [];
      const anchor = {};
      effect(() => {
        evaluator((evaluated) => {
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
            link.state = evaluated.state ?? null;
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
        if (!_D) {
          return;
        }
        const url = _D.url(link.path);
        if (url?.origin === location.origin && url?.pathname === location.pathname) {
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
          anchor.url = url?.href ?? "";
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

  // builds/browser.js
  document.addEventListener("alpine:init", () => window.Alpine.plugin(src_default));
})();
//# sourceMappingURL=alpine-sail.js.map
