const fs = require('fs');
const path = require('path');

const fileProcessorPath = path.join(__dirname, 'services', 'fileProcessor.js');

// Read the current file
let content = fs.readFileSync(fileProcessorPath, 'utf8');

// Remove any incorrectly added methods
content = content.replace(/,?\s*async extractTextFromFile[\s\S]*?}\s*,?\s*$/gm, '');
content = content.replace(/,?\s*extractTextFromFile[\s\S]*?}\s*,?\s*$/gm, '');

// Find the right place to add the method
if (content.includes('module.exports = {')) {
  // Module exports format
  const beforeClosing = content.lastIndexOf('};');
  if (beforeClosing !== -1) {
    const methodCode = `,

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
  }`;

    content = content.slice(0, beforeClosing) + methodCode + content.slice(beforeClosing);
  }
} else if (content.includes('class FileProcessor')) {
  // Class format
  const beforeClassEnd = content.lastIndexOf('}');
  if (beforeClassEnd !== -1) {
    const methodCode = `
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
    content = content.slice(0, beforeClassEnd) + methodCode + content.slice(beforeClassEnd);
  }
}

fs.writeFileSync(fileProcessorPath, content);
console.log('✅ Fixed fileProcessor extractTextFromFile method');