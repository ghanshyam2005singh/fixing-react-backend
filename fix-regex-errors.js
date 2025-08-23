const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, 'services', 'resumeStorageEnhanced.js');

console.log('🔍 Fixing regex syntax errors in resumeStorageEnhanced...');

// Read current content
let content = fs.readFileSync(storagePath, 'utf8');

// Fix all regex patterns with proper escaping
const regexFixes = [
  // Fix email regex
  {
    old: /\/\[A-Za-z0-9\._%-\+\]\+@\[A-Za-z0-9\.-\]\+\.\[A-Z\|a-z\]\{2,\}\//g,
    new: '/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/'
  },
  // Fix phone regex
  {
    old: /\/\(\?\:\+\?1\[-\.s\]\?\)\?\(\?\(\[0-9\]\{3\}\)\)\?\[-\.s\]\?\(\[0-9\]\{3\}\)\[-\.s\]\?\(\[0-9\]\{4\}\)\//g,
    new: '/(?:\\+?1[-\\.\\s]?)?\\(?([0-9]{3})\\)?[-\\.\\s]?([0-9]{3})[-\\.\\s]?([0-9]{4})/'
  },
  // Fix LinkedIn regex
  {
    old: /\/linkedin\.com\/in\/\(\[a-zA-Z0-9-\]\+\)\/i/g,
    new: '/linkedin\\.com\\/in\\/([a-zA-Z0-9-]+)/i'
  },
  // Fix word split regex
  {
    old: /\/\\s\+\//g,
    new: '/\\s+/'
  },
  // Fix paragraph split regex
  {
    old: /\/\\n\\s\*\\n\//g,
    new: '/\\n\\s*\\n/'
  },
  // Fix quantifiable achievements regex
  {
    old: /\/\\d\+%\|\\d\+\+\|\\d\+ \[a-z\]\/gi/g,
    new: '/\\d+%|\\d+\\+|\\d+ [a-z]/gi'
  },
  // Fix action verbs regex
  {
    old: /\/\\\b\(led\|managed\|developed\|created\|implemented\|improved\|increased\|decreased\|achieved\|delivered\)\\\b\/gi/g,
    new: '/\\b(led|managed|developed|created|implemented|improved|increased|decreased|achieved|delivered)\\b/gi'
  },
  // Fix address regex
  {
    old: /\/\\\b\(\?\:street\|st\|avenue\|ave\|road\|rd\|drive\|dr\|city\|state\|zip\)\\\b\/i/g,
    new: '/\\b(?:street|st|avenue|ave|road|rd|drive|dr|city|state|zip)\\b/i'
  }
];

// Apply all fixes
regexFixes.forEach((fix, index) => {
  const beforeLength = content.length;
  content = content.replace(fix.old, fix.new);
  const afterLength = content.length;
  if (beforeLength !== afterLength) {
    console.log(`✅ Applied regex fix ${index + 1}`);
  }
});

// Manual fixes for specific problematic lines
content = content.replace(
  /const emailMatch = text\.match\(.*?\);/,
  'const emailMatch = text.match(/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/);'
);

content = content.replace(
  /const phoneMatch = text\.match\(.*?\);/,
  'const phoneMatch = text.match(/(?:\\+?1[-\\.\\s]?)?\\(?([0-9]{3})\\)?[-\\.\\s]?([0-9]{3})[-\\.\\s]?([0-9]{4})/);'
);

content = content.replace(
  /const linkedinMatch = text\.match\(.*?\);/,
  'const linkedinMatch = text.match(/linkedin\\.com\\/in\\/([a-zA-Z0-9-]+)/i);'
);

// Fix the word splitting
content = content.replace(
  /const words = text\.trim\(\)\.split\(.*?\);/,
  'const words = text.trim().split(/\\s+/);'
);

// Fix the paragraph splitting
content = content.replace(
  /const paragraphs = text\.split\(.*?\)\.filter/,
  'const paragraphs = text.split(/\\n\\s*\\n/).filter'
);

// Fix quantifiable achievements
content = content.replace(
  /quantifiableAchievements: \(text\.match\(.*?\) \|\| \[\]\)\.length,/,
  'quantifiableAchievements: (text.match(/\\d+%|\\d+\\+|\\d+ [a-z]/gi) || []).length,'
);

// Fix action verbs
content = content.replace(
  /actionVerbsUsed: \(text\.match\(.*?\) \|\| \[\]\)\.length,/,
  'actionVerbsUsed: (text.match(/\\b(led|managed|developed|created|implemented|improved|increased|decreased|achieved|delivered)\\b/gi) || []).length,'
);

// Fix contact validation regexes
content = content.replace(
  /const hasEmail = \/.*?\/\.test\(text\);/,
  'const hasEmail = /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/.test(text);'
);

content = content.replace(
  /const hasPhone = \/.*?\/\.test\(text\);/,
  'const hasPhone = /(?:\\+?1[-\\.\\s]?)?\\(?([0-9]{3})\\)?[-\\.\\s]?([0-9]{3})[-\\.\\s]?([0-9]{4})/.test(text);'
);

content = content.replace(
  /const hasLinkedIn = \/.*?\/\.test\(text\);/,
  'const hasLinkedIn = /linkedin\\.com\\/in\\//i.test(text);'
);

content = content.replace(
  /const hasAddress = \/.*?\/\.test\(text\);/,
  'const hasAddress = /\\b(?:street|st|avenue|ave|road|rd|drive|dr|city|state|zip)\\b/i.test(text);'
);

// Fix the timestamp regex replacement
content = content.replace(
  /fileName: file\.originalname\.replace\(\/.*?\/, ''\),/,
  "fileName: file.originalname.replace(/^\\d+_/, ''),"
);

content = content.replace(
  /originalFileName: file\.originalname\.replace\(\/.*?\/, ''\),/,
  "originalFileName: file.originalname.replace(/^\\d+_/, ''),"
);

// Write the fixed content
fs.writeFileSync(storagePath, content);

console.log('✅ Fixed all regex syntax errors');
console.log('📋 Fixed patterns:');
console.log('- Email validation regex');
console.log('- Phone number validation regex');
console.log('- LinkedIn profile regex');
console.log('- Text splitting regex');
console.log('- Quantifiable achievements regex');
console.log('- Action verbs regex');
console.log('- Address validation regex');
console.log('- Timestamp removal regex');