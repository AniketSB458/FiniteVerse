import { convertLangIntersection } from './src/lib/automata.ts';
const conds = [
    {cond: 'even_count', str: 'a'},
    {cond: 'binary_div_by', str: '3'}
];
const steps = convertLangIntersection(conds);
console.log("Steps length:", steps.length);
