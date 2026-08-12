const fs = require('fs');
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

sidebarCode = sidebarCode.replace(
  /<option value="starts_with">Starts with<\/option>/g,
  '<option value="none">None (Ignore condition)</option>\n                    <option value="starts_with">Starts with</option>'
);

// We need to fix the indentation later but it's jsx so spaces don't matter that much.
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
