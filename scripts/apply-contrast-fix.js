import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') walk(full, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const files = walk('src');

let changedFiles = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  const orig = content;

  // 1. Remove dark: leftovers from dark mode
  content = content.replace(/\bdark:text-(?:slate|gray|zinc|neutral)-(?:100|200|300|400)\b/g, '');
  content = content.replace(/\bdark:border-slate-(?:600|700|800)\b/g, '');
  content = content.replace(/\bdark:bg-slate-(?:600|700|800|900)\b/g, '');

  // 2. Specific dark navy banner text in portals and public pages:
  if (
    f.includes('OfficeDashboardShell.tsx') ||
    f.includes('ExamControllerDashboard.tsx') ||
    f.includes('RegistrarDashboard.tsx') ||
    f.includes('StudentApplicationsPage.tsx') ||
    f.includes('StudentDocumentsPage.tsx') ||
    f.includes('StudentResultsPage.tsx') ||
    f.includes('AdmissionPage.tsx') ||
    f.includes('ConvocationPage.tsx') ||
    f.includes('NewsPage.tsx') ||
    f.includes('ResearchPage.tsx') ||
    f.includes('StaffPortalPage.tsx') ||
    f.includes('AlumniPage.tsx') ||
    f.includes('ClubsPage.tsx') ||
    f.includes('HallsPage.tsx')
  ) {
    content = content.replace(/text-slate-300 max-w-xl/g, 'text-blue-100 max-w-xl');
    content = content.replace(/text-slate-300 max-w-2xl/g, 'text-blue-100 max-w-2xl');
    content = content.replace(/text-slate-300 mt-1 max-w-2xl/g, 'text-blue-100 mt-1 max-w-2xl');
    content = content.replace(/text-slate-300 line-clamp-3 leading-relaxed/g, 'text-blue-100 line-clamp-3 leading-relaxed');
    content = content.replace(/text-xs text-slate-300 font-mono/g, 'text-xs text-blue-100 font-mono');
    content = content.replace(/text-xs text-slate-300/g, 'text-xs text-blue-100');
    content = content.replace(/text-slate-200 max-w-2xl leading-relaxed/g, 'text-blue-100 max-w-2xl leading-relaxed');
    content = content.replace(/text-slate-200'>2,500\+ Registered/g, "text-blue-100'>2,500+ Registered");
    content = content.replace(/text-slate-200">2,500\+ Registered/g, 'text-blue-100">2,500+ Registered');
    content = content.replace(/text-slate-300 font-mono text-slate-300/g, 'text-blue-100 font-mono text-blue-100');
    content = content.replace(/text-slate-200/g, 'text-blue-100');
    content = content.replace(/bg-white\/5 text-blue-100 border-white\/10 hover:bg-white\/15/g, 'bg-white/10 text-white border-white/20 hover:bg-white/20');
  }

  // 3. Replace all remaining text-(slate|gray|zinc|neutral)-(100..400) with text-slate-600
  content = content.replace(/\btext-(?:slate|gray|zinc|neutral)-(?:100|200|300|400)\b/g, 'text-slate-600');

  // 4. Replace placeholder-slate-400 with placeholder-slate-500
  content = content.replace(/\bplaceholder-(?:slate|gray|zinc|neutral)-(?:100|200|300|400)\b/g, 'placeholder-slate-500');



  if (content !== orig) {
    fs.writeFileSync(f, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Successfully fixed contrast across ${changedFiles} files.`);
