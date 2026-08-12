import { convertLangIntersection } from './src/lib/automata.ts';
const conds = [
    {cond: 'binary_div_by', str: '3'},
    {cond: 'none', str: ''},
    {cond: 'none', str: ''}
];
const steps = convertLangIntersection(conds);
console.log("Steps length:", steps.length);
