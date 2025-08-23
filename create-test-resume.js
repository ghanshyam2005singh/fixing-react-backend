const fs = require('fs');
const path = require('path');

// Create a simple test resume content
const resumeContent = `
John Doe
Software Developer

Contact Information:
Email: john.doe@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/johndoe
Address: 123 Main Street, City, State 12345

Professional Summary:
Experienced software developer with 5+ years in web development, specializing in JavaScript, React, and Node.js. 
Proven track record of delivering high-quality applications and leading development teams.

Technical Skills:
• Programming Languages: JavaScript, Python, Java, TypeScript
• Frontend: React, Vue.js, HTML5, CSS3, Bootstrap
• Backend: Node.js, Express.js, Django, Spring Boot
• Databases: MongoDB, PostgreSQL, MySQL
• Tools: Git, Docker, Jenkins, AWS, Azure

Work Experience:

Senior Software Developer | Tech Corp Inc. | 2022 - Present
• Led development of microservices architecture serving 100k+ daily users
• Improved application performance by 40% through code optimization
• Mentored junior developers and conducted code reviews
• Technologies: React, Node.js, MongoDB, AWS

Software Developer | StartupXYZ | 2020 - 2022
• Developed and maintained 3 client-facing web applications
• Implemented CI/CD pipeline reducing deployment time by 60%
• Collaborated with UI/UX team to improve user experience
• Technologies: Vue.js, Express.js, PostgreSQL

Junior Developer | WebSolutions | 2019 - 2020
• Built responsive websites for small businesses
• Fixed bugs and implemented new features
• Participated in agile development process
• Technologies: HTML, CSS, JavaScript, PHP

Education:
Bachelor of Science in Computer Science
State University | 2015 - 2019
GPA: 3.8/4.0

Relevant Coursework: Data Structures, Algorithms, Database Management, Software Engineering

Projects:
E-commerce Platform | 2023
• Full-stack web application with payment integration
• Technologies: React, Node.js, Stripe API, MongoDB
• GitHub: github.com/johndoe/ecommerce

Task Management App | 2022
• Real-time collaboration tool for teams
• Technologies: Vue.js, Socket.io, Express.js
• Live Demo: taskapp.johndoe.com

Certifications:
• AWS Certified Developer Associate (2023)
• MongoDB Certified Developer (2022)
• Google Cloud Professional Cloud Developer (2021)

Languages:
• English (Native)
• Spanish (Conversational)
• French (Basic)
`;

// Write to a text file for testing
const testFilePath = path.join(__dirname, 'test-resume.txt');
fs.writeFileSync(testFilePath, resumeContent.trim());

console.log('✅ Created test resume file:', testFilePath);
console.log('📄 File size:', fs.statSync(testFilePath).size, 'bytes');
console.log('📝 Content preview:', resumeContent.substring(0, 200) + '...');