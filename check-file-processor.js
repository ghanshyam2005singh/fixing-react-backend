const fileProcessor = require('./services/fileProcessor');

console.log('🔍 Available fileProcessor methods:');
console.log(Object.getOwnPropertyNames(fileProcessor));
console.log('\n📝 Methods details:');
Object.getOwnPropertyNames(fileProcessor).forEach(method => {
  if (typeof fileProcessor[method] === 'function') {
    console.log(`- ${method}: function`);
  } else {
    console.log(`- ${method}: ${typeof fileProcessor[method]}`);
  }
});