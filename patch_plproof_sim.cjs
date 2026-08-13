const fs = require('fs');
let code = fs.readFileSync('src/components/PumpingLemmaProof.tsx', 'utf8');

code = code.replace(
  "export const PumpingLemmaProof = ({ plState }: { plState: PumpingLemmaState }) => {",
  "export const PumpingLemmaProof = ({ plState, isSimulating }: { plState: PumpingLemmaState, isSimulating?: boolean }) => {"
);

// Wrap step 2 and 3 in isSimulating check
const step2Start = `<div className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
          <h3 className="font-bold border-b border-border-subtle pb-2">2. Your Validations</h3>`;

const step2StartReplacement = `
        {!isSimulating ? (
          <div className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm text-center flex flex-col items-center justify-center py-12">
             <div className="w-16 h-16 rounded-full bg-accent-main/10 text-accent-main flex items-center justify-center mb-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <h3 className="font-bold text-lg mb-2">Ready to Validate</h3>
             <p className="text-sm text-text-muted max-w-md mx-auto">Fill in the options on the sidebar and click <strong>Run Simulator</strong> at the top right to validate your choices and see the pumping contradiction.</p>
          </div>
        ) : (
          <>
        <div className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
          <h3 className="font-bold border-b border-border-subtle pb-2">2. Your Validations</h3>`;

code = code.replace(step2Start, step2StartReplacement);

// Close the <></> wrapper after step 3
const step3End = `            </div>
          </motion.div>
        )}`;

const step3EndReplacement = `            </div>
          </motion.div>
        )}
        </>
        )}`;

code = code.replace(step3End, step3EndReplacement);

fs.writeFileSync('src/components/PumpingLemmaProof.tsx', code);
