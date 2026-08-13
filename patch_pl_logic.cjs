const fs = require('fs');

let proofCode = fs.readFileSync('src/components/PumpingLemmaProof.tsx', 'utf8');

const oldLogic = `if (lang === '0n1n0n') {
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

const newLogic = `if (lang === '0n1n0n') {
      if (!/^0*1*0*$/.test(str)) return false;
      const match = str.match(/^(0*)(1*)(0*)$/);
      if (!match) return false;
      return match[1].length === match[2].length && match[2].length === match[3].length;
    }
    if (lang === 'ww') {
      if (str.length % 2 !== 0) return false;
      const half1 = str.substring(0, str.length / 2);
      const half2 = str.substring(str.length / 2);
      return half1 === half2;
    }
    if (lang === 'anbm_neq') {
      if (!/^a*b*$/.test(str)) return false;
      const countA = (str.match(/a/g) || []).length;
      const countB = (str.match(/b/g) || []).length;
      return countA !== countB;
    }
    if (lang === 'eq_01') {
      if (!/^[01]*$/.test(str)) return false;
      const count0 = (str.match(/0/g) || []).length;
      const count1 = (str.match(/1/g) || []).length;
      return count0 === count1;
    }`;

proofCode = proofCode.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/PumpingLemmaProof.tsx', proofCode);

