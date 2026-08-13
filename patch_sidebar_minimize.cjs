const fs = require('fs');
const file = 'src/components/Sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<option value="NFA_TO_DFA">NFA → DFA</option>',
  `<option value="NFA_TO_DFA">NFA → DFA</option>
          <option value="DFA_MINIMIZATION">DFA Minimization</option>
          <option value="PUMPING_LEMMA">Pumping Lemma Analysis</option>`
);

fs.writeFileSync(file, code);
