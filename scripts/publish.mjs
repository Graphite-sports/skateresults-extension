// Publishes dist/<name>-<version>.zip (run scripts/package.mjs first) to the Graphite registry.
// The package only contains the UI, so it is published once for the platform `any`.
// Usage: REGISTRY_TOKEN=… node scripts/publish.mjs   (token with the `publish` scope; Node >= 22)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const registry = process.env.REGISTRY_URL ?? 'https://registry.graphite-engine.com';
const token = process.env.REGISTRY_TOKEN;
if (!token) throw new Error('REGISTRY_TOKEN is required');
const { name, identifier, version, description, author } = JSON.parse(readFileSync(join(root, 'extension.json'), 'utf8'));
const zipName = `${name}-${version}.zip`;

const form = new FormData();
form.append('artifact', new Blob([readFileSync(join(root, 'dist', zipName))], { type: 'application/zip' }), zipName);
const metadata = { name: 'Skate Results', description, kind: 'extension', metadata: { identifier, author } };
form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }), 'metadata.json');
form.append('readme', new Blob([readFileSync(join(root, 'README.md'))], { type: 'text/markdown' }), 'README.md');

const url = `${registry}/packages/${identifier}/${version}/any`;
const response = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: form });
console.log(`PUT ${url}: ${response.status} ${await response.text()}`);
if (!response.ok) process.exit(1);
