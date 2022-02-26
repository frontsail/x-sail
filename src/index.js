export default function (Alpine) {
  Alpine.directive('sail', (el, { expression }, { effect, evaluateLater, cleanup }) => {
    if (!_D) {
      return
    }

    const link = { path: null, state: null, replace: false }
    const evaluator = evaluateLater(expression)

    effect(() => {
      evaluator((evaluated) => {
        if (typeof evaluated === 'string' || typeof evaluated === 'number') {
          link.path = evaluated.toString()
        } else if (Array.isArray(evaluated)) {
          link.path = evaluated.join('/')
        } else if (typeof evaluated === 'object') {
          // Links can also be objects, e.g.:
          // { path: '/captains/5417', state: { foo: 'bar' }, replace: true, active: 'underline' }
          link.path = Array.isArray(evaluated.path)
            ? evaluated.path.join('/')
            : evaluated.path.toString()
          link.state = evaluated.state ?? null
          link.replace = !!evaluated.replace
          link.active = evaluated.active ?? null
        }

        // Set href attribute for anchors
        if (el.tagName === 'A') {
          href()
          window.addEventListener('sail', href)
        }

        el.addEventListener('click', clicked)
      })
    })

    cleanup(() => {
      el.removeEventListener('click', clicked)
      window.removeEventListener('sail', href)
    })

    function clicked(event) {
      event.preventDefault()
      _D.sail(link)
    }

    function href() {
      el.setAttribute('href', _D.url(link.path))
    }
  })
}
