const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const rightSideStart = code.indexOf('<div className="flex items-center gap-2 md:gap-6">');
const headerEnd = code.indexOf('</header>');

if (rightSideStart !== -1 && headerEnd !== -1) {
  let oldHeaderRight = code.substring(rightSideStart, headerEnd);
  
  // Replace the closing div of the first block and the opening div of the second block with nothing (merging them)
  oldHeaderRight = oldHeaderRight.replace(
    /<\/div>\n\s*<div className="flex items-center gap-4">/,
    ''
  );
  
  // Actually a safer way is to just wrap the last two children in a parent div.
  const oldHeader = code.substring(code.indexOf('<header'), headerEnd + 9);
  
  let newHeader = oldHeader.replace('<div className="flex items-center gap-2 md:gap-6">', '<div className="flex items-center gap-2 md:gap-4">\n        <div className="flex items-center gap-2 md:gap-4">');
  
  newHeader = newHeader.replace('<div className="flex items-center gap-4">', '<div className="flex items-center gap-2">');
  newHeader = newHeader.replace('</header>', '  </div>\n      </header>');
  
  code = code.replace(oldHeader, newHeader);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Header patched");
}
