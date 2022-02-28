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
        } else if (!evaluated) {
          return unlink()
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

        // Do nothing without a path
        if (!link.path) {
          return unlink()
        }

        // Set href attribute for anchors
        if (el.tagName === 'A') {
          href()
          addEventListener('underscored:sailed', href)
        }

        el.addEventListener('click', click)
      })
    })

    cleanup(() => unlink())

    function click(event) {
      event.preventDefault()
      _D.sail(link)
    }

    function href() {
      el.setAttribute('href', _D.url(link.path))
    }

    function unlink() {
      el.removeAttribute('href')
      el.removeEventListener('click', click)
      removeEventListener('underscored:sailed', href)
    }
  })
}
