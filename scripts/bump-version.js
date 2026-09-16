#!/usr/bin/env node
// Incrementa el patch version (x.y.Z) en app.json y package.json.
// Uso: node scripts/bump-version.js [major|minor|patch]

const fs = require('fs');
const path = require('path');

const bumpType = process.argv[2] || 'patch';
const root = path.resolve(__dirname, '..');

function bump(version) {
  const parts = version.split('.').map(Number);
  while (parts.length < 3) parts.push(0);
  let [major, minor, patch] = parts;

  if (bumpType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (bumpType === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

const appJsonPath = path.join(root, 'app.json');
const packageJsonPath = path.join(root, 'package.json');

const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const currentVersion = appJson.expo.version;
const newVersion = bump(currentVersion);

appJson.expo.version = newVersion;
packageJson.version = newVersion;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(newVersion);
