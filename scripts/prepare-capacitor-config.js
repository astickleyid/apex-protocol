#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cfgPath = path.resolve('capacitor.config.json');
const pkgPath = path.resolve('package.json');
const destPath = path.resolve('ios', 'App', 'App', 'config.xml');

if (!fs.existsSync(cfgPath)) {
  throw new Error('capacitor.config.json is missing.');
}
if (!fs.existsSync(pkgPath)) {
  throw new Error('package.json is missing.');
}

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (!cfg.appId) throw new Error('appId missing in capacitor.config.json');
if (!cfg.appName) throw new Error('appName missing in capacitor.config.json');
if (!pkg.version) throw new Error('version missing in package.json');

const xml = `<?xml version='1.0' encoding='utf-8'?>
<widget id="${escapeXml(cfg.appId)}" version="${escapeXml(pkg.version)}" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name>${escapeXml(cfg.appName)}</name>
  <content src="index.html" />
  <allow-navigation href="*" />
</widget>
`;

fs.writeFileSync(destPath, xml.trim() + '\n', 'utf8');
