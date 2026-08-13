const fs = require('fs');

let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
const oldOptions = `<option value="anbn">L = aⁿbⁿ (n ≥ 0)</option>
                <option value="0n1n">L = 0ⁿ1ⁿ (n ≥ 0)</option>`;
const newOptions = `<option value="anbn">L = aⁿbⁿ (n ≥ 0)</option>
                <option value="0n1n">L = 0ⁿ1ⁿ (n ≥ 0)</option>
                <option value="anbncn">L = aⁿbⁿcⁿ (n ≥ 0)</option>
                <option value="0n1n2n">L = 0ⁿ1ⁿ2ⁿ (n ≥ 0)</option>
                <option value="0n1n0n">L = 0ⁿ1ⁿ0ⁿ (n ≥ 0)</option>`;
sidebarCode = sidebarCode.replace(oldOptions, newOptions);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);

let proofCode = fs.readFileSync('src/components/PumpingLemmaProof.tsx', 'utf8');

const oldLogic = `if (lang === '0n1n') {
      if (!/^0*1*$/.test(str)) return false;
      return (str.match(/0/g) || []).length === (str.match(/1/g) || []).length;
    }`;

const newLogic = `if (lang === '0n1n') {
      if (!/^0*1*$/.test(str)) return false;
      return (str.match(/0/g) || []).length === (str.match(/1/g) || []).length;
    }
    if (lang === 'anbncn') {
      if (!/^a*b*c*$/.test(str)) return false;
      const countA = (str.match(/a/g) || []).length;
      const countB = (str.match(/b/g) || []).length;
      const countC = (str.match(/c/g) || []).length;
      return countA === countB && countB === countC;
    }
    if (lang === '0n1n2n') {
      if (!/^0*1*2*$/.test(str)) return false;
      const count0 = (str.match(/0/g) || []).length;
      const count1 = (str.match(/1/g) || []).length;
      const count2 = (str.match(/2/g) || []).length;
      return count0 === count1 && count1 === count2;
    }
    if (lang === '0n1n0n') {
      if (!/^0*1*0*$/.test(str)) return false;
      const parts = str.match(/0+|1+/g) || [];
      if (str === '') return true;
      if (parts.length > 3) return false;
      // Because we can have 0s then 1s then 0s. 
      // But regex /^0*1*0*$/ enforces order.
      // So let's extract the exact counts of each section by splitting on the character transitions, but since there could be empty sections we have to be careful.
      // Actually regex capture is safer:
      const match = str.match(/^(0*)(1*)(0*)$/);
      if (!match) return false;
      return match[1].length === match[2].length && match[2].length === match[3].length;
    }`;

proofCode = proofCode.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/PumpingLemmaProof.tsx', proofCode);

