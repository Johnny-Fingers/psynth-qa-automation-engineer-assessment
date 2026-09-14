#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const mapFile = path.join(__dirname, '..', 'test-impact.yml');
const changed = process.argv.slice(2);

const map = {};
let current;
for (const line of fs.readFileSync(mapFile, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const key = line.match(/^(\S+):$/);
  if (key) {
    current = key[1];
    map[current] = [];
    continue;
  }
  const spec = line.match(/^\s+-\s+(\S+)/);
  if (spec && current) map[current].push(spec[1]);
}

const specs = new Set();
for (const file of changed) {
  for (const spec of map[file] || []) specs.add(spec);
}

if (specs.size === 0) {
  console.error('No tests mapped for changed files');
  process.exit(1);
}

process.stdout.write([...specs].join(' ') + '\n');
