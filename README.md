<p>
  <a href="https://www.frontsail.com/#gh-light-mode-only" target="_blank">
    <img src="https://brand.frontsail.com/logo-github-dark.svg" alt="A FrontSail project" width="120" height="80">
  </a>
  <a href="https://www.frontsail.com/#gh-dark-mode-only" target="_blank">
    <img src="https://brand.frontsail.com/logo-github-light.svg" alt="A FrontSail project" width="120" height="80">
  </a>
</p>

<p>
  <a href="https://github.com/frontsail/x-sail/releases"><img src="https://img.shields.io/github/v/release/frontsail/x-sail?display_name=tag&style=flat-square" alt="Latest Release"></a>
  <a href="https://github.com/frontsail/x-sail/blob/main/LICENSE"><img src="https://img.shields.io/github/license/frontsail/x-sail.svg?style=flat-square" alt="License"></a>
</p>

# @frontsail/alpine-sail

This [Alpine](https://github.com/alpinejs/alpine) plugin adds the magics `$sail` and `$resail`, and the directive `x-sail` to the Alpine scope. Its purpose is to handle HTML router links for navigating app routes created in [FrontSail](https://www.frontsail.com).

If you are building your app with FrontSail or its core library [Underscored](https://github.com/frontsail/underscored), do not manually install this plugin as it is already included with Underscored.

## $sail

The `$sail` magic is a direct wrapper for the `_D.sail` method from Underscored. It accepts a string, number, array of strings and numbers, or an object as an argument. When invoked, it attempts to resolve the routes for the specified path in the argument and change the current URL without reloading the page.

```js
$sail('/captains')
// > http://localhost/captains

$sail(1)
// > http://localhost/captains/1

$sail({ path: '..', state: { foo })
// > http://localhost/captains

$sail({ path: '/', replace: true })
// > http://localhost

history.back()
// > http://localhost/captains/1
```

You can learn more about `_D.sail` on the official [documentation page](https://www.frontsail.com/docs/routing#sail).

## $resail

Just like the previous magic, `$resail` calls the Underscored method `_D.resail` directly, which replaces the current history state in the browser instead of pushing a new one. It accepts the same argument as `$sail`.

## x-sail

The `x-sail` directive can be used in HTML anchors in place of the standard `href` attribute, or in any other elements. When the element is clicked, it calls `_D.sail` with its evaluated attribute value as the method argument. A `href` attribute is automatically created and updated on every URL change if the directive is applied to an anchor.

### Absolute and relative paths

Paths beginning with a forward slash (`/`) are absolute and appended to the app's base URL.

```js
console.log(location.href, _D.base())
// > http://localhost/app/captains, /app

$sail('/settings')
// > http://localhost/app/settings
```

All other paths are considered relative to the current URL.

```js
console.log(location.href, _D.base())
// > http://localhost/app/captains, /app

$sail('settings')
// > http://localhost/app/captains/settings
```

### URLs

If an internal URL is provided instead of the path, the app's base URL is automatically removed. When navigating within your application, always try to use a path and not the full URL.

For external URLs, `x-sail` sets the default values of the `target` and `rel` attributes to `_blank` and `noopener noreferrer`, respectively. You can override this behavior by adding these attributes and specifying their values manually, or simply use the `href` attribute instead of `x-sail`.

### Active classes

You can automatically toggle CSS classes when a router link is active by adding the class names as dot separated modifiers.

```html
<a x-sail.underline.text-blue-400="'/'">Home</a>
```

Alternatively, you can pass the class names as an object parameter.

```html
<a x-sail="{ path: '/', active: 'underline text-blue-400' }">Home</a>
