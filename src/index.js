export default function (Alpine) {
  // The magic
  Alpine.magic('sail', () => (link) => _D?.sail(link))

  // The directive
  Alpine.directive('sail', (el, { modifiers, expression }, { effect, evaluateLater, cleanup }) => {
    const link = { path: null, state: null, replace: false, active: null }
    const evaluator = evaluateLater(expression)
    const active = []
    const anchor = {}

    // Listen...
    effect(() => {
      evaluator((evaluated) => {
        // CSS classes
        active.splice(0, active.length)
        active.push(...modifiers)

        if (typeof evaluated === 'string' || typeof evaluated === 'number') {
          // The number zero should be
          // trapped here, but why would
          // anyone use 0 in an ID at all?
          link.path = evaluated.toString()
        } else if (!evaluated) {
          return unlink()
        } else if (Array.isArray(evaluated)) {
          link.path = evaluated.join('/')
        } else if (typeof evaluated === 'object') {
          // Links can provided as objects, like:
          // { path: '/sunrise', active: 'shadow' }
          link.path = Array.isArray(evaluated.path)
            ? evaluated.path.join('/')
            : evaluated.path.toString()
          link.state = evaluated.state ?? null
          link.replace = !!evaluated.replace

          if (evaluated.active) {
            active.push(...evaluated.active.split(' ').filter(Boolean))
          }
        }

        // No path,
        // No sailing.
        if (!link.path) {
          return unlink()
        }

        // Reflect URL changes on
        // active CSS classes and
        // a[href] attributes.
        if (active.length || el.tagName === 'A') {
          refresh()
          addEventListener('underscored:sailed', refresh)
        }

        // Trigger on...
        el.addEventListener('click', click)
      })
    })

    // Hard cleanup
    cleanup(() => unlink())

    /**
     * Prevent the default click action and try navigating with `_D.sail()`.
     * If the target element is an anchor with an external link, do nothing.
     *
     * @param {Event} event
     */
    function click(event) {
      if (_D && !anchor.external) {
        event.preventDefault()
        _D.sail(link)
      }
    }

    /**
     * Toggle active CSS classes when the current link is active.
     *
     * If the target element is an anchor, generate a URL from the current path
     * with `_D.url` and set it as its `href` attribute. Also, set the default
     * values of `target` and `rel` to `_blank` and `noopener noreferrer`.
     */
    function refresh() {
      // Sink...
      if (!_D) {
        return
      }

      // Create URL from path
      const url = _D.url(link.path)

      // Handle active CSS classes
      if (url?.origin === location.origin && url?.pathname === location.pathname) {
        active.forEach((className) => el.classList.add(className))
      } else {
        active.forEach((className) => el.classList.remove(className))
      }

      // Handle anchors
      if (el.tagName === 'A') {
        if (!anchor.initial) {
          // Some attributes
          // are restored
          // upon cleaning.
          anchor.initial = {
            href: el.getAttribute('href'),
            target: el.getAttribute('target'),
            rel: el.getAttribute('rel'),
          }
        }

        anchor.url = url?.href ?? ''
        anchor.external = !anchor.url.startsWith(location.origin + _D.base())
        el.setAttribute('href', anchor.url)

        if (anchor.external) {
          if (typeof anchor.initial.target !== 'string') {
            el.setAttribute('target', '_blank')
          }

          if (typeof anchor.initial.rel !== 'string') {
            el.setAttribute('rel', 'noopener noreferrer')
          }
        } else {
          restoreAnchorAttributes(['target', 'rel'])
        }
      }
    }

    /**
     * Restore initial anchor attributes.
     *
     * @param {string[]} atts
     */
    function restoreAnchorAttributes(atts = ['href', 'target', 'rel']) {
      if (anchor.initial) {
        atts.forEach((att) => {
          if (typeof anchor.initial[att] === 'string') {
            el.setAttribute(att, anchor.initial[att])
          } else {
            el.removeAttribute(att, anchor.initial[att])
          }
        })
      }
    }

    /**
     * Soft cleanup.
     */
    function unlink() {
      el.removeEventListener('click', click)
      removeEventListener('underscored:sailed', refresh)
      active.forEach((className) => el.classList.remove(className))
      restoreAnchorAttributes()
    }
  })
}
