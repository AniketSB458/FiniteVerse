const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const newOptions = `
<option value="exact">Exact match</option>
<option value="even_count">Even count of target char</option>
<option value="odd_count">Odd count of target char</option>
<option value="length_div_by">Length divisible by N</option>
<option value="binary_div_by">Binary value divisible by N</option>
`.trim();

code = code.replace(/<option value="exact">Exact match<\/option>/g, newOptions);

fs.writeFileSync('src/components/Sidebar.tsx', code);
