const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');

function getFileLinks(html) {
  const links = [];
  const hrefRegex = /href\s*=\s*"([^"]+)"/g;
  const srcRegex = /src\s*=\s*"([^"]+)"/g;

  const hrefMatches = html.matchAll(hrefRegex);
  for (const match of hrefMatches) {
    links.push(match[1]);
  }

  const srcMatches = html.matchAll(srcRegex);
  for (const match of srcMatches) {
    links.push(match[1]);
  }

  return links;
}

function isExternalLink(link) {
  return /^https?:\/\//i.test(link) || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#');
}

function resolveLocalPath(link) {
  const normalized = link.split('?')[0].split('#')[0];
  if (!normalized) {
    return null;
  }

  const fromRoot = normalized.startsWith('/') ? normalized.slice(1) : normalized;
  return path.join(__dirname, '..', fromRoot);
}

function checkLinks() {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const links = getFileLinks(html);
  const missing = [];

  for (const link of links) {
    if (isExternalLink(link)) {
      continue;
    }

    const filePath = resolveLocalPath(link);
    if (!filePath) {
      continue;
    }

    if (!fs.existsSync(filePath)) {
      missing.push(link);
    }
  }

  if (missing.length > 0) {
    console.error('Broken local links detected:');
    missing.forEach(link => {
      console.error(`- ${link}`);
    });
    process.exit(1);
  }

  console.log('All local links in index.html are valid.');
}

checkLinks();
