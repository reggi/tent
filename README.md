# nift

> The last project I will ever have to `npm init -y`.

Nift is a `package.json` builder for your javascript files.

It allows you to chain together a `package.json` into a series of steps.

Nift is a way of managing a `node module` with only one javascript file.

Nift allows you to define how the file should be installed and published.

# Pieces

1. The dependency finder, without this, you can't have any dependencies in your `package.json` and your javascript will never work. `niftDeps()` will be one of the only pre-registered package tasks.
