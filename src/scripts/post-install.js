const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../node_modules/underscore/package.json');
try {
  let content = fs.readFileSync(filePath, 'utf8');
  // Example fix: replace dependencies array with an empty object or correct JSON
  content = content.replace(/"dependencies":\s*\[[^\]]*\]/, '"dependencies": {}');
  // Add more regex replacements as needed based on your exact issue

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed malformed package.json in underscore');
} catch (err) {
  console.error('Error fixing package.json:', err);
}
