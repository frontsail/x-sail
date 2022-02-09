export default function (Alpine) {
  Alpine.directive('sail', (el, { expression }, { effect, evaluateLater, cleanup }) => {
    if (!_D) {
      return
    }

    const link = { path: null, state: null, replace: false }
    const evaluator = evaluateLater(expression)

    effect(() => {
      evaluator((evaluated) => {
        if (typeof evaluated === 'string') {
          link.path = evaluated
        } else if (Array.isArray(evaluated)) {
          link.path = evaluated.join('/')
        } else if (typeof evaluated === 'object') {
          // Links can also be objects, e.g.:
          // { path: '/captains/5417', state: { foo: 'bar' }, replace: true }
          link.path = evaluated.path
          link.state = evaluated.state ?? null
          link.replace = !!evaluated.replace
        } else {
          link.path = evaluated.toString()
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
