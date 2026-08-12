const fs = require('fs');
let appCode = fs.readFileSync('src/lib/automata.ts', 'utf8');

const buildLangDFASnippet = "    const deadState = `${prefix}d`;\n    let usesDeadState = false;";
const noneSnippet = `    const deadState = \`\${prefix}d\`;
    let usesDeadState = false;

    if (condition === 'none') {
        states.push(\`\${prefix}0\`);
        for (const sym of alphabet) {
            transitions.push({ from: \`\${prefix}0\`, symbol: sym, to: \`\${prefix}0\` });
        }
        acceptStates.push(\`\${prefix}0\`);
        return { states, transitions, startState: \`\${prefix}0\`, acceptStates };
    }`;

appCode = appCode.replace(buildLangDFASnippet, noneSnippet);
fs.writeFileSync('src/lib/automata.ts', appCode);

let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Replace both selects to have "none" option
sidebarCode = sidebarCode.replace(
  /<option value="starts_with">Starts with<\/option>/g,
  '<option value="none">None (Ignore condition)</option>\n                    <option value="starts_with">Starts with</option>'
);

sidebarCode = sidebarCode.replace(
  '<option value="none">None (Ignore condition)</option>\n                    <option value="starts_with">Starts with</option>',
  '<option value="none">None (Ignore condition)</option>\n                    <option value="starts_with">Starts with</option>'
); // wait, it might replace both if using /g. Let's use /g on a broader snippet.

