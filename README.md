# tent

Tent is a `package.json` builder for your javascript files. It allows you to chain together a `package.json` from a series of reusable functions. Tent is a way of managing a `node module` with only one javascript file.

# Why?

I've been having an itch no for a very long time that I just cant scratch.

> _I want to create small modules fast_.

Take the example of this `left-pad` function from [Guillermo Rauch](https://gist.github.com/rauchg/5b032c2c2166e4e36713).

```js
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n)
```

There's several barriers preventing you from getting this simple line of code up on `npm`, mainly getting babel ready. I normally try and copy and paste together a `package.json` file from different projects I recently even made a small [script to edit the `package.json`](https://gist.github.com/reggi/8035dcbdf0fb73b8c8703a4d244f15cf).

Here's the solution:

```js
import { tentBabel, tentPostinstall } from 'tent'
export const def = ['reggi-left-pad@1.0.0', [
  tentBabel({presets: ['es2015'], 'buildScript': "build"}), tentPostinstall('npm run build')
]]
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n)
```

By adding a couple of lines to your file you have everything you need to get this small snippet up and running on npm.

You can even just save your most commonly used `tent` settings in its own module.

```js
import { tentAuthor, tentBabel, tentPrepublish } from 'tent'

export default [
  tentAuthor('Thomas Reggi'),
  tentBabel({presets: ['es2015'], 'buildScript': "build"}),
  tentPostinstall('npm run build')
]
```

And pull them in like this.

```js
import myTent from 'thomas-reggis-tent'
export const def = ['reggi-left-pad@1.0.0', myTent()]
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n)
```

# Spec

## Version in module declaration (not yet implemented)

This module syntax will support versions in the `import`'s `from` call.

```js
import lodash from 'lodash@4.11.1'
```

This will allow you to totally omit creating a `package.json` file manually.

What makes this possible is that `tent` searches the AST of your module file and will parse out the module from the version. When the `package.json` is created it will install `lodash` version `4.11.1`. Then in order to get the call to `lodash@4.11.1` working we create a folder called `lodash@4.11.1` in `node_modules` with one file, a `package.json`, where the `main` is set to `../lodash`. Note that this method does **not** use symlinks! More on how this works here [`module-assign`](https://github.com/reggi/module-assign).

When no version is specified npm will install the latest version of the module.

## exporting `def`

The definition is an array with two arguments. The first is the `name@version` of the module and the second is either a package function or an array of package functions.

```js
export const def = ['reggi-left-pad@1.0.0', myTent()]
```

A package function is a function that is bound to some instance variables for the module. they are double nested functions. and look like this. Every function returns just the objects that will be deep assigned to `package.json`.

```js
export function tentAuthor (author) {
  return function () {
    return { author }
  }
}
```

Each innermost function has access to these variables.

* `this.file` (the full file path)
* `this.parsedPath` (path of the module parsed by path.parse)
* `this.name` (name of the module)
* `this.version` (version of the module)
* `this.processDeps` (method that takes array of modules and returns deps with versions)
* `this.package` (the package at the time this middleware runs)

# CLI Tools

* `build-package` (echos the pretty json package built from module)
* `build-module` (builds the full module and runs npm install)
* `publish` (builds the module, then publishes it to npm)
* `build-gist` (downloads all files in gist and builds each as a module)
* `publish-gist` (downloads all files in gist and builds each as a module and publishes)

To go from 0 to 100 real-quick all you have to do is have the url for a gist like this.

```
tent publish-gist https://gist.github.com/reggi/ca7a486ccd5307f58fa5b0d4ded3fadb --temp
```

> The last project I will ever have to `npm init -y`.
