#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const mapFile = path.join(__dirname, '..', 'test-impact.yml');
const changed = process.argv.slice(2);

const exact = {};
const prefixes = [];
let fallback = [];
let current;
let isFallback = false;

for (const line of fs.readFileSync(mapFile, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const key = line.match(/^(\S+):$/);
  if (key) {
    current = key[1];
    isFallback = current === 'fallback';
    if (isFallback) {
      fallback = [];
    } else if (current.endsWith('/')) {
      prefixes.push({ prefix: current, specs: [] });
    } else {
      exact[current] = [];
    }
    continue;
  }
  const spec = line.match(/^\s+-\s+(\S+)/);
  if (spec && current) {
    if (isFallback) {
      fallback.push(spec[1]);
    } else if (current.endsWith('/')) {
      prefixes[prefixes.length - 1].specs.push(spec[1]);
    } else {
      exact[current].push(spec[1]);
    }
  }
}

// Longest prefix first so the most specific directory wins.
prefixes.sort((a, b) => b.prefix.length - a.prefix.length);

function specsFor(file) {
  if (exact[file]) return exact[file];
  for (const { prefix, specs } of prefixes) {
    if (file.startsWith(prefix)) return specs;
  }
  return [];
}

const specs = new Set();
const unmatched = [];
for (const file of changed) {
  const found = specsFor(file);
  if (found.length === 0) unmatched.push(file);
  for (const spec of found) specs.add(spec);
}

if (specs.size === 0) {
  if (fallback.length === 0) {
    console.error('No tests mapped for changed files and no fallback defined');
    process.exit(1);
  }
  console.error(
    `No tests mapped for changed files (${unmatched.join(', ') || changed.join(', ') || 'none'}); using fallback smoke: ${fallback.join(' ')}`,
  );
  process.stdout.write(fallback.join(' ') + '\n');
  return;
}

if (unmatched.length > 0) {
  console.error(`No mapping for: ${unmatched.join(', ')} (covered by mapped files)`);
}

process.stdout.write([...specs].sort().join(' ') + '\n');
