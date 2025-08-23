const fs = require('fs');
const path = require('path');

const fileProcessorPath = path.join(__dirname, 'services', 'fileProcessor.js');

// Read the current file
let fileContent = fs.readFileSync(fileProcessorPath, 'utf8');

// Remove the incorrectly added method if it exists
fileContent = fileContent.replace(/async extractTextFromFile\(file\) {[\s\S]*?},\s*\};/, '};');

// Find the class structure and add the method correctly
const methodToAdd = `
  // Extract text from uploaded file
  async extractTextFromFile(file) {
    try {
      logger.info('Starting text extraction', {
        fileName: file?.originalname,
        fileSize: file?.size,
        mimeType: file?.mimetype
      });

      // Validate file
      this.validateFile(file);

      let extractedText = '';

      switch (file.mimetype) {
        case 'application/pdf':
          extractedText = await this.extractFromPDF(file.buffer);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          extractedText = await this.extractFromDocx(file.buffer);
          break;
        case 'text/plain':
          extractedText = file.buffer.toString('utf8');
          break;
        default:
          throw new Error(\`Unsupported file type: \${file.mimetype}\`);
      }

      // Clean and validate extracted text
      extractedText = this.cleanExtractedText(extractedText);
      
      if (!extractedText || extractedText.trim().length < this.minFileSize) {
        throw new Error('No readable text found in the file');
      }

      logger.info('Text extraction completed', {
        fileName: file?.originalname,
        extractedLength: extractedText.length,
        wordCount: extractedText.split(/\\s+/).length
      });

      return extractedText;

    } catch (error) {
      logger.error('Text extraction failed', {
        fileName: file?.originalname,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
`;

// Find the right place to insert the method (before the closing brace of the class)
if (fileContent.includes('class FileProcessor')) {
  // Find the last method and insert after it
  const lastMethodPattern = /(\s+)(\w+\([^)]*\)\s*{[^}]*}|\w+\s*=\s*[^;]+;)(\s*)}/g;
  let lastMatch;
  let match;
  
  while ((match = lastMethodPattern.exec(fileContent)) !== null) {
    lastMatch = match;
  }
  
  if (lastMatch) {
    const insertIndex = lastMatch.index + lastMatch[0].length - 1; // Before the closing }
    fileContent = fileContent.slice(0, insertIndex) + methodToAdd + '\n' + fileContent.slice(insertIndex);
  }
} else {
  // If it's a module.exports structure
  const exportPattern = /module\.exports\s*=\s*{/;
  if (exportPattern.test(fileContent)) {
    const lastBraceIndex = fileContent.lastIndexOf('};');
    if (lastBraceIndex !== -1) {
      fileContent = fileContent.slice(0, lastBraceIndex) + ',' + methodToAdd + fileContent.slice(lastBraceIndex);
    }
  }
}

// Write the corrected file
fs.writeFileSync(fileProcessorPath, fileContent);

console.log('✅ Fixed fileProcessor syntax and added extractTextFromFile method');