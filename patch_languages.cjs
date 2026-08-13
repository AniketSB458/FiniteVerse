const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  '<option value="anbn">L = aⁿbⁿ (n ≥ 0)</option>',
  '<option value="anbn">L = aⁿbⁿ (n ≥ 0)</option>\n                <option value="0n1n">L = 0ⁿ1ⁿ (n ≥ 0)</option>'
);

code = code.replace(
  '<option value="wwR">L = wwᴿ (Palindromes)</option>',
  '<option value="wwR">L = wwᴿ (Palindromes over a,b)</option>\n                <option value="wwR_01">L = wwᴿ (Palindromes over 0,1)</option>'
);

code = code.replace(
  '<option value="prime">L = aᵖ (p is prime)</option>',
  '<option value="prime">L = aᵖ (p is prime)</option>\n                <option value="prime_0">L = 0ᵖ (p is prime)</option>'
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
