# Skate Results for Graphite

A [Graphite](https://www.graphite-engine.com) extension that connects a Graphite event with an event on
[Skate Results](https://skateresults.app).

> **Mockup.** This first version only reads public data from Skate Results. Nothing is synchronized
> yet and the API key of a Skate Results account is not supported yet.

What it does:

- adds a **Skate Results** sidebar to every event, showing the linked Skate Results event with its
  age groups and competitions
- adds a settings page to search the public Skate Results events by name or city and link one to the
  Graphite event; the link is stored in the browser
- shows a **mapping preview** of the event's Graphite classes next to the Skate Results age groups
  they would be matched to

The extension only has a UI. It reads the public, read-only [Skate Results API](https://github.com/skateresults/api-client)
(`https://api.skateresults.app`) directly from the browser.

## Install

Open an event in Graphite, open the **Extensions** sidebar, pick **Skate Results** from the registry
and enable it. Then open the **Skate Results** sidebar and link an event.

## Develop

Requires Node.js 22 or newer.

```bash
cd ui
npm install
npm run dev        # serves the extension on http://localhost:3002
```

In Graphite, open an event, open the **Extensions** sidebar, expand **Plugin developers**, add a
**Dev extension** with the identifier `skateresults` and the entry URL
`http://localhost:3002/mf-manifest.json` and enable it. Reload the engine after changes.

`npm run typecheck` type-checks against [`@graphite-sports/sdk`](https://www.npmjs.com/package/@graphite-sports/sdk),
`npm run i18n` regenerates the translation types after changing `ui/src/i18n/en`.

## Package and publish

```bash
node scripts/package.mjs                          # writes dist/skateresults-<version>.zip
REGISTRY_TOKEN=… node scripts/publish.mjs         # publishes it to registry.graphite-engine.com
```

The zip can also be installed on a self-hosted engine with the **+** button of the **Extensions**
sidebar. Publishing needs a registry token with the `publish` scope; a version can only be published
once, bump `version` in `extension.json` for the next one.

## License

[MIT](LICENSE)
