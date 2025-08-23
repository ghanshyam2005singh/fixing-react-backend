const fs = require('fs');
const path = require('path');

const fileProcessorPath = path.join(__dirname, 'services', 'fileProcessor.js');

// Read current file
let fileContent = fs.readFileSync(fileProcessorPath, 'utf8');

// Add the missing extractTextFromFile method
const extractTextMethod = `
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
},
`;

// Find where to insert the method (before the last closing brace)
const lastBraceIndex = fileContent.lastIndexOf('};');
if (lastBraceIndex !== -1) {
  // Insert the method before the last closing brace
  fileContent = fileContent.slice(0, lastBraceIndex) + extractTextMethod + fileContent.slice(lastBraceIndex);
} else {
  // If no closing brace found, append to the end
  fileContent += extractTextMethod;
}

// Write the updated file
fs.writeFileSync(fileProcessorPath, fileContent);

console.log('✅ Added extractTextFromFile method to fileProcessor');