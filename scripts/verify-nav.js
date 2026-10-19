const fs = require('fs');

const files = [
  'portal.html',
  'management.html',
  'student.html',
  'teacher.html',
  'parent.html'
];

let allPassed = true;

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const hasBackdrop = content.includes('id="portalBackdrop"');
  const hasCloseBtn = content.includes('id="sidebarCloseBtn"');
  console.log(`${f}: hasBackdrop=${hasBackdrop}, hasCloseBtn=${hasCloseBtn}`);
  if (!hasBackdrop || !hasCloseBtn) allPassed = false;
}

const jsFiles = [
  { file: 'js/portal.js', check: 'closePortalMobileSidebar' },
  { file: 'js/student.js', check: 'closeStudentMobileSidebar' },
  { file: 'js/teacher.js', check: 'closeTeacherMobileSidebar' },
  { file: 'js/parent.js', check: 'closeParentMobileSidebar' },
  { file: 'js/app.js', check: 'menuLinks.forEach' }
];

for (const item of jsFiles) {
  const c = fs.readFileSync(item.file, 'utf8');
  const hasFunc = c.includes(item.check);
  console.log(`${item.file}: has '${item.check}' = ${hasFunc}`);
  if (!hasFunc) allPassed = false;
}

console.log('RESULT:', allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED');
process.exit(allPassed ? 0 : 1);
