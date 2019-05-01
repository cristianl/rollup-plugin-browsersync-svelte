# Rollup Svelte 3 + Browsersync

Use Browsersync with Svelte 3 projects. Injects CSS changes from svelte components, and reloads on changes to markup or the `<script>` block.

> IMPORTANT: This plugin is temporary and experimental. It does not have tests, and is not available on npm.
> Currently, it requires usage of a [custom fork of the Svelte compiler](https://github.com/cristianl/svelte/tree/css-hash-patch) with a minor change to how scoped CSS hashes are generated.


## Usage

In your *rollup.config.js*:

```js
// ...

import { browsersync, bsInstance } from 'rollup-plugin-browsersync-svelte';

export default {
  // ...

  plugins: [
    svelte({
      // Add 
      css: css => {
        css.write('public/bundle.css');
        if (!production) {
          bsInstance.reload('public/bundle.css');
        }
      }
    }),
    
    // ...
    
    !production && browsersync(bsOpts)
    
    // ...
  ]
};
```

## On named exports

`browsersync` is a named export (see usage above). This pattern is atypical for Rollup plugins. I wanted to expose the browsersync instance (`bsInstance`). There are other, less practical ways to reach the browsersync instance from your Rollup config ([custom callback in BS options](https://browsersync.io/docs/options#option-callbacks), or the [browsersync get method](https://browsersync.io/docs/api#api-get)).


## Known issue: some CSS changes cause normal reloads

When you add or remove a selector, Browsersync may perform a full reload. This happens because Svelte generates code to add hashed classes to your component's DOM from selectors it detects in the `<style>` block.

Tip: You can add selectors beforehand and leave their blocks empty.


## Other solutions

This plugin is based on [rollup-plugin-browsersync](https://github.com/4lejandrito/rollup-plugin-browsersync), a more stable solution not specific to Svelte projects. rollup-plugin-browsersync doesn't support injection of CSS generated by the Svelte compiler.
