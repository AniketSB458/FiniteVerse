const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="flex items-center gap-2 md:gap-4">\n        <div className="flex items-center gap-2 md:gap-4">',
  '<div className="flex items-center gap-2 md:gap-4">'
);

fs.writeFileSync('src/App.tsx', code);
