import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') walk(full, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const files = walk('src');

// Banned low-contrast rules from Step 2
const bannedPatterns = [
  { name: 'Light text on light bg (slate/gray/zinc/neutral 100-400)', regex: /\b(?:dark:)?text-(?:slate|gray|zinc|neutral)-(?:100|200|300|400)\b/g },
  { name: 'Low opacity text (opacity 30-70)', regex: /\bopacity-(?:30|40|50|60|70)\b/g },
  { name: 'Low contrast placeholder', regex: /\bplaceholder-(?:slate|gray|zinc|neutral)-(?:100|200|300|400)\b/g },
  { name: 'Transparent / gradient-clipped text', regex: /\b(?:text-transparent|bg-clip-text)\b/g }
];

let totalViolations = 0;
const violationDetails = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Skip comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    for (const pattern of bannedPatterns) {
      const matches = line.match(pattern.regex);
      if (matches) {
        matches.forEach(m => {
          totalViolations++;
          violationDetails.push(`${file}:${index + 1} - [${pattern.name}]: "${m}" in "${trimmed}"`);
        });
      }
    }
  });
}

if (totalViolations === 0) {
  console.log(`\n✓ PASS: Contrast check verified 0 banned low-contrast violations across ${files.length} source files.`);
  process.exit(0);
} else {
  console.error(`\n✗ FAIL: Found ${totalViolations} low-contrast violation(s):\n`);
  violationDetails.slice(0, 30).forEach(d => console.error('  ' + d));
  if (violationDetails.length > 30) {
    console.error(`  ... and ${violationDetails.length - 30} more`);
  }
  process.exit(1);
}
