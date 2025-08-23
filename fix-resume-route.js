const fs = require('fs');
const path = require('path');

const resumeRoutePath = path.join(__dirname, 'routes', 'resume.js');

// Read the current file
let content = fs.readFileSync(resumeRoutePath, 'utf8');

// Replace the old method call with the new one
content = content.replace(
  'resumeText = await fileProcessor.extractText(req.file);',
  'resumeText = await fileProcessor.extractTextFromFile(req.file);'
);

// Also update the geminiService call to use correct method name
content = content.replace(
  /analysis = await geminiService\.analyzeResume\(sanitizedText,\s*{[^}]*}\s*\);/g,
  `analysis = await geminiService.analyzeResume(sanitizedText, {
            gender,
            roastLevel,
            roastType,
            language
          }, req.file.originalname);`
);

fs.writeFileSync(resumeRoutePath, content);
console.log('✅ Fixed resume route to use correct methods');