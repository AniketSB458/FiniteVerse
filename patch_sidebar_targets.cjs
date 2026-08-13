const fs = require('fs');

let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const oldOptions = `<option value="anbn">L = aⁿbⁿ (n ≥ 0)</option>
                <option value="0n1n">L = 0ⁿ1ⁿ (n ≥ 0)</option>
                <option value="anbncn">L = aⁿbⁿcⁿ (n ≥ 0)</option>
                <option value="0n1n2n">L = 0ⁿ1ⁿ2ⁿ (n ≥ 0)</option>
                <option value="0n1n0n">L = 0ⁿ1ⁿ0ⁿ (n ≥ 0)</option>
                <option value="wwR">L = wwᴿ (Palindromes over a,b)</option>
                <option value="wwR_01">L = wwᴿ (Palindromes over 0,1)</option>
                <option value="prime">L = aᵖ (p is prime)</option>
                <option value="prime_0">L = 0ᵖ (p is prime)</option>`;

const newOptions = `<option value="anbn">L = aⁿbⁿ</option>
                <option value="0n1n">L = 0ⁿ1ⁿ</option>
                <option value="anbncn">L = aⁿbⁿcⁿ</option>
                <option value="0n1n2n">L = 0ⁿ1ⁿ2ⁿ</option>
                <option value="0n1n0n">L = 0ⁿ1ⁿ0ⁿ</option>
                <option value="wwR">L = wwᴿ (Palindromes over a,b)</option>
                <option value="wwR_01">L = wwᴿ (Palindromes over 0,1)</option>
                <option value="ww">L = ww (Copy language)</option>
                <option value="prime">L = aᵖ (p is prime)</option>
                <option value="prime_0">L = 0ᵖ (p is prime)</option>
                <option value="anbm_neq">L = aⁿbᵐ (n ≠ m)</option>
                <option value="eq_01">L = {'{w | #0(w) = #1(w)}'}</option>`;

sidebarCode = sidebarCode.replace(oldOptions, newOptions);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
